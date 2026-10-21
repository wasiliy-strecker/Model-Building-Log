import type { ImageSourcePropType } from 'react-native';
import { messages } from '../../core/i18n';

export type PhotoExample = {
  id: string;
  label: string;
  source(): ImageSourcePropType;
};

// Bundled examples stay separate from projects, drafts, photos and backups.
export const photoExamples: PhotoExample[] = [
  {
    id: 'aircraft',
    label: messages.photoExamples.labels.aircraft,
    source: () =>
      require('../../../assets/photo-examples/01_flugzeug_cockpit.jpg'),
  },
  {
    id: 'vehicle',
    label: messages.photoExamples.labels.vehicle,
    source: () =>
      require('../../../assets/photo-examples/02_fahrzeug_lackierung.jpg'),
  },
  {
    id: 'ship',
    label: messages.photoExamples.labels.ship,
    source: () => require('../../../assets/photo-examples/03_schiff_rumpf.jpg'),
  },
  {
    id: 'diorama',
    label: messages.photoExamples.labels.diorama,
    source: () =>
      require('../../../assets/photo-examples/04_diorama_gelaende.jpg'),
  },
];
