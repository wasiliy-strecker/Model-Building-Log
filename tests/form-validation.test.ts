import { expect, it } from 'vitest';
import { fixture } from './support';
import { validateProjectForm } from '../src/features/projects/project-form-validation';
import { validateStepForm } from '../src/features/steps/step-form-validation';
import { suggestionLayout } from '../src/core/ui/suggestion-layout';

it('maps existing rules to fields while keeping optional model types and exact step numbers', async () => {
  const f = await fixture();
  try {
    expect(
      validateProjectForm({
        ...f.project,
        modelType: '',
        manufacturer: '',
        material: '',
      }),
    ).toEqual({});
    expect(
      Object.keys(
        validateProjectForm({
          ...f.project,
          name: ' ',
          material: 'x'.repeat(501),
        }),
      ),
    ).toEqual(['name', 'material']);
    const draft = await f.log.draft(f.project.id);
    for (const number of ['0', '0012', '900719925474099312345'])
      expect(validateStepForm({ ...draft.form, number })).toEqual({});
    for (const number of ['', '-1', '1.5', '1,5', '12x'])
      expect(validateStepForm({ ...draft.form, number }).number).toBeTruthy();
    expect(
      Object.keys(
        validateStepForm({
          ...draft.form,
          number: '0',
          title: 'x'.repeat(501),
          occurredAt: '',
          note: 'x'.repeat(20001),
        }),
      ),
    ).toEqual(['title', 'occurredAt', 'note']);
  } finally {
    await f.close();
  }
});

it('places suggestions in visible space above or below the field and bounds scrolling above the keyboard', () => {
  expect(
    suggestionLayout({ top: 100, height: 60 }, { top: 88, bottom: 500 }, 220),
  ).toEqual({ above: false, maxHeight: 220 });
  expect(
    suggestionLayout({ top: 400, height: 60 }, { top: 88, bottom: 500 }, 220),
  ).toEqual({ above: true, maxHeight: 220 });
  expect(
    suggestionLayout({ top: 150, height: 60 }, { top: 88, bottom: 230 }, 220),
  ).toEqual({ above: true, maxHeight: 50 });
  expect(
    suggestionLayout({ top: 500, height: 60 }, { top: 88, bottom: 400 }, 220)
      .maxHeight,
  ).toBe(0);
});
