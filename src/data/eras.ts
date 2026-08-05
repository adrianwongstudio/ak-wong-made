export type Era = {
  key: 'Studio Life' | 'Corporate Years' | 'University' | 'Growing Up';
  years: string;
  slug: string;
};

export const eras: Era[] = [
  { key: 'Studio Life',     years: '2023 →',    slug: 'studio-life' },
  { key: 'Corporate Years', years: '2016–2022', slug: 'corporate-years' },
  { key: 'University',      years: '2012–2016', slug: 'university' },
  { key: 'Growing Up',      years: '1994–2012', slug: 'growing-up' },
];
