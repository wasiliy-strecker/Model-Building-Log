import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { PermissionsAndroid, Platform } from 'react-native';
import { useServices } from '../../core/composition';
import type { Project } from '../../core/domain/models';
import { useTask } from '../../core/ui/use-task';
import { errorText } from '../../core/ui/components';
import { useFeedback } from '../../core/ui/feedback';
import { useLeaveGuard } from '../../core/ui/use-leave-guard';
import { modelTypeSuggestions } from './presentation-model';
import { useReminderStatusSnapshot } from './use-reminder-status';
import {
  needsReminderRepair,
  reminderSchedule,
  reminderSaveWarning,
} from './reminder-model';
export function useProjectEditor(id?: string) {
  const { log, refresh, native } = useServices();
  const feedback = useFeedback();
  const reminderState = useReminderStatusSnapshot();
  const [project, setProject] = useState<Project | undefined>(() => {
    if (id) return;
    const now = log.env.now();
    return {
      id: log.env.id(),
      name: '',
      modelType: '',
      material: '',
      manufacturer: '',
      reminder: null,
      createdAt: now,
      updatedAt: now,
    };
  });
  const [initial, setInitial] = useState(() => JSON.stringify(project));
  const [initialReady, setReady] = useState(!id);
  const task = useTask();
  const { setError } = task;
  useEffect(() => {
    let active = true;
    log.repository
      .projects()
      .then((projects) => {
        if (!active) return;
        if (id) {
          const found = projects.find((r) => r.id === id);
          if (!found) throw new Error('Das Projekt wurde nicht gefunden.');
          setProject(found);
          setInitial(JSON.stringify(found));
          setReady(true);
        }
      })
      .catch((e) => {
        if (active) setError(errorText(e));
      });
    return () => {
      active = false;
    };
  }, [log, id, setError]);
  const dirty = initialReady && JSON.stringify(project) !== initial;
  const leave = useLeaveGuard({
    dirty,
    busy: task.busy,
    discard: async () => {},
    title: id ? 'Änderungen verwerfen?' : 'Eingaben verwerfen?',
  });
  function change<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((current) => current && { ...current, [key]: value });
  }
  return {
    project,
    dirty,
    change,
    modelTypeSuggestions,
    reminderStatus: reminderState.status,
    refreshReminderStatus: reminderState.refresh,
    reminderNeedsRepair:
      !!id &&
      reminderState.loaded &&
      needsReminderRepair(
        project?.reminder ?? null,
        reminderSchedule(reminderState.status, id),
      ),
    ...task,
    save: () =>
      task.run(async () => {
        if (!project) return;
        if (
          project.reminder &&
          Platform.OS === 'android' &&
          Number(Platform.Version) >= 33
        )
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        const warnings = await log.saveProject(project);
        refresh();
        let reminderWarning: string | null;
        try {
          reminderWarning = reminderSaveWarning(
            project.reminder,
            await native.reminderStatus(),
            project.id,
          );
        } catch {
          reminderWarning = reminderSaveWarning(
            project.reminder,
            undefined,
            project.id,
          );
        }
        leave(() => {
          if (id)
            router.dismissTo({
              pathname: '/project/[id]',
              params: { id: project.id },
            });
          else
            router.replace({
              pathname: '/project/[id]',
              params: { id: project.id },
            });
        });
        feedback.notify(
          reminderWarning ||
            warnings.join('\n') ||
            (id
              ? 'Änderungen am Projekt gespeichert.'
              : 'Projekt gespeichert. Als Nächstes kannst du deinen ersten Bauschritt erfassen.'),
        );
      }),
  };
}
