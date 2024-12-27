import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'About',
      href: '/about',
    },
    {
      text: 'Contact',
      href: '/contact',
    },
    {
      text: 'Meet',
      href: 'https://fantastical.app/evanharmon',
    },
    {
      text: 'Now',
      href: '/now',
    },
    {
      text: 'Blog',
      links: [
        {
          text: 'Blog',
          href: getBlogPermalink(),
        },
        {
          text: 'DevOps Articles',
          href: getPermalink('devops', 'tag'),
        },
      ],
    },
  ],
};

export const footerData = {
  links: [],
  secondaryLinks: [
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
    { text: 'Meet', href: '/meet' },
    { text: 'Blog', href: '/blog' },
    { text: 'Now', href: '/now' },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/evanharmon1' },
    { ariaLabel: 'Mastodon', icon: 'tabler:brand-mastodon', href: 'https://mastodon.social/@evanharmon' },
    { ariaLabel: 'BlueSky', icon: 'tabler:brand-bluesky', href: 'https://bsky.app/profile/evanharmon.bsky.social' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/evanharmon1' },
    { ariaLabel: 'omg.lol', icon: 'tabler:heart-handshake', href: 'https://evanharmon.omg.lol' },
    { ariaLabel: 'Meetup', icon: 'tabler:brand-meetup', href: 'https://www.meetup.com/kctechbookclub/' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    Based on theme by <a class="text-blue-600 underline dark:text-muted" href="https://onwidget.com/"> OnWidget</a>
  `,
};
