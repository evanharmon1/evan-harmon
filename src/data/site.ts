// site.ts — site-wide content & metadata for The Almanac.
// Edit copy/links here rather than hard-coding them into components.

export const SITE = {
  name: 'Evan Harmon',
  url: 'https://evanharmon.com',
  tagline: 'Cantankerous contraptions & philosophical piffle',
  description:
    'The personal almanac of Evan Harmon — a technologist and software engineer. Projects, writing, and ways to get in touch.',
} as const;

export type NavLink = { label: string; href: string };

export const NAV: NavLink[] = [
  { label: 'About', href: '/#about' },
  { label: 'Work', href: '/#projects' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Now', href: '/now' },
];

export type SocialName = 'GitHub' | 'LinkedIn' | 'Bluesky' | 'Mastodon' | 'omg.lol' | 'Memex';

export const SOCIALS: { name: SocialName; href: string }[] = [
  { name: 'GitHub', href: 'https://github.com/evanharmon1' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/evanharmon1' },
  { name: 'Bluesky', href: 'https://bsky.app/profile/evanharmon.com' },
  { name: 'Mastodon', href: 'https://mastodon.social/@evanharmon' },
  { name: 'omg.lol', href: 'https://evanharmon.omg.lol' },
  { name: 'Memex', href: 'https://www.evanharmon.com/memex' },
];

export type Project = { title: string; kind: string; href: string; description: string };

export const PROJECTS: Project[] = [
  {
    title: 'Sommer Lawn & Landscape',
    kind: 'Lawn Care Company',
    href: 'https://sommerlawn.com',
    description: 'A full service lawn and landscape company founded by my son Cayden.',
  },
  {
    title: 'Ponderous Development',
    kind: 'Software Company',
    href: 'https://ponderous.dev',
    description: 'A software company focused on serving small businesses in the home services industry.',
  },
  {
    title: 'Memex',
    kind: 'Digital Garden',
    href: 'https://evanharmon.com/memex',
    description:
      'I use the Obsidian markdown app for my day-to-day notes as a PKM/zettelkasten and share them here as a so-called ‘digital garden’.',
  },
  {
    title: 'KC Tech Enthusiasts',
    kind: 'Meetup · Community',
    href: 'https://kctechenthusiasts.com',
    description:
      'A friendly, casual meetup connecting tech enthusiasts, developers, designers, innovators, and curious minds.',
  },
  {
    title: 'Harmon Init',
    kind: 'Template · CI/CD',
    href: 'https://github.com/evanharmon1/harmon-init',
    description:
      'New project template to help bootstrap and streamline projects with pre-configured CI/CD, security tests, lefthook, linting, docs, task runner, etc.',
  },
  {
    title: 'Harmon Ops',
    kind: 'Infrastructure · Homelab',
    href: 'https://github.com/evanharmon1/harmon-ops',
    description:
      'Various scripts, dotfiles, automation, DevOps, and IaC for my developer environment and homelab infrastructure.',
  },
];

export const BIO =
  'I’m a technologist and software engineer with experience in DevOps, web development, AI, cloud engineering, technical education, and project management in industries including healthcare, finance, and logistics. I have recently decided to apply my technical expertise toward entrepreneurial endeavors and consulting. I am loving the highly diverse process of building and growing a business.';

export type RegisterEntry = { k: string; v: string };

export const REGISTER: RegisterEntry[] = [
  { k: 'Contraptions devised', v: '132K' },
  { k: 'Bits, dutifully shuffled', v: '24.8K' },
  { k: 'Qualia, experienced', v: '10.3K' },
  { k: 'Persons left simply delighted', v: '48.4K' },
];

export const MEET_URL = 'https://fantastical.app/evanharmon';
