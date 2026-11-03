// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Canonical address, used for canonical / og:url. Change it if the domain changes.
export const SITE_URL = 'https://carolinajaime.com';

// Rendered per request on Cloudflare Workers, so whatever is published in Sanity
// shows up on the next visit without a redeploy (`npm run deploy`).
export default defineConfig({
  site: SITE_URL,
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  // No sessions: without this the adapter asks for a KV namespace
  session: false,
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  // Old WordPress addresses → their place on the new site (301)
  redirects: {
    '/inicio': '/',
    '/sample-page': '/',
    '/testimonios': '/',
    '/servicios3': '/servicios',
    '/terapias': '/servicios',
    '/talleres3': '/talleres',
    '/contacto-2': '/contacto',
    '/tienda': '/',
    '/carrito': '/',
    '/finalizar-compra': '/',
    '/mi-cuenta': '/',
    '/2023/02/tema-1': '/blog/tema-1',
    '/category/[slug]': '/blog/categoria/[slug]',
    '/author/[slug]': '/sobre-mi'
  }
});
