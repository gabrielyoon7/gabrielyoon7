import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import localEditor from './src/local-editor/integration.mjs';
import pocketPwa from './src/browser-writer/pwa/integration.mjs';

const REPO_NAME = 'gabrielyoon7';
const GITHUB_USERNAME = 'gabrielyoon7';
const IS_USER_SITE = false;

const base = IS_USER_SITE ? '/' : `/${REPO_NAME}`;

const site = IS_USER_SITE
  ? `https://${GITHUB_USERNAME}.github.io`
  : `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}`;

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  site,
  base,
  trailingSlash: 'always',

  integrations: [
    react(),
    mdx(),
    sitemap(),
    localEditor(),
    pocketPwa(),
  ],

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
