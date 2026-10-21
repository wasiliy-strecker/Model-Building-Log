import type {
  Project,
  SavedReport,
  BuildStep,
  Snapshot,
  BuildStepDraft,
  ProjectPhoto,
} from './domain/models';

export interface SqlConnection {
  exec(sql: string): Promise<void>;
  run(sql: string, ...params: (string | number | null)[]): Promise<void>;
  all<T>(sql: string, ...params: (string | number | null)[]): Promise<T[]>;
}
export type ReportPageRequest = {
  projectId: string;
  stepId: string | null;
  offset: number;
};
export interface Repository {
  reportPage(
    request: ReportPageRequest,
  ): Promise<{ rows: SavedReport[]; total: number; offset: number }>;
  saveReports(reports: SavedReport[]): Promise<void>;
  deleteReport(id: string): Promise<void>;
  snapshot(): Promise<Snapshot>;
  projects(): Promise<Project[]>;
  project(id: string): Promise<Project | null>;
  step(id: string): Promise<BuildStep | null>;
  dashboard(): Promise<
    {
      project: Project;
      latest: BuildStep | null;
      lastEdited: string;
      photo: ProjectPhoto | null;
    }[]
  >;
  latestPhoto(projectId: string): Promise<ProjectPhoto | null>;
  steps(
    projectId: string,
    search?: string,
    offset?: number,
    limit?: number,
  ): Promise<{ rows: BuildStep[]; total: number }>;
  previousStep(step: BuildStep): Promise<BuildStep | null>;
  drafts(): Promise<BuildStepDraft[]>;
  saveDraft(draft: BuildStepDraft): Promise<void>;
  removeDraft(id: string): Promise<void>;
  saveProject(project: Project): Promise<void>;
  saveStep(step: BuildStep, draftId: string): Promise<void>;
  deleteProject(id: string): Promise<void>;
  deleteStep(id: string): Promise<void>;
  replace(data: Snapshot, drafts?: BuildStepDraft[]): Promise<void>;
}
export interface FileVault {
  read(key: string): Promise<Uint8Array>;
  put(bytes: Uint8Array, kind?: 'jpg' | 'pdf'): Promise<string>;
  remove(key: string): Promise<void>;
  list(): Promise<string[]>;
  uri(key: string): string;
}
export interface PhotoInspector {
  validate(bytes: Uint8Array): Promise<void>;
}
export interface ReminderPort {
  sync(projects: Project[], steps: BuildStep[]): Promise<string[]>;
}
export type Environment = {
  id(): string;
  now(): string;
  random(length: number): Uint8Array;
};
export class SerialQueue {
  private tail: Promise<unknown> = Promise.resolve();
  run<T>(work: () => Promise<T>): Promise<T> {
    const next = this.tail.then(work, work);
    this.tail = next.catch(() => undefined);
    return next;
  }
}
