import { expect, it } from 'vitest';
import { fixture, photo } from './support';

it('keeps latest progress independent of cover selection and follows saved photo order, edits and deletion', async () => {
  const f = await fixture();
  try {
    const a = await f.log.importPhoto(await photo(), 'A.jpg');
    const b = await f.log.importPhoto(await photo(), 'B.jpg');
    const old = await f.log.draft(f.project.id);
    old.form = {
      ...old.form,
      number: '99',
      occurredAt: '2026-10-01T12:00:00.000Z',
      photos: [b, a],
    };
    const saved = (await f.log.saveStep(old)).step;
    for (let i = 0; i < 12; i++) {
      const newer = await f.log.draft(f.project.id);
      newer.form = {
        ...newer.form,
        number: String(i),
        occurredAt: new Date(Date.UTC(2026, 9, i + 2)).toISOString(),
      };
      await f.log.saveStep(newer);
    }
    expect((await f.repo.dashboard())[0]?.latest?.number).toBe('11');
    expect((await f.repo.dashboard())[0]?.photo?.photo.id).toBe(b.id);
    expect((await f.repo.latestPhoto(f.project.id))?.stepId).toBe(saved.id);
    const edit = await f.log.draft(f.project.id, saved);
    edit.form.photos = [a, b];
    await f.log.saveStep(edit);
    expect((await f.repo.latestPhoto(f.project.id))?.photo.id).toBe(a.id);
    expect((await f.repo.dashboard())[0]?.photo?.photo.id).toBe(a.id);
    await f.log.delete('step', saved.id);
    expect(await f.repo.latestPhoto(f.project.id)).toBeNull();
    expect((await f.repo.dashboard())[0]?.photo).toBeNull();
    expect((await f.repo.dashboard())[0]?.latest?.number).toBe('11');
  } finally {
    await f.close();
  }
});
