import type { Copy } from '../i18n/i18n';

export interface TimelineEntry {
  period: string;
  title: string;
  place: string;
  description?: string;
  highlights?: string[];
}

export const HERBST_UI = {
  site: 'https://ui.kauanherbst.dev',
  repo: 'https://github.com/KauanHerbst/herbst-ui',
};

export const SECTIONS = [
  'sobre',
  'experiencia',
  'formacao',
  'projetos',
  'skills',
  'contato',
] as const;
export type SectionId = (typeof SECTIONS)[number];

export type ProjectId = keyof Copy['projects']['items'];

export interface Project {
  id: ProjectId;
  stack: string[];

  image?: string;

  url?: string;

  repos?: { label?: string; href: string }[];

  team?: boolean;
}

export interface TechGroup {
  id: keyof Copy['skills']['groups'];
  items: string[];
}

export interface SocialIcon {
  label: keyof Copy['profile']['hints'];
  href: string;

  icon: string;

  handle: string;
}

export interface Profile {
  name: string;
  email: string;
  city: string;
  lat: number;
  lng: number;

  social: SocialIcon[];
}

export const PROFILE: Profile = {
  name: 'Kauan Herbst',
  email: 'kauanherbst7@gmail.com',
  city: 'Imperatriz, MA',
  lat: -5.5264,
  lng: -47.4917,
  social: [
    {
      label: 'GitHub',
      href: 'https://github.com/KauanHerbst',
      icon: 'phosphorGithubLogo',
      handle: '@KauanHerbst',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/kauanherbst',
      icon: 'phosphorLinkedinLogo',
      handle: 'in/kauanherbst',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/kauanherbst_/',
      icon: 'phosphorInstagramLogo',
      handle: '@kauanherbst_',
    },
  ],
};

export const CV = [
  {
    label: 'Português',
    lang: 'pt-BR',
    href: 'cv/kauan-herbst-curriculo-pt.pdf',
    file: 'Curriculo Kauan Herbst.pdf',
  },
  {
    label: 'English',
    lang: 'en',
    href: 'cv/kauan-herbst-resume-en.pdf',
    file: 'Kauan Herbst Resume.pdf',
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'herbst-ui',
    stack: ['Angular', 'TypeScript', 'Tailwind v4', 'CLI', 'Open source'],
    url: HERBST_UI.site,
    repos: [{ href: HERBST_UI.repo }],
    image: 'art/herbst-ui.png',
  },
  {
    id: 'literium',
    stack: ['React', 'Sass', 'Spring Boot', 'Spring Security', 'PostgreSQL', 'Docker'],
    url: 'https://literium.vercel.app',
    repos: [
      { label: 'Front-end', href: 'https://github.com/KauanHerbst/React-Literium-Project' },
      { label: 'Back-end', href: 'https://github.com/KauanHerbst/SpringBoot-Literium-Project' },
    ],
    image: 'art/projects/literium.png',
  },
  {
    id: 'vortex',
    stack: ['Next.js', 'TypeScript', 'Spring Boot', 'WebSocket', 'MySQL', 'Flyway'],
    url: 'https://vortex-bank.vercel.app',
    repos: [
      { label: 'Front-end', href: 'https://github.com/KauanHerbst/NextJs-Vortex-Bank-Project' },
      { label: 'Back-end', href: 'https://github.com/KauanHerbst/SpringBoot-Vortex-Bank-Project' },
    ],
    image: 'art/projects/vortex.png',
  },
  {
    id: 'trips',
    stack: ['Angular', 'TypeScript', 'Angular standalone'],
    url: 'https://santander-coders-angular-i.vercel.app',
    repos: [{ href: 'https://github.com/NullRodiException/Santander-Coders-Angular-I' }],
    image: 'art/projects/trips.png',
    team: true,
  },
  {
    id: 'ecommerce',
    stack: ['TypeScript', 'Vite', 'Tailwind CSS', 'Axios'],
    repos: [{ href: 'https://github.com/KauanHerbst/Santander-Coders-e-Commerce' }],
    image: 'art/projects/ecommerce.png',
    team: true,
  },
];

export const TECH_GROUPS: TechGroup[] = [
  { id: 'languages', items: ['PHP', 'TypeScript', 'JavaScript', 'Java', 'Python', 'R', 'SQL'] },
  { id: 'backend', items: ['Laravel', 'NestJS', 'Express.js', 'Node.js', 'Spring Boot'] },
  {
    id: 'frontend',
    items: [
      'React',
      'Angular',
      'Next.js',
      'Tailwind CSS',
      'Vite',
      'TanStack Query',
      'Zustand',
      'Zod',
      'Radix',
    ],
  },
  { id: 'data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase'] },
  { id: 'devops', items: ['Docker', 'Git', 'GitHub Actions', 'AWS', 'Sentry'] },
  { id: 'tests', items: ['Pest', 'Vitest', 'Playwright', 'Jest', 'JUnit', 'Testing Library'] },
];

export const TECH_LOGOS: Record<string, string> = {
  PHP: 'art/tech/php.png',
  TypeScript: 'art/tech/typescript.png',
  JavaScript: 'art/tech/javascript.png',
  Java: 'art/tech/openjdk.png',
  SQL: 'art/tech/sql.png',
  Python: 'art/tech/python.png',
  R: 'art/tech/r.png',
  Laravel: 'art/tech/laravel.png',
  NestJS: 'art/tech/nestjs.png',
  'Express.js': 'art/tech/express.png',
  'Node.js': 'art/tech/nodedotjs.png',
  'Spring Boot': 'art/tech/springboot.png',
  React: 'art/tech/react.png',
  Angular: 'art/tech/angular.png',
  'Next.js': 'art/tech/nextdotjs.png',
  'Tailwind CSS': 'art/tech/tailwindcss.png',
  Vite: 'art/tech/vite.png',
  PostgreSQL: 'art/tech/postgresql.png',
  MySQL: 'art/tech/mysql.png',
  MongoDB: 'art/tech/mongodb.png',
  Redis: 'art/tech/redis.png',
  Docker: 'art/tech/docker.png',
  Git: 'art/tech/git.png',
};
