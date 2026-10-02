import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useServices } from '../../core/composition';
import { useTask } from '../../core/ui/use-task';
import { useFeedback } from '../../core/ui/feedback';
import { errorText } from '../../core/ui/components';
import type { BuildStep, Project } from '../../core/domain/models';
export function useStepDetail(id: string) {
  const { log, revision, refresh } = useServices();
  const [step, setStep] = useState<BuildStep>(),
    [project, setProject] = useState<Project>(),
    [loading, setLoading] = useState(true);
  const [photoCount, setPhotoCount] = useState(0);
  const task = useTask(),
    feedback = useFeedback();
  const { setError } = task;
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      log.repository
        .step(id)
        .then(async (step) => {
          const [project, photos] = step
            ? await Promise.all([
                log.repository.project(step.projectId),
                log.repository.photos(step.projectId, 0, 0),
              ])
            : [null, { total: 0 }];
          if (active) {
            setStep(step ?? undefined);
            setProject(project ?? undefined);
            setPhotoCount(photos.total);
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
      // Revision/retry tokens intentionally reload persisted data on focus.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [log, id, revision, setError]),
  );
  return {
    step,
    project,
    loading,
    photoCount,
    ...task,
    remove: async () => {
      if (!step) return;
      if (
        !(await feedback.confirm(
          'Bauschritt löschen?',
          'Der Bauschritt und alle zugehörigen Fotos werden dauerhaft gelöscht.',
        ))
      )
        return;
      await task.run(async () => {
        const warnings = await log.delete('step', id);
        refresh();
        router.dismissTo({
          pathname: '/project/[id]',
          params: { id: step.projectId },
        });
        feedback.notify(warnings.join('\n') || 'Bauschritt gelöscht.');
      });
    },
  };
}
