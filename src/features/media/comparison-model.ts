import { photoReference, type ProjectPhoto } from '../../core/domain/models';

export function toggleComparisonPhoto(
  selected: ProjectPhoto[],
  item: ProjectPhoto,
): ProjectPhoto[] {
  const key = photoReference(item);
  return selected.some((p) => photoReference(p) === key)
    ? selected.filter((p) => photoReference(p) !== key)
    : [...selected, item];
}
