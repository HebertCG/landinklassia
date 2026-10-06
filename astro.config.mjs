import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://klassia.lat',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [
    sitemap({
      namespaces: {
        news: false,
        video: false,
        image: false,
        xhtml: false
      }
    })
  ],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: 'lightningcss'
    }
  }
});
