import type { Project } from '../../core/domain/models';
import type { ReminderStatus } from '../../core/native/model-native';

export function needsReminderRepair(
  project: Project,
  status?: ReminderStatus,
): boolean {
  if (!status) return false;
  const schedule = status.schedules.find(
    (item) => item.recordId === project.id,
  );
  return (
    schedule?.planningState === 'cancelFailed' ||
    (!!project.reminder &&
      (schedule?.planningState !== 'scheduled' ||
        !schedule.nextTriggerAtMillis ||
        (project.reminder.deliveryMode === 'punctualWithSound' &&
          schedule.isExact === false)))
  );
}
