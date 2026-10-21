import type { Project } from '../../core/domain/models';
import {
  projectIconIds,
  type ProjectIconId,
} from '../../core/domain/project-icon';
import { messages } from '../../core/i18n';
import type { IconName } from '../../core/ui/icon';

const glyphs = {
  aircraft: 'flight',
  vehicle: 'directions_car',
  ship: 'directions_boat',
  figure: 'person_outline',
  diorama: 'landscape',
  train: 'train',
  rocket: 'rocket_launch',
  tools: 'build',
} as const satisfies Record<ProjectIconId, IconName>;

function iconOption(id: ProjectIconId) {
  return { id, label: messages.projectIcons.labels[id], glyph: glyphs[id] };
}

export const projectIconOptions = projectIconIds.map(iconOption);

export function projectIconOption(
  project: Pick<Project, 'modelType' | 'icon'>,
) {
  if (project.icon) return iconOption(project.icon);
  const modelType = project.modelType.trim().toLocaleLowerCase('de-DE');
  return (
    projectIconOptions.find(
      (option) => option.label.toLocaleLowerCase('de-DE') === modelType,
    ) ?? iconOption('tools')
  );
}
