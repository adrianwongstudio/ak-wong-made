import { describe, it, expect } from 'vitest';
import { paginate } from './paginate';

describe('paginate', () => {
  it('returns the requested slice', () => {
    const items = [1,2,3,4,5,6,7,8,9,10];
    const p = paginate(items, 3, 2);
    expect(p.items).toEqual([4,5,6]);
    expect(p.current).toBe(2);
    expect(p.total).toBe(4);
    expect(p.prev).toBe(1);
    expect(p.next).toBe(3);
  });
  it('sets prev/next to null at edges', () => {
    const items = [1,2,3];
    expect(paginate(items, 3, 1).prev).toBeNull();
    expect(paginate(items, 3, 1).next).toBeNull();
  });
  it('clamps currentPage into [1, total]', () => {
    const items = [1,2,3,4,5];
    expect(paginate(items, 2, 99).current).toBe(3);
    expect(paginate(items, 2, 0).current).toBe(1);
  });
});
