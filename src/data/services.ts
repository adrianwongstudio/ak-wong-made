export type Service = {
  num: string;
  title: string;
  body: string;
  recently: string;
};

export const services: Service[] = [
  {
    num: '/ 01',
    title: 'AI Automation',
    body: "Custom agents and pipelines that remove repetitive work — invoicing, triage, reporting, research. Wired into the tools you already use.",
    recently: 'Recently: cut a 6-hour invoicing loop to under 4 minutes.',
  },
  {
    num: '/ 02',
    title: 'Small-Business Websites',
    body: "Fast, editable marketing sites for schools, studios, and service businesses. Free hosting, CMS, forms — costs the client $0/month to run.",
    recently: 'Recently: Shaolin Hung Gar — school & lion dance troupe.',
  },
  {
    num: '/ 03',
    title: 'Web Apps',
    body: "Custom internal tools and small SaaS-style products. Built to be understood — no opaque frameworks, no lock-in.",
    recently: 'Recently: financial-planning tool for a family office.',
  },
];
