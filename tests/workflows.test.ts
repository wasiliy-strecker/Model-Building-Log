import { afterEach, expect, it, vi } from 'vitest';
import { fixture, photo, connect } from './support';
import { SqlRepository } from '../src/core/database/repository';
import { parseStepNumber, stepDifference } from '../src/core/domain/models';
import {
  ProjectService,
  applyPickedPhotos,
} from '../src/features/steps/step-service';

const fixtures: Awaited<ReturnType<typeof fixture>>[] = [];
async function setup() {
  const f = await fixture();
  fixtures.push(f);
  return f;
}
afterEach(async () => {
  for (const f of fixtures.splice(0)) await f.close();
});

it('keeps chronological progress independent of step number, edits, pagination and search', async () => {
  const f = await setup();
  for (let i = 0; i < 12; i++) {
    const draft = await f.log.draft(f.project.id);
    draft.form = {
      ...draft.form,
      number: String(20 - i),
      title: `Montage ${i}`,
      note: i === 0 ? 'Farbe 71.010' : '',
      occurredAt: new Date(Date.UTC(2026, 8, i + 1)).toISOString(),
    };
    await f.log.saveStep(draft);
  }
  expect((await f.repo.dashboard())[0]?.latest?.number).toBe('9');
  const first = await f.repo.steps(f.project.id);
  expect(first.rows).toHaveLength(10);
  expect(first.total).toBe(12);
  expect((await f.repo.steps(f.project.id, '', 10)).rows).toHaveLength(2);
  const searched = await f.repo.steps(f.project.id, '71.010');
  expect(searched.rows).toHaveLength(1);
  const older = searched.rows[0]!;
  const draft = await f.log.draft(f.project.id, older);
  draft.form.note = 'Teile nacharbeiten';
  await f.log.saveStep(draft);
  expect((await f.repo.dashboard())[0]?.latest?.number).toBe('9');
  expect((await f.repo.steps(f.project.id)).total).toBe(12);
  expect(
    stepDifference(
      first.rows[0]!,
      (await f.repo.previousStep(first.rows[0]!))!,
    ),
  ).toBe('-1');
});

it('validates whole step numbers and preserves integers beyond JavaScript precision', async () => {
  const f = await setup();
  expect(parseStepNumber(' 0000 ')).toBe('0');
  for (const input of ['', '-1', '1.5', '1,5', '12x'])
    expect(() => parseStepNumber(input)).toThrow();
  const draft = await f.log.draft(f.project.id);
  draft.form.number = '900719925474099312345';
  const saved = await f.log.saveStep(draft);
  expect((await f.repo.step(saved.step.id))?.number).toBe(draft.form.number);
});

it('saves photo order and replacement, preserves old files on discard and cleans after commit', async () => {
  const f = await setup();
  const a = await f.log.importPhoto(await photo(), 'A.jpg');
  const b = await f.log.importPhoto(await photo(), 'B.jpg');
  const draft = await f.log.draft(f.project.id);
  draft.form = { ...draft.form, number: '12', photos: [a, b] };
  const saved = (await f.log.saveStep(draft)).step;
  const edit = await f.log.draft(f.project.id, saved);
  const c = await f.log.importPhoto(await photo(), 'C.jpg');
  edit.form.photos = [c, a];
  await f.log.persistDraft(edit);
  await f.log.discard(edit);
  expect(new Set(await f.vault.list())).toEqual(new Set([a.file, b.file]));
  expect((await f.repo.step(saved.id))?.photos.map((p) => p.name)).toEqual([
    'A.jpg',
    'B.jpg',
  ]);
  const again = await f.log.draft(f.project.id, saved);
  again.form.photos = [b, a];
  const reordered = (await f.log.saveStep(again)).step;
  expect((await f.repo.step(saved.id))?.photos.map((p) => p.name)).toEqual([
    'B.jpg',
    'A.jpg',
  ]);
  const replacement = await f.log.draft(f.project.id, reordered);
  const d = await f.log.importPhoto(await photo(), 'D.jpg');
  replacement.form.photos = [b, d];
  await f.log.saveStep(replacement);
  expect(new Set(await f.vault.list())).toEqual(new Set([b.file, d.file]));
});

it('keeps saved photos after a failed save and protects files referenced by another draft', async () => {
  const f = await setup();
  const image = await f.log.importPhoto(await photo(), 'Foto.jpg');
  const draft = await f.log.draft(f.project.id);
  draft.form = { ...draft.form, number: '2', photos: [image] };
  const saved = (await f.log.saveStep(draft)).step;
  const edit = await f.log.draft(f.project.id, saved);
  edit.form.photos = [];
  await f.log.persistDraft(edit);
  vi.spyOn(f.repo, 'saveStep').mockRejectedValueOnce(
    new Error('Synthetic database failure'),
  );
  await expect(f.log.saveStep(edit)).rejects.toThrow('Synthetic');
  expect(await f.vault.list()).toContain(image.file);
  expect((await f.repo.step(saved.id))?.photos).toHaveLength(1);
  await f.log.discard(edit);
  const another = await f.log.draft(f.project.id);
  another.form.photos = [image];
  await f.log.persistDraft(another);
  await f.log.delete('step', saved.id);
  expect(await f.vault.list()).toContain(image.file);
  await f.log.discard(another);
  expect(await f.vault.list()).toEqual([]);
});

it('recovers a replacement at its original position from a reopened SQLite draft', async () => {
  const f = await setup();
  const a = await f.log.importPhoto(await photo(), 'A.jpg');
  const b = await f.log.importPhoto(await photo(), 'B.jpg');
  const draft = await f.log.draft(f.project.id);
  draft.form = { ...draft.form, number: '7', title: 'Cockpit', photos: [a, b] };
  const saved = (await f.log.saveStep(draft)).step;
  const edit = await f.log.draft(f.project.id, saved);
  edit.external = 'gallery';
  edit.replacePhotoId = a.id;
  await f.log.persistDraft(edit);
  const reopened = connect(f.path);
  try {
    const repo = new SqlRepository(reopened.db);
    const recovered = (await repo.drafts())[0]!;
    expect(recovered.form.title).toBe('Cockpit');
    const c = await f.log.importPhoto(await photo(), 'C.jpg');
    const next = applyPickedPhotos(recovered, [c]);
    expect(next.form.photos.map((p) => p.name)).toEqual(['C.jpg', 'B.jpg']);
    expect(next.form.number).toBe('7');
    const log = new ProjectService(
      repo,
      f.vault,
      f.env,
      {
        async sync() {
          return [];
        },
      },
      f.inspector,
    );
    await log.persistDraft(next);
    await log.saveStep(next);
    expect(await f.vault.list()).not.toContain(a.file);
    expect(await repo.drafts()).toEqual([]);
  } finally {
    reopened.raw.close();
  }
});

it('deletes a project together with steps, drafts and unreferenced photos', async () => {
  const f = await setup();
  const draft = await f.log.draft(f.project.id);
  draft.form.photos = [await f.log.importPhoto(await photo(), 'Entwurf.jpg')];
  await f.log.persistDraft(draft);
  await f.log.delete('project', f.project.id);
  expect(await f.repo.snapshot()).toEqual({
    projects: [],
    steps: [],
    reports: [],
  });
  expect(await f.repo.drafts()).toEqual([]);
  expect(await f.vault.list()).toEqual([]);
});
