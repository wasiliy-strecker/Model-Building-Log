import { expect, it } from 'vitest';
import { fixture, photo } from './support';
import { toggleComparisonPhoto } from '../src/features/media/comparison-model';
import { photoReference, type ProjectPhoto } from '../src/core/domain/models';

it('selects more than four photos across history pages without changing saved photo order', async () => {
  const f = await fixture();
  try {
    for (let i = 0; i < 2; i++) {
      const draft = await f.log.draft(f.project.id);
      const original = await f.log.importPhoto(
        await photo(),
        `Original${i}.jpg`,
      );
      draft.form = {
        ...draft.form,
        number: String(i),
        occurredAt: `2026-09-0${i + 1}T10:00:00.000Z`,
        photos: Array.from({ length: 30 }, (_, n) => ({
          ...original,
          id: f.env.id(),
          name: `Foto ${i}-${n}.jpg`,
        })),
      };
      await f.log.saveStep(draft);
    }
    const before = await f.repo.snapshot();
    const first = await f.repo.photos(f.project.id),
      second = await f.repo.photos(f.project.id, first.rows.length);
    expect(first.total).toBe(60);
    expect(first.rows).toHaveLength(40);
    expect(second.rows).toHaveLength(20);
    let selected: ProjectPhoto[] = [];
    for (const p of [...first.rows.slice(0, 4), ...second.rows.slice(0, 4)])
      selected = toggleComparisonPhoto(selected, p);
    expect(selected).toHaveLength(8);
    expect(new Set(selected.map((p) => p.stepId)).size).toBe(2);
    const removed = selected[1]!;
    selected = toggleComparisonPhoto(selected, removed);
    selected = toggleComparisonPhoto(selected, removed);
    expect(photoReference(selected.at(-1)!)).toBe(photoReference(removed));
    expect(await f.repo.snapshot()).toEqual(before);
  } finally {
    await f.close();
  }
});
