import { parseStepNumber, type BuildStepForm } from '../../core/domain/models';
import { messages } from '../../core/i18n';
import type { FormErrors } from '../../core/ui/use-form-errors';

export const stepFieldOrder = ['number', 'title', 'occurredAt', 'note'];

export function validateStepForm(form: BuildStepForm): FormErrors {
  const errors: FormErrors = {};
  try {
    parseStepNumber(form.number);
  } catch {
    errors.number = messages.validation.stepNumber;
  }
  if (form.title.trim().length > 500)
    errors.title = messages.validation.shortText;
  if (!form.occurredAt || !Number.isFinite(Date.parse(form.occurredAt)))
    errors.occurredAt = messages.validation.occurredAt;
  if (form.note.length > 20000) errors.note = messages.validation.note;
  return errors;
}
