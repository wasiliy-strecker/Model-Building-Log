import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { PhotoAttachment, BuildStepDraft } from '../domain/models';
import type { ProjectService } from '../../features/steps/step-service';
import { modelNative } from '../native/model-native';
import { MAX_PHOTO_EDGE } from '../files/limits';
import { MAX_BACKUP_BYTES } from '../backup/backup-service';

export type PreparedBackup = { uri: string; name: string };
export type PickResult = { photos: PhotoAttachment[]; failures: string[] };
export interface MediaPort {
  pick(
    source: NonNullable<BuildStepDraft['external']>,
    multiple?: boolean,
  ): Promise<PickResult>;
  recoverPhotos(): Promise<PickResult>;
  prepareBackup(bytes: Uint8Array): Promise<PreparedBackup>;
  saveBackup(file: PreparedBackup): Promise<'saved' | 'cancelled'>;
  shareBackup(file: PreparedBackup): Promise<void>;
  discardBackup(file: PreparedBackup): Promise<void>;
  pickBackup(): Promise<Uint8Array | null>;
}
export class ExpoMedia implements MediaPort {
  constructor(private log: ProjectService) {}
  async importPhoto(
    asset: ImagePicker.ImagePickerAsset,
  ): Promise<PhotoAttachment> {
    const manipulator = ImageManipulator.manipulate(asset.uri);
    let rendered:
      Awaited<ReturnType<typeof manipulator.renderAsync>> | undefined;
    let file: File | undefined;
    try {
      if (Math.max(asset.width, asset.height) > MAX_PHOTO_EDGE)
        manipulator.resize(
          asset.width >= asset.height
            ? { width: MAX_PHOTO_EDGE }
            : { height: MAX_PHOTO_EDGE },
        );
      rendered = await manipulator.renderAsync();
      const result = await rendered.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.88,
      });
      file = new File(result.uri);
      return await this.log.importPhoto(
        await file.bytes(),
        asset.fileName?.replace(/\.[^.]*$/, '.jpg') || 'Foto.jpg',
      );
    } finally {
      if (file?.exists) file.delete();
      rendered?.release();
      manipulator.release();
    }
  }
  private async photos(
    result:
      ImagePicker.ImagePickerResult | ImagePicker.ImagePickerErrorResult | null,
  ): Promise<PickResult> {
    const output: PickResult = { photos: [], failures: [] };
    if (!result) return output;
    if ('code' in result) {
      output.failures.push(
        result.message ||
          'Die Fotoauswahl konnte nicht wiederhergestellt werden.',
      );
      return output;
    }
    if (result.canceled) return output;
    for (const asset of result.assets) {
      try {
        output.photos.push(await this.importPhoto(asset));
      } catch {
        output.failures.push(
          `${asset.fileName || 'Foto'} konnte nicht übernommen werden.`,
        );
      }
    }
    return output;
  }
  async pick(
    source: NonNullable<BuildStepDraft['external']>,
    multiple = true,
  ): Promise<PickResult> {
    if (source === 'camera') {
      if (!(await ImagePicker.requestCameraPermissionsAsync()).granted)
        throw new Error(
          'Die Kamera ist nicht freigegeben. Du kannst Fotos aus der Galerie wählen.',
        );
      return this.photos(
        await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 1,
          exif: false,
        }),
      );
    }
    return this.photos(
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: multiple,
        quality: 1,
        exif: false,
      }),
    );
  }
  async recoverPhotos() {
    return this.photos(await ImagePicker.getPendingResultAsync());
  }
  async prepareBackup(bytes: Uint8Array): Promise<PreparedBackup> {
    const directory = new Directory(Paths.cache, 'exports');
    directory.create({ intermediates: true, idempotent: true });
    const name = `ModellbauLog-${new Date().toISOString().replace(/[:.]/g, '-')}.mlbackup`;
    const file = new File(directory, name);
    try {
      file.write(bytes);
      return { uri: file.uri, name };
    } catch (error) {
      if (file.exists) file.delete();
      throw error;
    }
  }
  async saveBackup(file: PreparedBackup) {
    return (await modelNative.saveBackupFile(file.uri, file.name)).status;
  }
  async shareBackup(file: PreparedBackup) {
    if (!(await Sharing.isAvailableAsync()))
      throw new Error('Teilen ist auf diesem Gerät nicht verfügbar.');
    const directory = new Directory(Paths.cache, 'shared-backups');
    directory.create({ idempotent: true, intermediates: true });
    const copy = new File(directory, file.name);
    await new File(file.uri).copy(copy);
    await Sharing.shareAsync(copy.uri, {
      mimeType: 'application/octet-stream',
      dialogTitle: 'ModellbauLog-Backup teilen',
    });
  }
  async discardBackup(file: PreparedBackup) {
    const directory = new Directory(Paths.cache, 'exports');
    const prefix = directory.uri.replace(/\/$/, '') + '/';
    if (
      !file.uri.startsWith(prefix) ||
      file.uri.slice(prefix.length).includes('/')
    )
      throw new Error('Ungültige Backup-Referenz.');
    const stored = new File(file.uri);
    if (stored.exists) stored.delete();
  }
  async pickBackup() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/octet-stream',
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return null;
    const asset = result.assets[0];
    if (!asset?.name.toLowerCase().endsWith('.mlbackup'))
      throw new Error('Bitte eine .mlbackup-Datei auswählen.');
    const file = new File(asset.uri);
    try {
      if (file.size > MAX_BACKUP_BYTES)
        throw new Error('Das Backup ist größer als 128 MB.');
      return await file.bytes();
    } finally {
      if (file.exists) file.delete();
    }
  }
}
