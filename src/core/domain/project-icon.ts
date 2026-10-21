// Stable IDs are stored in project JSON and encrypted backups.
// Older projects and backups may omit the icon. Resolve it from their model type.
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
