import { defineMiddleware } from 'astro:middleware';

// www.carolinajaime.com → carolinajaime.com (301), so the site has one address.
export const onRequest = defineMiddleware(({ url }, next) => {
  if (url.hostname.startsWith('www.')) {
    const target = new URL(url);
    target.hostname = url.hostname.slice(4);
    // Mutable headers (Response.redirect's are immutable and Astro may append to them)
    return new Response(null, { status: 301, headers: { Location: target.href } });
  }
  return next();
});
