export function paginate<T>(items: T[], perPage: number, currentPage: number) {
  const total = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.max(1, Math.min(currentPage, total));
  const start = (current - 1) * perPage;
  const slice = items.slice(start, start + perPage);
  return {
    items: slice,
    current,
    total,
    prev: current > 1 ? current - 1 : null,
    next: current < total ? current + 1 : null,
  };
}
