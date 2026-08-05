export function filterByType<T>(
  items: T[],
  keyFn: (item: T) => string[],
  selectedType: string | null,
): T[] {
  if (!selectedType) return items;
  return items.filter(i => keyFn(i).includes(selectedType));
}
