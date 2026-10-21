import { z } from 'zod';
import { MAX_FILE_BYTES } from '../files/limits';

const id = z.string().uuid();
const short = z.string().max(500);
const timestamp = z.string().datetime({ offset: true });
export const photoKey = z.string().regex(/^[a-f0-9-]{36}\.jpg$/);
export const fileKey = z.string().regex(/^[a-f0-9-]{36}\.(jpg|pdf)$/);
export const photoSchema = z
  .object({
    id,
    name: short.min(1),
    file: photoKey,
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    size: z.number().int().positive().max(MAX_FILE_BYTES),
  })
  .strict();
export const reminderSchema = z
  .object({
    interval: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'yearly']),
    day: z.number().int().min(1).max(31),
    month: z.number().int().min(1).max(12),
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
    deliveryMode: z.enum(['normal', 'punctualWithSound']),
    startsAtMillis: z.number().int().nonnegative(),
  })
  .strict()
  .refine((r) => r.interval !== 'weekly' || r.day <= 7, {
    message: 'Wochentag muss zwischen 1 und 7 liegen.',
  });
export const projectSchema = z
  .object({
    id,
    name: short.trim().min(1, 'Bitte einen Projektnamen eingeben.'),
    modelType: short,
    manufacturer: short,
    material: short,
    reminder: reminderSchema.nullable(),
    createdAt: timestamp,
    updatedAt: timestamp,
  })
  .strict();
export function parseStepNumber(input: string): string {
  const value = input.trim();
  if (!/^[0-9]+$/.test(value))
    throw new Error('Bitte eine ganze Schrittnummer ab 0 eingeben.');
  return value.replace(/^0+(?=\d)/, '');
}
export const projectAtCaptureSchema = projectSchema.pick({
  name: true,
  modelType: true,
  manufacturer: true,
  material: true,
});
export type ProjectAtCapture = z.infer<typeof projectAtCaptureSchema>;
export const reportSchema = z
  .object({
    id,
    projectId: id,
    stepId: id.nullable(),
    name: short.min(1),
    file: z.string().regex(/^[a-f0-9-]{36}\.pdf$/),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    size: z.number().int().positive().max(MAX_FILE_BYTES),
    createdAt: timestamp,
    full: z.boolean(),
    summary: short,
    groupId: id.optional(),
    partIndex: z.number().int().min(1).max(20).optional(),
    partCount: z.number().int().min(2).max(20).optional(),
  })
  .strict();
export type SavedReport = z.infer<typeof reportSchema>;
export const stepSchema = z
  .object({
    id,
    projectId: id,
    projectAtCapture: projectAtCaptureSchema.nullable().optional(),
    timezoneOffsetMinutes: z
      .number()
      .int()
      .min(-840)
      .max(840)
      .nullable()
      .optional(),
    number: z.string().regex(/^(0|[1-9][0-9]*)$/),
    title: short,
    occurredAt: timestamp,
    note: z.string().max(20000),
    photos: z.array(photoSchema),
    createdAt: timestamp,
    updatedAt: timestamp,
  })
  .strict();
export const snapshotSchema = z
  .object({
    projects: z.array(projectSchema).max(10000),
    steps: z.array(stepSchema).max(100000),
    reports: z.array(reportSchema).max(100000).default([]),
  })
  .strict();
export type Project = z.infer<typeof projectSchema>;
export type BuildStep = z.infer<typeof stepSchema>;
export type PhotoAttachment = z.infer<typeof photoSchema>;
export type Snapshot = z.infer<typeof snapshotSchema>;
export type Reminder = z.infer<typeof reminderSchema>;
export type BuildStepForm = {
  number: string;
  title: string;
  occurredAt: string;
  timezoneOffsetMinutes?: number | null;
  note: string;
  photos: PhotoAttachment[];
};
export type BuildStepDraft = {
  id: string;
  projectId: string;
  stepId: string | null;
  createdAt: string;
  form: BuildStepForm;
  updatedAt: string;
  external: 'camera' | 'gallery' | null;
  replacePhotoId: string | null;
  captureStage: 'choose' | 'form';
  captureSource: 'manual' | 'photo' | null;
  photoWarning?: string;
};
export type ProjectPhoto = {
  stepId: string;
  number: string;
  title: string;
  occurredAt: string;
  photo: PhotoAttachment;
};
export const PAGE_SIZE = 10;
export function stepLabel(step: Pick<BuildStep, 'number' | 'title'>): string {
  return `Schritt ${step.number}${step.title.trim() ? ` · ${step.title.trim()}` : ''}`;
}
export function stepDifference(
  current: BuildStep,
  previous: BuildStep,
): string {
  return (BigInt(current.number) - BigInt(previous.number)).toString();
}
export function snapshotFiles(data: Snapshot): string[] {
  return [
    ...new Set([
      ...data.steps.flatMap((s) => s.photos.map((p) => p.file)),
      ...data.reports.map((r) => r.file),
    ]),
  ];
}
export function validateSnapshot(input: unknown): Snapshot {
  const data = snapshotSchema.parse(input);
  for (const rows of [data.projects, data.steps, data.reports])
    if (new Set(rows.map((r) => r.id)).size !== rows.length)
      throw new Error('Doppelte IDs im Backup.');
  const projects = new Set(data.projects.map((p) => p.id));
  for (const step of data.steps)
    if (
      !projects.has(step.projectId) ||
      new Set(step.photos.map((p) => p.id)).size !== step.photos.length
    )
      throw new Error('Ungültige Zuordnung im Backup.');
  const steps = new Map(data.steps.map((s) => [s.id, s.projectId]));
  for (const r of data.reports) {
    if (
      !projects.has(r.projectId) ||
      (r.stepId && steps.get(r.stepId) !== r.projectId) ||
      !r.file.endsWith('.pdf')
    )
      throw new Error('Ungültiges Protokoll im Backup.');
    if (
      (r.groupId || r.partIndex || r.partCount) &&
      (!r.groupId || !r.partIndex || !r.partCount || r.partIndex > r.partCount)
    )
      throw new Error('Ungültige Protokollteile.');
  }
  const groups = new Map<string, SavedReport[]>();
  for (const report of data.reports)
    if (report.groupId)
      groups.set(report.groupId, [
        ...(groups.get(report.groupId) ?? []),
        report,
      ]);
  for (const reports of groups.values()) {
    const first = reports[0]!;
    if (
      new Set(reports.map((r) => r.partIndex)).size !== reports.length ||
      reports.some(
        (r) =>
          r.projectId !== first.projectId ||
          r.stepId !== first.stepId ||
          r.createdAt !== first.createdAt ||
          r.full !== first.full ||
          r.partCount !== first.partCount,
      )
    )
      throw new Error('Widersprüchliche Protokollteile.');
  }
  return data;
}
