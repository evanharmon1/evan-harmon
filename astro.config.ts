import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import { readingTimeRemarkPlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The Almanac — Astro + Tailwind CSS v4 (CSS-first, via the Vite plugin).
// There is NO @astrojs/tailwind integration in v4; `@import "tailwindcss"`
// lives in src/styles/globals.css, imported once from the base layout.
export default defineConfig({
  site: 'https://evanharmon.com',
  output: 'static',

  integrations: [sitemap(), mdx(), react()],

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
