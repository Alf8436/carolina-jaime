# carolinajaime.com

Sitio de la psicóloga Carolina Jaime: Astro en Cloudflare Workers, contenido en Sanity.
Diseño: [Figma · Sitio – Propuesta C](https://www.figma.com/design/Jel3WAcCX1G2gqsHRypV4s/).

```
web/      Astro (SSR en Cloudflare Workers): páginas, componentes, formularios
studio/   Sanity Studio (donde se edita el contenido)
respaldo-wp/  copia de los medios del WordPress anterior (no va a git)
```

Se requiere Node.js 22.12.0 o superior. Con `nvm`, entra en cada carpeta (`web/` o
`studio/`) y ejecuta `nvm use`; instala dependencias con `npm ci` para respetar el lockfile.

## Web

```sh
cd web
npm ci
npm run dev       # http://localhost:4321
npm run check     # validación Astro y TypeScript
npm run build
npm run preview   # build + runtime real de Workers (wrangler dev)
npm run deploy    # build + wrangler deploy
```

Cada visita lee Sanity (API CDN), así que publicar en el Studio no requiere desplegar.
Sin `PUBLIC_SANITY_PROJECT_ID` el sitio muestra el contenido de respaldo de
`src/lib/content.ts` (los textos del Figma con las fotos de `public/img`).

### Variables

Públicas, en `web/.env` (se fijan al compilar):

| Variable | Para qué |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | Proyecto de Sanity |
| `PUBLIC_TURNSTILE_SITE_KEY` | Antispam del formulario de contacto (opcional) |

Secretas, con `npx wrangler secret put NOMBRE` (y en `web/.dev.vars` para probar en local):

| Variable | Para qué |
|---|---|
| `RESEND_API_KEY` | Envío del formulario de contacto |
| `CONTACT_TO` | `psicologa@carolinajaime.com` |
| `CONTACT_FROM` | p. ej. `Web Carolina Jaime <web@envio.carolinajaime.com>` (dominio verificado en Resend) |
| `TURNSTILE_SECRET_KEY` | Antispam (pareja de `PUBLIC_TURNSTILE_SITE_KEY`) |

Sin estas claves los formularios responden con un aviso amable en vez de fallar.

### Redirecciones del WordPress

En `web/astro.config.mjs` (`redirects`): páginas duplicadas, tienda, categorías y el
artículo antiguo apuntan a su lugar nuevo con 301.

## Studio

```sh
cd studio
npm ci
npm run dev       # http://localhost:3333
npm run check     # TypeScript y ESLint
npm run build
npm run deploy    # https://carolina-jaime.sanity.studio
```

El id del proyecto está en `studio/project.ts`.

## Correo

El correo (`psicologa@carolinajaime.com`, Professional Email de GoDaddy) no depende del
sitio. Al mover el DNS a Cloudflare hay que copiar sus registros MX, SPF, DKIM, DMARC,
`email` y `_autodiscover` con la nube gris (solo DNS).
