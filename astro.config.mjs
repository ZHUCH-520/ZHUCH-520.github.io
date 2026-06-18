// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import { defineConfig } from 'astro/config';

const enableKeystatic = process.env.NODE_ENV === 'development' && process.env.SKIP_KEYSTATIC !== 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://zhuch-520.github.io',
  output: 'static',
  integrations: [mdx(), react(), ...(enableKeystatic ? [keystatic()] : []), sitemap()],
});
