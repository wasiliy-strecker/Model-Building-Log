import { afterEach, expect, it, vi } from 'vitest';
import { createDecipheriv, pbkdf2Sync } from 'node:crypto';
import { fixture, photo } from './support';
import { projectIconOption } from '../src/features/projects/project-icon-model';

const fixtures: Awaited<ReturnType<typeof fixture>>[] = [];
async function setup() {
  const f = await fixture();
  fixtures.push(f);
  return f;
}
afterEach(async () => {
  for (const f of fixtures.splice(0)) await f.close();
});
const password = 'Modell26';

it('exports independently decryptable backups and restores ordered photos and optional project symbols', async () => {
  const source = await setup(),
    target = await setup();
  await source.log.saveProject({ ...source.project, icon: 'rocket' });
  const automaticProject = {
    ...source.project,
    id: source.env.id(),
    modelType: 'Eisenbahn',
  };
  await source.log.saveProject(automaticProject);
  const draft = await source.log.draft(source.project.id);
  draft.form = {
    ...draft.form,
    number: '12',
    title: 'Lackieren',
    note: 'Farbe 71.010',
    photos: [
      await source.log.importPhoto(await photo(), 'B.jpg'),
      await source.log.importPhoto(await photo(), 'A.jpg'),
    ],
  };
  await source.log.saveStep(draft);
  const bytes = await source.backup.create(password);
  expect(new TextDecoder().decode(bytes.slice(0, 8))).toBe('MLBACK01');
  const key = pbkdf2Sync(password, bytes.slice(12, 28), 600000, 32, 'sha256');
  const decipher = createDecipheriv('aes-256-gcm', key, bytes.slice(28, 40));
  decipher.setAAD(bytes.slice(0, 40));
  decipher.setAuthTag(bytes.slice(-16));
  const plaintext = Buffer.concat([
    decipher.update(bytes.slice(40, -16)),
    decipher.final(),
  ]);
  const manifest = JSON.parse(
    plaintext.subarray(4, 4 + plaintext.readUInt32BE(0)).toString(),
  );
  expect(manifest.format).toBe('modellbaulog_backup');
  await target.backup.restore(
    await target.backup.codec.decode(bytes, password),
  );
  const restored = await target.repo.steps(source.project.id);
  expect(restored.rows[0]?.photos.map((p) => p.name)).toEqual([
    'B.jpg',
    'A.jpg',
  ]);
  expect(restored.rows[0]?.note).toBe('Farbe 71.010');
  const manual = (await target.repo.project(source.project.id))!;
  expect(manual.icon).toBe('rocket');
  expect(projectIconOption(manual).id).toBe('rocket');
  const automatic = (await target.repo.project(automaticProject.id))!;
  expect(automatic).not.toHaveProperty('icon');
  expect(projectIconOption(automatic).id).toBe('train');
});

it('rejects wrong passwords, tampering and foreign identities without changing local data', async () => {
  const f = await setup();
  const before = await f.repo.snapshot();
  const bytes = await f.backup.create(password);
  await expect(f.backup.codec.decode(bytes, 'Wrong26')).rejects.toThrow();
  const tampered = bytes.slice();
  tampered[45] = tampered[45]! ^ 1;
  await expect(f.backup.codec.decode(tampered, password)).rejects.toThrow();
  const foreign = bytes.slice();
  foreign.set(new TextEncoder().encode('HABACK01'));
  await expect(f.backup.codec.decode(foreign, password)).rejects.toThrow(
    'ModellbauLog',
  );
  expect(await f.repo.snapshot()).toEqual(before);
});

it('preserves newer local content, repairs matching photos and keeps drafts during restore', async () => {
  const f = await setup();
  const image = await f.log.importPhoto(await photo(), 'Foto.jpg');
  const draft = await f.log.draft(f.project.id);
  draft.form = { ...draft.form, number: '3', photos: [image] };
  const saved = (await f.log.saveStep(draft)).step;
  const bytes = await f.backup.create(password);
  const edit = await f.log.draft(f.project.id, saved);
  edit.form.note = 'Neuere lokale Notiz';
  const changed = (await f.log.saveStep(edit)).step;
  const pending = await f.log.draft(f.project.id, changed);
  pending.form.title = 'Offener Entwurf';
  await f.log.persistDraft(pending);
  await f.vault.remove(image.file);
  await f.backup.restore(await f.backup.codec.decode(bytes, password));
  const result = (await f.repo.step(saved.id))!;
  expect(result.note).toBe('Neuere lokale Notiz');
  expect(await f.vault.read(result.photos[0]!.file)).toEqual(await photo());
  expect((await f.repo.drafts())[0]?.form.title).toBe('Offener Entwurf');
  const repairedDraft = (await f.repo.drafts())[0]!;
  expect(repairedDraft.form.photos[0]!.file).toBe(result.photos[0]!.file);
  await f.log.saveStep(repairedDraft);
  expect((await f.repo.step(saved.id))?.title).toBe('Offener Entwurf');
});

it('rolls back staged files if the database restore fails', async () => {
  const f = await setup();
  const draft = await f.log.draft(f.project.id);
  draft.form = {
    ...draft.form,
    number: '4',
    photos: [await f.log.importPhoto(await photo(), 'Foto.jpg')],
  };
  await f.log.saveStep(draft);
  const before = await f.repo.snapshot(),
    files = await f.vault.list();
  const decoded = await f.backup.codec.decode(
    await f.backup.create(password),
    password,
  );
  vi.spyOn(f.repo, 'replace').mockRejectedValueOnce(
    new Error('Synthetic restore failure'),
  );
  await expect(f.backup.restore(decoded)).rejects.toThrow('Synthetic');
  expect(await f.repo.snapshot()).toEqual(before);
  expect(await f.vault.list()).toEqual(files);
});
