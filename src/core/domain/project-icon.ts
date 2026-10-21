// Stable IDs are stored in project JSON and encrypted backups.
// An absent icon keeps automatic selection based on the model type.
export const projectIconIds = [
  'aircraft',
  'vehicle',
  'ship',
  'figure',
  'diorama',
  'train',
  'rocket',
  'tools',
] as const;

export type ProjectIconId = (typeof projectIconIds)[number];
