import { PdfService } from '../src/core/pdf/pdf-service';
import { ReportService } from '../src/features/pdf/report-service';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, pbkdf2Sync } from 'node:crypto';
import {
  mkdtemp,
  readFile,
  writeFile,
  mkdir,
  rename,
  readdir,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SqlRepository, migrate } from '../src/core/database/repository';
import type {
  Environment,
  FileVault,
  PhotoInspector,
  SqlConnection,
} from '../src/core/ports';
import { fileKey, type Project } from '../src/core/domain/models';
import { ProjectService } from '../src/features/steps/step-service';
import { BackupCodec, BackupService } from '../src/core/backup/backup-service';

export class NodeVault implements FileVault {
  constructor(readonly directory: string) {}
  uri(key: string) {
    return join(this.directory, fileKey.parse(key));
  }
  async read(key: string) {
    return new Uint8Array(await readFile(this.uri(key)));
  }
  async put(bytes: Uint8Array, kind: 'jpg' | 'pdf' = 'jpg') {
    await mkdir(this.directory, { recursive: true });
    const key = `${randomUUID()}.${kind}`;
    await writeFile(this.uri(key) + '.tmp', bytes);
    await rename(this.uri(key) + '.tmp', this.uri(key));
    return key;
  }
  async remove(key: string) {
    await rm(this.uri(key), { force: true });
  }
  async list() {
    return readdir(this.directory).catch(() => [] as string[]);
  }
}
export function connect(path: string) {
  const raw = new DatabaseSync(path);
  const db: SqlConnection = {
    async exec(sql) {
      raw.exec(sql);
    },
    async run(sql, ...params) {
      raw.prepare(sql).run(...params);
    },
    async all<T>(sql: string, ...params: (string | number | null)[]) {
      return raw.prepare(sql).all(...params) as T[];
    },
  };
  return { raw, db };
}
export async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'modellbaulog-test-'));
  const path = join(root, 'model.db');
  const { raw, db } = connect(path);
  await migrate(db);
  const repo = new SqlRepository(db);
  const vault = new NodeVault(join(root, 'vault'));
  let clock = Date.parse('2026-10-02T06:00:00.000Z');
  const env: Environment = {
    id: randomUUID,
    now: () => new Date(clock++).toISOString(),
    random: (n) => new Uint8Array(randomBytes(n)),
  };
  // Node tests exercise the image port. Android decoder behavior is tested in PhotoFilesTest.
  const inspector: PhotoInspector = {
    async validate(bytes) {
      if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('Kein JPEG.');
    },
  };
  const log = new ProjectService(
    repo,
    vault,
    env,
    {
      async sync() {
        return [];
      },
    },
    inspector,
  );
  const codec = new BackupCodec(
    env,
    inspector,
    async (password, salt, iterations) =>
      new Uint8Array(pbkdf2Sync(password, salt, iterations, 32, 'sha256')),
  );
  const backup = new BackupService(log, codec);
  const pdf = new PdfService(vault, async () => ({
    regular: new Uint8Array(
      await readFile(
        new URL('../assets/ui/Roboto-Regular.ttf', import.meta.url),
      ),
    ),
    bold: new Uint8Array(
      await readFile(new URL('../assets/ui/Roboto-Bold.ttf', import.meta.url)),
    ),
  }));
  const reports = new ReportService(log, pdf);
  const now = env.now();
  const project: Project = {
    id: env.id(),
    name: 'Spitfire 1:48',
    modelType: 'Flugzeug',
    manufacturer: 'Modellhersteller',
    material: 'Kunststoff',
    reminder: null,
    createdAt: now,
    updatedAt: now,
  };
  await log.saveProject(project);
  return {
    root,
    path,
    raw,
    db,
    repo,
    vault,
    env,
    inspector,
    log,
    backup,
    pdf,
    reports,
    project,
    async close() {
      raw.close();
      await rm(root, { recursive: true, force: true });
    },
  };
}
export async function photo() {
  return new Uint8Array(
    await readFile(new URL('../assets/synthetic-photo.jpg', import.meta.url)),
  );
}
