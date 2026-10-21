import { expect, it } from 'vitest';
import { SqlRepository } from '../src/core/database/repository';
import { projectIconOption } from '../src/features/projects/project-icon-model';
import { connect, fixture } from './support';

it.each([
  ['Flugzeug', 'aircraft'],
  ['  fAHrZeUg  ', 'vehicle'],
  ['Schiff', 'ship'],
  ['Figur', 'figure'],
  ['Diorama', 'diorama'],
  ['EISENBAHN', 'train'],
  [' Rakete ', 'rocket'],
  ['Sonstiges', 'tools'],
  ['', 'tools'],
  ['RC-Segelflugzeug / Eigenbau', 'tools'],
])('automatically resolves model type %j to %s', (modelType, expected) => {
  expect(projectIconOption({ modelType }).id).toBe(expected);
});

it('keeps a chosen symbol through edits and SQLite reopening, then returns to automatic selection', async () => {
  const f = await fixture();
  try {
    const original = (await f.repo.project(f.project.id))!;
    expect(original).not.toHaveProperty('icon');
    expect(projectIconOption(original).id).toBe('aircraft');

    await f.log.saveProject({ ...original, icon: 'rocket' });
    const chosen = (await f.repo.project(original.id))!;
    await f.log.saveProject({ ...chosen, modelType: 'Eisenbahn' });
    const reopened = connect(f.path);
    try {
      const repo = new SqlRepository(reopened.db);
      const edited = (await repo.project(original.id))!;
      expect(edited.icon).toBe('rocket');
      expect(projectIconOption(edited).id).toBe('rocket');
      expect((await repo.dashboard())[0]?.project.icon).toBe('rocket');

      await f.log.saveProject({ ...edited, icon: undefined });
      const automatic = (await repo.project(original.id))!;
      expect(automatic).not.toHaveProperty('icon');
      expect(projectIconOption(automatic).id).toBe('train');

      await f.log.saveProject({ ...automatic, modelType: 'Schiff' });
      expect(projectIconOption((await repo.project(original.id))!).id).toBe(
        'ship',
      );
    } finally {
      reopened.raw.close();
    }
  } finally {
    await f.close();
  }
});
