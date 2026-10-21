import type { BuildStep, ProjectAtCapture } from './models';
import { messages } from '../i18n';
export function interpolate(
  text: string,
  values: Record<string, string | number>,
): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  );
}
export function stepDateTime(
  step: Pick<BuildStep, 'occurredAt' | 'timezoneOffsetMinutes'>,
  withZone = false,
): string {
  const offset = step.timezoneOffsetMinutes;
  const date = new Date(
    Date.parse(step.occurredAt) + (offset == null ? 0 : offset * 60000),
  );
  const text = date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(offset == null ? {} : { timeZone: 'UTC' }),
  });
  if (!withZone || offset == null) return text;
  return `${text} (UTC${offset >= 0 ? '+' : '-'}${String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')}:${String(Math.abs(offset) % 60).padStart(2, '0')})`;
}
export function captureDifferences(
  step: BuildStep,
  project: ProjectAtCapture,
): string[][] {
  if (!step.projectAtCapture) return [];
  const labels = messages.reportDocument;
  return (
    [
      ['name', labels.project],
      ['modelType', labels.modelType],
      ['manufacturer', labels.manufacturer],
      ['material', labels.material],
    ] as const
  )
    .filter(([key]) => step.projectAtCapture![key] !== project[key])
    .map(([key, label]) => [
      label,
      step.projectAtCapture![key] || labels.notProvided,
    ]);
}
