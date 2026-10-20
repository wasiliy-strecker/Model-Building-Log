import type {
  BuildStep,
  Project,
  Reminder,
  BuildStepDraft,
} from '../../core/domain/models';
import { stepDifference, stepLabel } from '../../core/domain/models';
import { messages } from '../../core/i18n';

export type HistoryItem = {
  step: BuildStep;
  photoUri?: string;
  photoCount: number;
  progressText: string;
  comparison: string | null;
};
export function historyComparison(
  step: BuildStep,
  previous: BuildStep | null,
): string | null {
  return previous
    ? `${previous.number} → ${step.number} · ${stepDifference(step, previous)} Schritte`
    : null;
}
export const modelTypeSuggestions = Object.values(messages.modelTypes);
export type DashboardItem = {
  project: Project;
  latest: BuildStep | null;
  lastEdited: string;
};
export type ProjectSort = 'lastEdited' | 'name' | 'modelType';
export const sortLabels: Record<ProjectSort, string> = {
  lastEdited: 'Zuletzt bearbeitet',
  name: 'Name',
  modelType: 'Modelltyp',
};
export const dateTime = (value: string | number) =>
  new Date(value).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
export function stepSummary(step: BuildStep | null) {
  return step ? stepLabel(step) : 'Noch kein Bauschritt';
}
export function visibleProjects(
  items: DashboardItem[],
  search: string,
  sort: ProjectSort,
) {
  const q = search.trim().toLocaleLowerCase('de-DE');
  return items
    .filter(({ project: p, latest }) =>
      [
        p.name,
        p.modelType,
        p.material,
        p.manufacturer,
        latest ? stepSummary(latest) : '',
      ].some((v) => v.toLocaleLowerCase('de-DE').includes(q)),
    )
    .sort(
      (a, b) =>
        (sort === 'lastEdited'
          ? b.lastEdited.localeCompare(a.lastEdited)
          : sort === 'name'
            ? a.project.name.localeCompare(b.project.name, 'de-DE')
            : a.project.modelType.localeCompare(
                b.project.modelType,
                'de-DE',
              )) ||
        a.project.name.localeCompare(b.project.name, 'de-DE') ||
        a.project.id.localeCompare(b.project.id),
    );
}
export function reminderSummary(r: Reminder) {
  const time = `${String(r.hour).padStart(2, '0')}:${String(r.minute).padStart(2, '0')} Uhr`;
  return (
    {
      hourly: `stündlich ab ${dateTime(r.startsAtMillis)}`,
      daily: `täglich um ${time}`,
      weekly: `${['montags', 'dienstags', 'mittwochs', 'donnerstags', 'freitags', 'samstags', 'sonntags'][r.day - 1]} um ${time}`,
      monthly: `monatlich am ${r.day}. um ${time}`,
      yearly: `jährlich am ${r.day}.${r.month}. um ${time}`,
    }[r.interval] +
    (r.deliveryMode === 'punctualWithSound' ? ' · pünktlich mit Ton' : '')
  );
}
export function capturePhase(draft: BuildStepDraft): 'choose' | 'form' {
  return draft.stepId ||
    draft.form.photos.length ||
    draft.form.number ||
    draft.form.title ||
    draft.form.note
    ? 'form'
    : draft.captureStage;
}
