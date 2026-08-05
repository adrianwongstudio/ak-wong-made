export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  project: string;
  services: ('AI Automation' | 'Website' | 'Web App')[];
};

export const gallery: GalleryItem[] = [
  { src: '/gallery/placeholder-1.svg', alt: 'Shaolin homepage hero',       caption: 'Shaolin Hung Gar — Home',    project: 'Shaolin',   services: ['Website'] },
  { src: '/gallery/placeholder-2.svg', alt: 'Shaolin gallery grid',         caption: 'Shaolin Hung Gar — Gallery', project: 'Shaolin',   services: ['Website'] },
  { src: '/gallery/placeholder-3.svg', alt: 'Invoice automation dashboard', caption: 'Invoice → Receipt',           project: 'Invoicing', services: ['AI Automation'] },
  { src: '/gallery/placeholder-4.svg', alt: 'Financial planning tool',      caption: 'Legacy Financial Planning',   project: 'Legacy',    services: ['Web App'] },
  { src: '/gallery/placeholder-5.svg', alt: 'Booking form flow',            caption: 'Booking Form',                project: 'Shaolin',   services: ['Website'] },
  { src: '/gallery/placeholder-6.svg', alt: 'Agent orchestration',          caption: 'Agent Orchestration',         project: 'Agents',    services: ['AI Automation'] },
];
