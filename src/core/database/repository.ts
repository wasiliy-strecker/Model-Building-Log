import {
  SerialQueue,
  type Repository,
  type ReportPageRequest,
  type SqlConnection,
} from '../ports';
import {
  type BuildStep,
  type SavedReport,
  reportSchema,
  type Project,
  type Snapshot,
  type BuildStepDraft,
  type ProjectPhoto,
  PAGE_SIZE,
  projectSchema,
  stepSchema,
  validateSnapshot,
} from '../domain/models';

const order = 'occurred_at DESC,created_at DESC,id DESC';
function latestPhotoQuery(projectId: '?' | 'p.id') {
  return `SELECT json_object('stepId',s.id,'number',json_extract(s.body,'$.number'),
    'title',json_extract(s.body,'$.title'),'occurredAt',s.occurred_at,'photo',json(a.value)) body
    FROM steps s,json_each(s.body,'$.photos') a WHERE s.project_id=${projectId}
    ORDER BY s.occurred_at DESC,s.created_at DESC,s.id DESC,CAST(a.key AS INTEGER) ASC LIMIT 1`;
}

export async function migrate(db: SqlConnection): Promise<void> {
  await db.exec(
    'PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;',
  );
  const version =
    (await db.all<{ user_version: number }>('PRAGMA user_version'))[0]
      ?.user_version ?? 0;
  if (version > 2)
    throw new Error(
      'Die Datenbank stammt aus einer neueren ModellbauLog-Version.',
    );
  if (version === 2) return;
  await db.exec('BEGIN IMMEDIATE');
  try {
    if (version === 0)
      await db.exec(`
      CREATE TABLE projects (id TEXT PRIMARY KEY, body TEXT NOT NULL CHECK(json_valid(body)));
      CREATE TABLE steps (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, occurred_at TEXT NOT NULL, created_at TEXT NOT NULL, search TEXT NOT NULL, body TEXT NOT NULL CHECK(json_valid(body)));
      CREATE TABLE drafts (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, step_id TEXT REFERENCES steps(id) ON DELETE CASCADE, body TEXT NOT NULL CHECK(json_valid(body)));
      CREATE INDEX steps_history ON steps(project_id,occurred_at DESC,created_at DESC,id DESC);
      CREATE UNIQUE INDEX draft_target ON drafts(project_id,ifnull(step_id,''));
      PRAGMA user_version=1;
    `);
    await db.exec(`
      CREATE TABLE reports (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, step_id TEXT REFERENCES steps(id) ON DELETE CASCADE, body TEXT NOT NULL CHECK(json_valid(body)));
      CREATE INDEX reports_scope ON reports(project_id,step_id,json_extract(body,'$.createdAt') DESC,id DESC);
      PRAGMA user_version=2;
    `);
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}
export class SqlRepository implements Repository {
  private queue = new SerialQueue();
  constructor(private db: SqlConnection) {}
  private async bodies<T>(
    table: string,
    where = '',
    params: (string | number | null)[] = [],
  ): Promise<T[]> {
    return (
      await this.db.all<{ body: string }>(
        `SELECT body FROM ${table} ${where}`,
        ...params,
      )
    ).map((r) => JSON.parse(r.body) as T);
  }
  private write<T>(work: () => Promise<T>): Promise<T> {
    return this.queue.run(async () => {
      await this.db.exec('BEGIN IMMEDIATE');
      try {
        const result = await work();
        await this.db.exec('COMMIT');
        return result;
      } catch (error) {
        await this.db.exec('ROLLBACK');
        throw error;
      }
    });
  }
  projects() {
    return this.queue.run(() =>
      this.bodies<Project>(
        'projects',
        "ORDER BY json_extract(body,'$.name') COLLATE NOCASE",
      ),
    );
  }
  project(id: string) {
    return this.queue.run(
      async () =>
        (await this.bodies<Project>('projects', 'WHERE id=?', [id]))[0] ?? null,
    );
  }
  step(id: string) {
    return this.queue.run(
      async () =>
        (await this.bodies<BuildStep>('steps', 'WHERE id=?', [id]))[0] ?? null,
    );
  }
  dashboard() {
    return this.queue.run(async () => {
      const rows = await this.db.all<{
        body: string;
        latest: string | null;
        lastEdited: string;
        photo: string | null;
      }>(`
        SELECT p.body,
          (${latestPhotoQuery('p.id')}) photo,
          (SELECT s.body FROM steps s WHERE s.project_id=p.id ORDER BY ${order} LIMIT 1) latest,
          max(json_extract(p.body,'$.updatedAt'),coalesce((SELECT max(json_extract(s.body,'$.updatedAt')) FROM steps s WHERE s.project_id=p.id),json_extract(p.body,'$.updatedAt'))) lastEdited
        FROM projects p ORDER BY lastEdited DESC,p.id ASC`);
      return rows.map((r) => ({
        project: JSON.parse(r.body) as Project,
        latest: r.latest ? (JSON.parse(r.latest) as BuildStep) : null,
        lastEdited: r.lastEdited,
        photo: r.photo ? (JSON.parse(r.photo) as ProjectPhoto) : null,
      }));
    });
  }
  latestPhoto(projectId: string): Promise<ProjectPhoto | null> {
    return this.queue.run(async () => {
      const row = (
        await this.db.all<{ body: string }>(latestPhotoQuery('?'), projectId)
      )[0];
      return row ? (JSON.parse(row.body) as ProjectPhoto) : null;
    });
  }
  steps(projectId: string, search = '', offset = 0, limit = PAGE_SIZE) {
    return this.queue.run(async () => {
      const pattern = `%${search
        .trim()
        .toLocaleLowerCase('de-DE')
        .replace(/[\\%_]/g, '\\$&')}%`;
      const clause = "WHERE project_id=? AND search LIKE ? ESCAPE '\\'";
      const rows = await this.bodies<BuildStep>(
        'steps',
        `${clause} ORDER BY ${order} LIMIT ? OFFSET ?`,
        [projectId, pattern, limit, offset],
      );
      const total =
        (
          await this.db.all<{ n: number }>(
            `SELECT count(*) n FROM steps ${clause}`,
            projectId,
            pattern,
          )
        )[0]?.n ?? 0;
      return { rows, total };
    });
  }
  previousStep(step: BuildStep) {
    return this.queue.run(
      async () =>
        (
          await this.bodies<BuildStep>(
            'steps',
            `WHERE project_id=? AND (occurred_at,created_at,id)<(?,?,?) ORDER BY ${order} LIMIT 1`,
            [step.projectId, step.occurredAt, step.createdAt, step.id],
          )
        )[0] ?? null,
    );
  }
  reportPage(request: ReportPageRequest) {
    return this.queue.run(async () => {
      const clause = 'WHERE project_id=? AND step_id IS ?';
      const params = [request.projectId, request.stepId];
      const total =
        (
          await this.db.all<{ n: number }>(
            `SELECT count(*) n FROM reports ${clause}`,
            ...params,
          )
        )[0]?.n ?? 0;
      const lastOffset = Math.max(
        0,
        Math.floor((total - 1) / PAGE_SIZE) * PAGE_SIZE,
      );
      const offset = Math.min(
        lastOffset,
        Math.max(0, Math.floor(request.offset / PAGE_SIZE) * PAGE_SIZE),
      );
      const rows = await this.bodies<SavedReport>(
        'reports',
        `${clause} ORDER BY json_extract(body,'$.createdAt') DESC, json_extract(body,'$.groupId') DESC, json_extract(body,'$.partIndex') ASC, id DESC LIMIT ? OFFSET ?`,
        [...params, PAGE_SIZE, offset],
      );
      return { rows, total, offset };
    });
  }
  private async putReport(report: SavedReport) {
    const r = reportSchema.parse(report);
    if (r.stepId) {
      const step = (
        await this.db.all<{ project_id: string }>(
          'SELECT project_id FROM steps WHERE id=?',
          r.stepId,
        )
      )[0];
      if (step?.project_id !== r.projectId)
        throw new Error('Ungültige Bauschrittzuordnung im Protokoll.');
    }
    await this.db.run(
      'INSERT INTO reports VALUES (?,?,?,?)',
      r.id,
      r.projectId,
      r.stepId,
      JSON.stringify(r),
    );
  }
  saveReports(reports: SavedReport[]) {
    return this.write(async () => {
      for (const report of reports) await this.putReport(report);
    });
  }
  deleteReport(id: string) {
    return this.write(() => this.db.run('DELETE FROM reports WHERE id=?', id));
  }
  drafts() {
    return this.queue.run(() => this.bodies<BuildStepDraft>('drafts'));
  }
  snapshot() {
    return this.queue.run(async () =>
      validateSnapshot({
        projects: await this.bodies('projects'),
        steps: await this.bodies('steps'),
        reports: await this.bodies('reports'),
      }),
    );
  }
  saveDraft(draft: BuildStepDraft) {
    return this.write(() =>
      this.db.run(
        'INSERT INTO drafts VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body',
        draft.id,
        draft.projectId,
        draft.stepId,
        JSON.stringify(draft),
      ),
    );
  }
  removeDraft(id: string) {
    return this.write(() => this.db.run('DELETE FROM drafts WHERE id=?', id));
  }
  private putProject(project: Project) {
    return this.db.run(
      'INSERT INTO projects VALUES (?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body',
      project.id,
      JSON.stringify(projectSchema.parse(project)),
    );
  }
  saveProject(project: Project) {
    return this.write(() => this.putProject(project));
  }
  private async putStep(step: BuildStep) {
    const s = stepSchema.parse(step);
    const existing = (
      await this.db.all<{ project_id: string }>(
        'SELECT project_id FROM steps WHERE id=?',
        s.id,
      )
    )[0];
    if (existing && existing.project_id !== s.projectId)
      throw new Error(
        'Ein Bauschritt kann nicht in ein anderes Projekt verschoben werden.',
      );
    const date = new Date(s.occurredAt).toLocaleString('de-DE');
    await this.db.run(
      'INSERT INTO steps VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET occurred_at=excluded.occurred_at,created_at=excluded.created_at,search=excluded.search,body=excluded.body',
      s.id,
      s.projectId,
      s.occurredAt,
      s.createdAt,
      `${s.number} ${s.title} ${s.occurredAt} ${date} ${s.note} ${s.photos.map((p) => p.name).join(' ')}`.toLocaleLowerCase(
        'de-DE',
      ),
      JSON.stringify(s),
    );
  }
  saveStep(step: BuildStep, draftId: string) {
    return this.write(async () => {
      await this.putStep(step);
      await this.db.run('DELETE FROM drafts WHERE id=?', draftId);
    });
  }
  deleteProject(id: string) {
    return this.write(() => this.db.run('DELETE FROM projects WHERE id=?', id));
  }
  deleteStep(id: string) {
    return this.write(() => this.db.run('DELETE FROM steps WHERE id=?', id));
  }
  replace(input: Snapshot, preservedDrafts?: BuildStepDraft[]) {
    const data = validateSnapshot(input);
    return this.write(async () => {
      const drafts =
        preservedDrafts ?? (await this.bodies<BuildStepDraft>('drafts'));
      await this.db.exec(
        'DELETE FROM reports; DELETE FROM drafts; DELETE FROM steps; DELETE FROM projects;',
      );
      for (const p of data.projects) await this.putProject(p);
      for (const s of data.steps) await this.putStep(s);
      for (const r of data.reports) await this.putReport(r);
      for (const draft of drafts)
        if (
          data.projects.some((p) => p.id === draft.projectId) &&
          (!draft.stepId ||
            data.steps.some(
              (s) => s.id === draft.stepId && s.projectId === draft.projectId,
            ))
        )
          await this.db.run(
            'INSERT INTO drafts VALUES (?,?,?,?)',
            draft.id,
            draft.projectId,
            draft.stepId,
            JSON.stringify(draft),
          );
    });
  }
}
