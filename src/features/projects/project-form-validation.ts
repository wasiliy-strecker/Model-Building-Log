import type { Project } from '../../core/domain/models';
import { messages } from '../../core/i18n';
import type { FormErrors } from '../../core/ui/use-form-errors';

export const projectFieldOrder = [
  'modelType',
  'name',
  'manufacturer',
  'material',
];

export function validateProjectForm(project: Project): FormErrors {
  const errors: FormErrors = {};
  if (!project.name.trim()) errors.name = messages.validation.projectName;
  for (const key of ['modelType', 'name', 'manufacturer', 'material'] as const)
    if (project[key].trim().length > 500)
      errors[key] = messages.validation.shortText;
  return errors;
}
