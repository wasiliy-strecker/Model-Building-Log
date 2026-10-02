import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useServices } from '../../core/composition';
import { photoReference, type ProjectPhoto } from '../../core/domain/models';
import { errorText } from '../../core/ui/components';
import { toggleComparisonPhoto } from './comparison-model';

export function usePhotoComparison(projectId: string) {
  const { log, revision } = useServices();
  const [name, setName] = useState('');
  const [items, setItems] = useState<ProjectPhoto[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<ProjectPhoto[]>([]);
  const selection = useRef<ProjectPhoto[]>([]);
  const [comparing, setComparing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const generation = useRef(0);
  const moreBusy = useRef(false);
  function updateSelection(next: ProjectPhoto[]) {
    selection.current = next;
    setSelected(next);
  }
  useFocusEffect(
    useCallback(() => {
      const request = ++generation.current;
      setLoading(true);
      moreBusy.current = false;
      setMoreLoading(false);
      (async () => {
        const [project, page] = await Promise.all([
          log.repository.project(projectId),
          log.repository.photos(projectId),
        ]);
        if (!project) throw new Error('Das Projekt wurde nicht gefunden.');
        const steps = await Promise.all(
          [...new Set(selection.current.map((p) => p.stepId))].map((id) =>
            log.repository.step(id),
          ),
        );
        const current = new Map<string, ProjectPhoto>();
        for (const step of steps)
          if (step?.projectId === projectId)
            for (const photo of step.photos) {
              const item = {
                stepId: step.id,
                number: step.number,
                title: step.title,
                occurredAt: step.occurredAt,
                photo,
              };
              current.set(photoReference(item), item);
            }
        if (generation.current !== request) return;
        updateSelection(
          selection.current.flatMap((p) => {
            const updated = current.get(photoReference(p));
            return updated ? [updated] : [];
          }),
        );
        setName(project.name);
        setItems(page.rows);
        setTotal(page.total);
        setError('');
      })()
        .catch((e) => {
          if (generation.current === request) setError(errorText(e));
        })
        .finally(() => {
          if (generation.current === request) setLoading(false);
        });
      return () => {
        generation.current++;
      };
      // Refresh persisted photo references after edits or a restore.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [log, projectId, revision, attempt]),
  );
  async function loadMore() {
    if (loading || moreBusy.current || items.length >= total) return;
    const request = generation.current;
    moreBusy.current = true;
    setMoreLoading(true);
    try {
      const page = await log.repository.photos(projectId, items.length);
      if (generation.current === request) {
        setItems((old) => [...old, ...page.rows]);
        setTotal(page.total);
        setError('');
      }
    } catch (e) {
      if (generation.current === request) setError(errorText(e));
    } finally {
      if (generation.current === request) {
        moreBusy.current = false;
        setMoreLoading(false);
      }
    }
  }
  return {
    name,
    items,
    total,
    selected,
    comparing,
    loading,
    moreLoading,
    error,
    loadMore,
    toggle: (item: ProjectPhoto) =>
      updateSelection(toggleComparisonPhoto(selection.current, item)),
    compare: () => {
      if (selection.current.length >= 2) setComparing(true);
    },
    editSelection: () => setComparing(false),
    clear: () => {
      updateSelection([]);
      setComparing(false);
    },
    retry: () => setAttempt((n) => n + 1),
  };
}
