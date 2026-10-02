import { Directory, File, Paths } from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { modelNative } from '../native/model-native';
import type { PhotoInspector } from '../ports';
import { MAX_FILE_BYTES } from './limits';

export const androidPhotoInspector: PhotoInspector = {
  async validate(bytes) {
    if (
      bytes.length < 4 ||
      bytes.length > MAX_FILE_BYTES ||
      bytes[0] !== 0xff ||
      bytes[1] !== 0xd8
    )
      throw new Error('Das Foto ist kein gültiges JPEG.');
    const directory = new Directory(Paths.cache, 'photo-validation');
    directory.create({ intermediates: true, idempotent: true });
    const file = new File(directory, `${randomUUID()}.jpg`);
    try {
      file.write(bytes);
      await modelNative.validatePhoto(file.uri);
    } finally {
      if (file.exists) file.delete();
    }
  },
};
