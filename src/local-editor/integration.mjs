import { fileURLToPath } from 'node:url';

export default function localEditor() {
  return {
    name: 'local-editor',
    hooks: {
      'astro:config:setup': ({ command, config, injectRoute, updateConfig }) => {
        if (command !== 'dev') return;
        // Keep development React transforms separate from astro check/build caches.
        updateConfig({ vite: {
          cacheDir: fileURLToPath(new URL('.astro/editor-vite/', config.root)),
        } });
        injectRoute({
          pattern: '/editor/',
          entrypoint: fileURLToPath(new URL('./page.astro', import.meta.url)),
        });
        // Register alongside the page, rather than relying on Vite middleware order.
        injectRoute({
          pattern: '/__local-editor/posts/',
          entrypoint: fileURLToPath(new URL('./endpoint.ts', import.meta.url)),
          prerender: false,
        });
      },
    },
  };
}
