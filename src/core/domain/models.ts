import { z } from 'zod';
import { MAX_FILE_BYTES } from '../files/limits';

const id = z.string().uuid();
const short = z.string().max(500);
const timestamp = z.string().datetime({ offset: true });
export const fileKey = z.string().regex(/^[a-f0-9-]{36}\.jpg$/);
export const photoSchema = z
  .object({
    id,
    name: short.min(1),
    file: fileKey,
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
export const stepSchema = z
  .object({
    id,
    projectId: id,
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
  return [...new Set(data.steps.flatMap((s) => s.photos.map((p) => p.file)))];
}
export function validateSnapshot(input: unknown): Snapshot {
  const data = snapshotSchema.parse(input);
  for (const rows of [data.projects, data.steps])
    if (new Set(rows.map((r) => r.id)).size !== rows.length)
      throw new Error('Doppelte IDs im Backup.');
  const projects = new Set(data.projects.map((p) => p.id));
  for (const step of data.steps)
    if (
      !projects.has(step.projectId) ||
      new Set(step.photos.map((p) => p.id)).size !== step.photos.length
    )
      throw new Error('Ungültige Zuordnung im Backup.');
  return data;
}
