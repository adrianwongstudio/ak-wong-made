import { describe, it, expect } from 'vitest';
import { filterByType } from './filter';

type P = { title: string; services: string[] };
const items: P[] = [
  { title: 'A', services: ['AI Automation'] },
  { title: 'B', services: ['Website'] },
  { title: 'C', services: ['Website', 'AI Automation'] },
];

describe('filterByType', () => {
  it('returns all items when selectedType is null', () => {
    expect(filterByType(items, i => i.services, null)).toHaveLength(3);
  });
  it('returns items whose key array includes the type', () => {
    const r = filterByType(items, i => i.services, 'AI Automation');
    expect(r.map(i => i.title)).toEqual(['A', 'C']);
  });
  it('returns empty when nothing matches', () => {
    expect(filterByType(items, i => i.services, 'Nope')).toEqual([]);
  });
});
