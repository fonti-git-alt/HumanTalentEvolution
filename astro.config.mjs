import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  integrations: [tailwind()],
  output: "hybrid",

  build: {
    assets: '_assets'
  },

  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild'
    }
  },

  adapter: cloudflare()
});