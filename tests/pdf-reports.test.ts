import { afterEach, expect, it, vi } from 'vitest';
import { PDFDocument, PDFName, PDFRawStream, PDFPage } from 'pdf-lib';
import { fixture, photo } from './support';
import { ReportLayout } from '../src/core/pdf/report-layout';
import { migrate } from '../src/core/database/repository';
import {
  stepDateTime,
  captureDifferences,
} from '../src/core/domain/capture-data';
import { validateSnapshot } from '../src/core/domain/models';
const fixtures: Awaited<ReturnType<typeof fixture>>[] = [];
async function setup() {
  const f = await fixture();
  fixtures.push(f);
  return f;
}
afterEach(async () => {
  vi.restoreAllMocks();
  for (const f of fixtures.splice(0)) await f.close();
});
async function addStep(
  f: Awaited<ReturnType<typeof fixture>>,
  number: number,
  images = 0,
) {
  const draft = await f.log.draft(f.project.id);
  draft.form.number = String(number);
  draft.form.title = `Montage ${number}`;
  draft.form.occurredAt = new Date(Date.UTC(2026, 9, number, 12)).toISOString();
  draft.form.timezoneOffsetMinutes = 120;
  draft.form.note = `Notiz zu Schritt ${number}`;
  for (let i = 0; i < images; i++) {
    const original = await photo();
    const bytes = new Uint8Array([
      ...original.slice(0, 2),
      0xff,
      0xfe,
      0,
      3,
      number * 10 + i,
      ...original.slice(2),
    ]);
    draft.form.photos.push(
      await f.log.importPhoto(bytes, `Foto ${number}-${i}.jpg`),
    );
  }
  return (await f.log.saveStep(draft)).step;
}
async function embedded(bytes: Uint8Array) {
  const doc = await PDFDocument.load(bytes);
  return doc.context
    .enumerateIndirectObjects()
    .map(([, v]) => v)
    .filter(
      (v): v is PDFRawStream =>
        v instanceof PDFRawStream &&
        v.dict.get(PDFName.of('Subtype')) === PDFName.of('Image'),
    )
    .map((v) => v.getContents());
}
it('exports the complete history with every ordered photo and notes, and single reports only from their step', async () => {
  const f = await setup();
  const first = await addStep(f, 1, 3);
  await addStep(f, 2, 2);
  for (let i = 3; i <= 12; i++) await addStep(f, i);
  const other = { ...f.project, id: f.env.id() };
  await f.log.saveProject(other);
  const draft = await f.log.draft(other.id);
  draft.form.number = '99';
  draft.form.note = 'Not in this report';
  await f.log.saveStep(draft);
  const text = vi.spyOn(ReportLayout.prototype, 'text');
  const table = vi.spyOn(ReportLayout.prototype, 'historyTable');
  const history = await f.reports.createReport(f.project.id, null, true);
  expect(table.mock.calls[0]![0]).toHaveLength(12);
  expect(text.mock.calls.some(([s]) => s === 'Notiz zu Schritt 1')).toBe(true);
  expect(text.mock.calls.some(([s]) => s === 'Not in this report')).toBe(false);
  const data = await f.repo.snapshot();
  const expected = data.steps
    .filter((s) => s.projectId === f.project.id)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .flatMap((s) => s.photos);
  expect(await embedded(await f.vault.read(history.file))).toEqual(
    await Promise.all(expected.map((p) => f.vault.read(p.file))),
  );
  const single = await f.reports.createReport(f.project.id, first.id, true);
  expect(await embedded(await f.vault.read(single.file))).toEqual(
    await Promise.all(first.photos.map((p) => f.vault.read(p.file))),
  );
});
it('keeps photo pairs inside page bounds and centers an odd last photo at the same size', async () => {
  const f = await setup();
  const step = await addStep(f, 1, 3);
  const draw = vi.spyOn(PDFPage.prototype, 'drawImage');
  await f.reports.createReport(f.project.id, step.id, true);
  const placements = draw.mock.calls.map(([, o]) => o!);
  expect(placements).toHaveLength(3);
  const [a, b, c] = placements;
  expect(a!.width).toBe(b!.width);
  expect(c!.width).toBe(a!.width);
  expect(a!.y).toBe(b!.y);
  expect(b!.x).toBeGreaterThan(a!.x! + a!.width!);
  expect(c!.x! + c!.width! / 2).toBeCloseTo(595.2756 / 2, 2);
  for (const box of placements) {
    expect(box.x).toBeGreaterThanOrEqual(40);
    expect(box.y).toBeGreaterThan(40);
    expect(box.y! + box.height!).toBeLessThan(802);
  }
});
it('rejects a broken included photo without partial output and reads no photos in compact reports', async () => {
  const f = await setup();
  const step = await addStep(f, 1, 1);
  await f.vault.remove(step.photos[0]!.file);
  const before = await f.repo.snapshot();
  await expect(
    f.reports.createReport(f.project.id, step.id, true),
  ).rejects.toThrow('Foto');
  expect(await f.repo.snapshot()).toEqual(before);
  expect(await f.vault.list()).toHaveLength(0);
  const reads = vi.spyOn(f.vault, 'read');
  const report = await f.reports.createReport(f.project.id, step.id, false);
  expect(reads).not.toHaveBeenCalled();
  expect(await embedded(await f.vault.read(report.file))).toHaveLength(0);
});
it('preserves capture details through edits and legacy migration without inventing old values', async () => {
  const f = await setup();
  const step = await addStep(f, 1);
  await f.log.saveProject({
    ...f.project,
    name: 'Changed',
    manufacturer: 'Changed manufacturer',
  });
  const draft = await f.log.draft(f.project.id, step);
  draft.form.note = 'Edited';
  await f.log.saveStep(draft);
  const saved = (await f.repo.step(step.id))!;
  expect(saved.projectAtCapture?.name).toBe(f.project.name);
  expect(saved.timezoneOffsetMinutes).toBe(120);
  expect(stepDateTime(saved, true)).toContain('14:00 (UTC+02:00)');
  expect(
    captureDifferences(saved, (await f.repo.project(f.project.id))!),
  ).toContainEqual(['Projekt', f.project.name]);
  const legacy = { ...saved };
  delete legacy.projectAtCapture;
  delete legacy.timezoneOffsetMinutes;
  await f.repo.saveStep(legacy, 'absent');
  const pending = await f.log.draft(f.project.id);
  await f.db.exec('DROP TABLE reports; PRAGMA user_version=1;');
  await migrate(f.db);
  expect(await f.repo.step(step.id)).toEqual(legacy);
  expect((await f.repo.drafts())[0]?.id).toBe(pending.id);
  const old = validateSnapshot({ projects: [f.project], steps: [legacy] });
  expect(old.reports).toEqual([]);
  expect(old.steps[0]?.projectAtCapture).toBeUndefined();
});
it('roundtrips PDF bytes and capture fields in backups, and deletes only the appropriate reports', async () => {
  const source = await setup(),
    target = await setup();
  const step = await addStep(source, 1, 1);
  const single = await source.reports.createReport(
    source.project.id,
    step.id,
    true,
  );
  const history = await source.reports.createReport(
    source.project.id,
    null,
    true,
  );
  const bytes = await source.backup.create('Modell26');
  const decoded = await target.backup.codec.decode(bytes, 'Modell26');
  await target.backup.restore(decoded);
  const restored = await target.repo.snapshot();
  expect(restored.reports).toHaveLength(2);
  expect(restored.steps[0]?.projectAtCapture).toEqual(step.projectAtCapture);
  for (const r of restored.reports)
    expect(await target.vault.read(r.file)).toEqual(
      await source.vault.read(r.id === single.id ? single.file : history.file),
    );
  await target.log.delete('step', step.id);
  expect((await target.repo.snapshot()).reports.map((r) => r.id)).toEqual([
    history.id,
  ]);
  expect(await target.vault.list()).toHaveLength(1);
  await target.log.delete('project', source.project.id);
  expect(await target.vault.list()).toHaveLength(0);
});
it('flows long notes across pages and rolls back file writes if metadata cannot be saved', async () => {
  const f = await setup();
  const step = await addStep(f, 1);
  const draft = await f.log.draft(f.project.id, step);
  draft.form.note = 'Lange Notiz mit ÄÖÜ und Farbe 71.010.\n'.repeat(450);
  await f.log.saveStep(draft);
  const report = await f.reports.createReport(f.project.id, step.id, false);
  expect(
    (await PDFDocument.load(await f.vault.read(report.file))).getPageCount(),
  ).toBeGreaterThan(5);
  const files = await f.vault.list();
  vi.spyOn(f.repo, 'saveReports').mockRejectedValueOnce(
    new Error('Storage unavailable'),
  );
  await expect(
    f.reports.createReport(f.project.id, step.id, false),
  ).rejects.toThrow('Storage unavailable');
  expect(await f.vault.list()).toEqual(files);
});
