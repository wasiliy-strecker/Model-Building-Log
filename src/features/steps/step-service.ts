import {
  projectSchema,
  stepSchema,
  photoSchema,
  parseStepNumber,
  snapshotFiles,
  type PhotoAttachment,
  type BuildStepDraft,
  type BuildStep,
  type Project,
  type BuildStepForm,
} from '../../core/domain/models';
import {
  SerialQueue,
  type Environment,
  type FileVault,
  type Repository,
  type ReminderPort,
  type PhotoInspector,
} from '../../core/ports';
import { digest, verifiedFile } from '../../core/files/integrity';
import { MAX_FILE_BYTES } from '../../core/files/limits';

export function stepForm(step: BuildStep): BuildStepForm {
  return {
    number: step.number,
    title: step.title,
    occurredAt: step.occurredAt,
    note: step.note,
    photos: step.photos,
  };
}
export function applyPickedPhotos(
  draft: BuildStepDraft,
  photos: PhotoAttachment[],
): BuildStepDraft {
  let next = [...draft.form.photos];
  if (draft.replacePhotoId && photos[0]) {
    const index = next.findIndex((p) => p.id === draft.replacePhotoId);
    if (index < 0)
      throw new Error('Das zu ersetzende Foto ist nicht mehr im Entwurf.');
    next[index] = photos[0];
  } else if (!draft.replacePhotoId) {
    next.push(...photos.filter((p) => !next.some((old) => old.id === p.id)));
  }
  return {
    ...draft,
    external: null,
    replacePhotoId: null,
    captureStage: next.length ? 'form' : draft.captureStage,
    captureSource: draft.captureSource ?? (next.length ? 'photo' : null),
    form: { ...draft.form, photos: next },
  };
}
export class ProjectService {
  readonly queue = new SerialQueue();
  constructor(
    readonly repository: Repository,
    readonly vault: FileVault,
    readonly env: Environment,
    readonly reminders: ReminderPort,
    readonly inspector: PhotoInspector,
  ) {}
  async cleanup(candidates: string[]): Promise<void> {
    try {
      const used = new Set(snapshotFiles(await this.repository.snapshot()));
      for (const d of await this.repository.drafts())
        for (const p of d.form.photos) used.add(p.file);
      for (const file of new Set(candidates))
        if (!used.has(file))
          await this.vault.remove(file).catch(() => undefined);
    } catch {
      /* A failed reference lookup must prevent all physical deletion. */
    }
  }
  async syncReminders(): Promise<string[]> {
    try {
      const data = await this.repository.snapshot();
      return await this.reminders.sync(data.projects, data.steps);
    } catch {
      return [
        'Gespeichert. Erinnerungen konnten nicht aktualisiert werden. Bitte die Berechtigungen in den Einstellungen prüfen.',
      ];
    }
  }
  saveProject(project: Project) {
    return this.queue.run(async () => {
      await this.repository.saveProject(
        projectSchema.parse({
          ...project,
          name: project.name.trim(),
          modelType: project.modelType.trim(),
          manufacturer: project.manufacturer.trim(),
          material: project.material.trim(),
          updatedAt: this.env.now(),
        }),
      );
      return this.syncReminders();
    });
  }
  draft(projectId: string, step?: BuildStep): Promise<BuildStepDraft> {
    return this.queue.run(async () => {
      const existing = (await this.repository.drafts()).find(
        (d) => d.projectId === projectId && d.stepId === (step?.id ?? null),
      );
      if (existing) return existing;
      const now = this.env.now();
      const draft: BuildStepDraft = {
        id: this.env.id(),
        projectId,
        stepId: step?.id ?? null,
        createdAt: step?.createdAt ?? now,
        updatedAt: now,
        external: null,
        replacePhotoId: null,
        captureStage: step ? 'form' : 'choose',
        captureSource: null,
        form: step
          ? stepForm(step)
          : { number: '', title: '', occurredAt: now, note: '', photos: [] },
      };
      await this.repository.saveDraft(draft);
      return draft;
    });
  }
  persistDraft(draft: BuildStepDraft): Promise<void> {
    return this.queue.run(async () => {
      const previous = (await this.repository.drafts()).find(
        (d) => d.id === draft.id,
      );
      await this.repository.saveDraft({ ...draft, updatedAt: this.env.now() });
      await this.cleanup(previous?.form.photos.map((p) => p.file) ?? []);
    });
  }
  async importPhoto(bytes: Uint8Array, name: string): Promise<PhotoAttachment> {
    if (!bytes.length || bytes.length > MAX_FILE_BYTES)
      throw new Error('Das Foto ist leer oder größer als 50 MB.');
    await this.inspector.validate(bytes);
    const file = await this.vault.put(bytes);
    return photoSchema.parse({
      id: this.env.id(),
      name: name.slice(0, 500) || 'Foto.jpg',
      file,
      sha256: digest(bytes),
      size: bytes.length,
    });
  }
  saveStep(
    draft: BuildStepDraft,
  ): Promise<{ step: BuildStep; warnings: string[] }> {
    return this.queue.run(async () => {
      if (draft.stepId && !(await this.repository.step(draft.stepId)))
        throw new Error('Der Bauschritt wurde inzwischen gelöscht.');
      const step = stepSchema.parse({
        id: draft.stepId ?? this.env.id(),
        projectId: draft.projectId,
        number: parseStepNumber(draft.form.number),
        title: draft.form.title.trim(),
        occurredAt: new Date(draft.form.occurredAt).toISOString(),
        note: draft.form.note,
        photos: draft.form.photos,
        createdAt: draft.createdAt,
        updatedAt: this.env.now(),
      });
      for (const photo of step.photos) await verifiedFile(this.vault, photo);
      const previous = draft.stepId
        ? await this.repository.step(draft.stepId)
        : null;
      await this.repository.saveStep(step, draft.id);
      await this.cleanup(previous?.photos.map((p) => p.file) ?? []);
      return { step, warnings: await this.syncReminders() };
    });
  }
  discard(draft: BuildStepDraft): Promise<void> {
    return this.queue.run(async () => {
      await this.repository.removeDraft(draft.id);
      await this.cleanup(draft.form.photos.map((p) => p.file));
    });
  }
  delete(kind: 'project' | 'step', id: string): Promise<string[]> {
    return this.queue.run(async () => {
      const candidates = snapshotFiles(await this.repository.snapshot());
      candidates.push(
        ...(await this.repository.drafts()).flatMap((d) =>
          d.form.photos.map((p) => p.file),
        ),
      );
      if (kind === 'project') await this.repository.deleteProject(id);
      else await this.repository.deleteStep(id);
      await this.cleanup(candidates);
      return this.syncReminders();
    });
  }
}
