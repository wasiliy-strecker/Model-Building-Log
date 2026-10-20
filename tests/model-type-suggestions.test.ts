import { expect, it } from 'vitest';
import { fixture, connect } from './support';
import { SqlRepository } from '../src/core/database/repository';
import { modelTypeSuggestions } from '../src/features/projects/presentation-model';

it('offers exactly six German types and preserves custom types after editing and reopening SQLite', async () => {
  const f = await fixture();
  try {
    expect(modelTypeSuggestions).toEqual([
      'Flugzeug',
      'Fahrzeug',
      'Schiff',
      'Figur',
      'Diorama',
      'Sonstiges',
    ]);
    await f.log.saveProject({
      ...f.project,
      modelType: 'RC-Segelflugzeug / Eigenbau',
    });
    const saved = (await f.repo.project(f.project.id))!;
    await f.log.saveProject({ ...saved, manufacturer: 'Eigene Werkstatt' });
    const reopened = connect(f.path);
    try {
      const project = await new SqlRepository(reopened.db).project(saved.id);
      expect(project?.modelType).toBe('RC-Segelflugzeug / Eigenbau');
      expect(project?.manufacturer).toBe('Eigene Werkstatt');
      expect(modelTypeSuggestions).toHaveLength(6);
      expect(modelTypeSuggestions).not.toContain(project?.modelType);
    } finally {
      reopened.raw.close();
    }
  } finally {
    await f.close();
  }
});
