import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { StartupError, StartupPending } from './startup/startup';
import { androidPasswordKey } from './backup/password-key';
import { migrate, SqlRepository } from './database/repository';
import { ExpoVault } from './files/expo-vault';
import { androidPhotoInspector } from './files/photo-inspector';
import {
  ProjectService,
  applyPickedPhotos,
} from '../features/steps/step-service';
import { BackupCodec, BackupService } from './backup/backup-service';
import { ExpoMedia, type MediaPort } from './media/media-service';
import { modelNative, type ModelLogNative } from './native/model-native';
import type { Environment } from './ports';

export type Services = {
  log: ProjectService;
  backup: BackupService;
  media: MediaPort;
  native: ModelLogNative;
};
const Context = createContext<
  (Services & { revision: number; refresh(): void }) | null
>(null);
let boot: Promise<Services> | undefined;
async function createServices(): Promise<Services> {
  const connection = await SQLite.openDatabaseAsync('modellbaulog.db');
  const db = {
    exec: (sql: string) => connection.execAsync(sql),
    run: async (sql: string, ...params: (string | number | null)[]) => {
      await connection.runAsync(sql, ...params);
    },
    all: <T,>(sql: string, ...params: (string | number | null)[]) =>
      connection.getAllAsync<T>(sql, ...params),
  };
  await migrate(db);
  const repository = new SqlRepository(db);
  const vault = new ExpoVault();
  const env: Environment = {
    id: Crypto.randomUUID,
    now: () => new Date().toISOString(),
    random: Crypto.getRandomBytes,
  };
  const log = new ProjectService(
    repository,
    vault,
    env,
    {
      async sync(projects, steps) {
        return modelNative.syncReminders(
          JSON.stringify(
            projects
              .filter((p) => p.reminder)
              .map((p) => {
                const latest = steps
                  .filter((s) => s.projectId === p.id)
                  .sort(
                    (a, b) =>
                      b.occurredAt.localeCompare(a.occurredAt) ||
                      b.createdAt.localeCompare(a.createdAt) ||
                      b.id.localeCompare(a.id),
                  )[0];
                return {
                  ...p.reminder,
                  recordId: p.id,
                  label: p.name,
                  category: 'model',
                  categoryLabel: p.modelType || 'Modellbauprojekt',
                  latestValue: latest?.number ?? null,
                  latestUnit: 'Schritt',
                };
              }),
          ),
        );
      },
    },
    androidPhotoInspector,
  );
  const media = new ExpoMedia(log);
  const interrupted = (await repository.drafts()).find((d) => d.external);
  if (interrupted) {
    const recovered = await media.recoverPhotos();
    try {
      await log.persistDraft({
        ...applyPickedPhotos(interrupted, recovered.photos),
        photoWarning: recovered.failures.join('\n'),
      });
    } catch (error) {
      await log.cleanup(recovered.photos.map((p) => p.file));
      throw error;
    }
  }
  // SQLite and drafts must be loaded before inspecting unreferenced vault files.
  await log.cleanup(await vault.list());
  await log.syncReminders();
  return {
    log,
    backup: new BackupService(
      log,
      new BackupCodec(env, androidPhotoInspector, androidPasswordKey),
    ),
    media,
    native: modelNative,
  };
}
export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Services>();
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    boot ??= createServices();
    let active = true;
    boot
      .then((value) => {
        if (active) setServices(value);
      })
      .catch((e) => {
        boot = undefined;
        if (active)
          setError(
            e instanceof Error
              ? e.message
              : 'Lokale Daten konnten nicht geladen werden.',
          );
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  if (!services)
    return error ? (
      <StartupError
        message={error}
        retry={() => {
          setError('');
          setAttempt((n) => n + 1);
        }}
      />
    ) : (
      <StartupPending />
    );
  return (
    <Context.Provider
      value={{
        ...services,
        revision,
        refresh: () => setRevision((n) => n + 1),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useServices() {
  const value = useContext(Context);
  if (!value) throw new Error('Composition Root fehlt.');
  return value;
}
