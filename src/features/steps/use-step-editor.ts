import { useFormErrors } from '../../core/ui/use-form-errors';
import { validateStepForm, stepFieldOrder } from './step-form-validation';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { useServices } from '../../core/composition';
import type {
  PhotoAttachment,
  BuildStepDraft,
  BuildStepForm,
} from '../../core/domain/models';
import { useTask } from '../../core/ui/use-task';
import { errorText } from '../../core/ui/components';
import { useFeedback } from '../../core/ui/feedback';
import { useLeaveGuard } from '../../core/ui/use-leave-guard';
import { capturePhase } from '../projects/presentation-model';
import { stepForm, applyPickedPhotos } from './step-service';

export function useStepEditor(projectId: string, stepId?: string) {
  const { log, media, refresh } = useServices();
  const feedback = useFeedback();
  const [draft, setDraft] = useState<BuildStepDraft>();
  const [initialForm, setInitialForm] = useState('');
  const current = useRef<BuildStepDraft | undefined>(undefined);
  const initial = useRef('');
  const committed = useRef(false);
  const task = useTask();
  const formErrors = useFormErrors();
  const { setError } = task;
  useEffect(() => {
    let active = true;
    (async () => {
      const [project, savedStep] = await Promise.all([
        log.repository.project(projectId),
        stepId ? log.repository.step(stepId) : null,
      ]);
      if (
        !project ||
        (stepId && (!savedStep || savedStep.projectId !== projectId))
      )
        throw new Error('Projekt oder Bauschritt nicht gefunden.');
      const saved = await log.draft(projectId, savedStep ?? undefined);
      const original: BuildStepForm = savedStep
        ? stepForm(savedStep)
        : {
            number: '',
            title: '',
            occurredAt: saved.createdAt,
            note: '',
            photos: [],
          };
      if (active) {
        initial.current = JSON.stringify(original);
        setInitialForm(initial.current);
        current.current = saved;
        setDraft(saved);
        if (saved.photoWarning) setError(saved.photoWarning);
      }
    })().catch((e) => {
      if (active) setError(errorText(e));
    });
    return () => {
      active = false;
      const d = current.current;
      if (d && !committed.current && JSON.stringify(d.form) === initial.current)
        void log.discard(d).catch(() => {});
    };
  }, [log, projectId, stepId, setError]);
  const dirty = !!draft && JSON.stringify(draft.form) !== initialForm;
  const leave = useLeaveGuard({
    dirty,
    busy: task.busy,
    title: stepId ? 'Änderungen verwerfen?' : 'Bauschritt verwerfen?',
    discard: async () => {
      if (current.current) await log.discard(current.current);
      committed.current = true;
      refresh();
    },
  });
  function apply(next: BuildStepDraft) {
    current.current = next;
    setDraft(next);
    return log.persistDraft(next);
  }
  function change<K extends keyof BuildStepForm>(
    key: K,
    value: BuildStepForm[K],
  ) {
    if (!current.current) return;
    formErrors.clear(key);
    void apply({
      ...current.current,
      form: { ...current.current.form, [key]: value },
    }).catch((e) =>
      setError(`Entwurf konnte nicht gesichert werden: ${errorText(e)}`),
    );
  }
  function setPhotos(photos: PhotoAttachment[]) {
    change('photos', photos);
  }
  return {
    draft,
    fieldErrors: formErrors.fieldErrors,
    errorTarget: formErrors.errorTarget,
    dirty,
    phase: draft ? capturePhase(draft) : 'choose',
    change,
    ...task,
    chooseManual: () =>
      task.run(async () => {
        if (current.current)
          await apply({
            ...current.current,
            captureStage: 'form',
            captureSource: 'manual',
          });
      }),
    pick: (
      source: NonNullable<BuildStepDraft['external']>,
      replaceId?: string,
    ) =>
      task.run(async () => {
        if (!current.current) return;
        await apply({
          ...current.current,
          external: source,
          replacePhotoId: replaceId ?? null,
        });
        let result;
        try {
          result = await media.pick(source, !replaceId);
        } catch (error) {
          await apply({
            ...current.current,
            external: null,
            replacePhotoId: null,
          });
          throw error;
        }
        const before = current.current;
        try {
          await apply({
            ...applyPickedPhotos(before, result.photos),
            photoWarning: result.failures.join('\n'),
          });
          await log.cleanup(result.photos.map((p) => p.file));
        } catch (error) {
          current.current = before;
          setDraft(before);
          await log.cleanup(result.photos.map((p) => p.file));
          throw error;
        }
        if (result.failures.length) setError(result.failures.join('\n'));
      }),
    remove: (id: string) =>
      setPhotos(
        (current.current?.form.photos ?? []).filter((p) => p.id !== id),
      ),
    reorder: setPhotos,
    move: (id: string, delta: number) => {
      const photos = [...(current.current?.form.photos ?? [])];
      const index = photos.findIndex((p) => p.id === id),
        photo = photos[index],
        next = photos[index + delta];
      if (!photo || !next) return;
      photos[index] = next;
      photos[index + delta] = photo;
      setPhotos(photos);
    },
    save: () =>
      task.run(async () => {
        if (!current.current) return;
        const errors = validateStepForm(current.current.form);
        if (Object.keys(errors).length) {
          formErrors.show(errors, stepFieldOrder);
          return;
        }
        formErrors.clear();
        await log.persistDraft(current.current);
        const result = await log.saveStep(current.current);
        committed.current = true;
        refresh();
        leave(() => {
          if (stepId)
            router.dismissTo({
              pathname: '/step/[id]',
              params: { id: result.step.id },
            });
          else
            router.replace({
              pathname: '/step/[id]',
              params: { id: result.step.id },
            });
        });
        feedback.notify(
          result.warnings.join('\n') ||
            (stepId ? 'Änderungen gespeichert.' : 'Bauschritt gespeichert.'),
        );
      }),
  };
}
