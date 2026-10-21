import { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { useServices } from '../../core/composition';
import {
  PAGE_SIZE,
  type BuildStepDraft,
  type Project,
  type ProjectPhoto,
  type BuildStep,
} from '../../core/domain/models';
import { errorText } from '../../core/ui/components';
import { useTask } from '../../core/ui/use-task';
import { useFeedback } from '../../core/ui/feedback';
import {
  visibleProjects,
  historyComparison,
  type DashboardItem,
  type HistoryItem,
  type ProjectSort,
} from './presentation-model';

import { useReminderStatus } from './use-reminder-status';

export function useProjects() {
  const { log, revision } = useServices();
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [drafts, setDrafts] = useState<BuildStepDraft[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ProjectSort>('lastEdited');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const status = useReminderStatus();
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      Promise.all([log.repository.dashboard(), log.repository.drafts()])
        .then(([rows, d]) => {
          if (active) {
            setItems(rows);
            setDrafts(d);
            setError('');
          }
        })
        .catch((e) => {
          if (active) setError(errorText(e));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
      // Persistence changes explicitly reload the focused screen.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [log, revision, attempt]),
  );
  return {
    items: visibleProjects(items, search, sort),
    empty: !items.length,
    drafts,
    search,
    setSearch,
    sort,
    setSort,
    loading,
    error,
    status,
    retry: () => setAttempt((n) => n + 1),
  };
}
export function useProjectDetail(id: string, history = false) {
  const { log, native, revision, refresh } = useServices();
  const [project, setProject] = useState<Project>();
  const [steps, setSteps] = useState<BuildStep[]>([]);
  const [comparisons, setComparisons] = useState<Record<string, string | null>>(
    {},
  );
  const [total, setTotal] = useState(0);
  const [photo, setPhoto] = useState<ProjectPhoto | null>(null);
  const [drafts, setDrafts] = useState<BuildStepDraft[]>([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const task = useTask();
  const { setError } = task;
  const feedback = useFeedback();
  const status = useReminderStatus();
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      Promise.all([
        log.repository.project(id),
        log.repository.steps(id, history ? search : '', history ? offset : 0),
        log.repository.drafts(),
        history ? Promise.resolve(null) : log.repository.latestPhoto(id),
      ])
        .then(async ([p, page, drafts, latestPhoto]) => {
          const comparisons = await Promise.all(
            page.rows.map(
              async (s) =>
                [
                  s.id,
                  history && search.trim()
                    ? null
                    : historyComparison(
                        s,
                        await log.repository.previousStep(s),
                      ),
                ] as const,
            ),
          );
          if (!active) return;
          setProject(p ?? undefined);
          setPhoto(latestPhoto);
          setSteps(page.rows);
          setTotal(page.total);
          setComparisons(Object.fromEntries(comparisons));
          setDrafts(drafts.filter((d) => d.projectId === id));
          setError('');
          if (offset && offset >= page.total)
            setOffset(
              Math.max(0, Math.floor((page.total - 1) / PAGE_SIZE) * PAGE_SIZE),
            );
        })
        .catch((e) => {
          if (active) setError(errorText(e));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      void native.acknowledge(id).catch(() => {});
      return () => {
        active = false;
      };
      // Persistence changes explicitly reload the focused screen.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [log, native, id, history, search, offset, revision, attempt, setError]),
  );
  return {
    project,
    steps,
    total,
    photo,
    drafts,
    offset,
    setOffset,
    search,
    setSearch: (value: string) => {
      setOffset(0);
      setSearch(value);
    },
    loading,
    status,
    ...task,
    historyItems: steps.map((step): HistoryItem => ({
      step,
      photoUri: step.photos[0] ? log.vault.uri(step.photos[0].file) : undefined,
      photoCount: step.photos.length,
      progressText: `Schritt ${step.number}`,
      comparison: comparisons[step.id] ?? null,
    })),
    retry: () => setAttempt((n) => n + 1),
    remove: () =>
      task.run(async () => {
        const warnings = await log.delete('project', id);
        refresh();
        router.replace('/');
        feedback.notify(warnings.join('\n') || 'Projekt gelöscht.');
      }),
  };
}
