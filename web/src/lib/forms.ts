import { env } from 'cloudflare:workers';

// Secrets live in the Worker (`wrangler secret put …`) and in .dev.vars locally.
export interface FormEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;          // psicologa@carolinajaime.com
  CONTACT_FROM?: string;        // "Web Carolina Jaime <web@envio.carolinajaime.com>"
  TURNSTILE_SECRET_KEY?: string;
}
export const formEnv = env as unknown as FormEnv;

const wantsJson = (request: Request) => (request.headers.get('accept') ?? '').includes('application/json');

// fetch() from the page gets JSON; a plain form post (no JS) goes back to the page
export function reply(request: Request, ok: boolean, error?: string) {
  if (wantsJson(request)) return Response.json(ok ? { ok } : { ok, error }, { status: ok ? 200 : 400 });
  const back = new URL(request.headers.get('referer') ?? '/', request.url);
  back.searchParams.set(ok ? 'enviado' : 'error', '1');
  return Response.redirect(back.href, 303);
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 160;

// Cloudflare Turnstile, only when a secret is configured
export async function passesTurnstile(form: FormData, request: Request) {
  if (!formEnv.TURNSTILE_SECRET_KEY) return true;
  const token = form.get('cf-turnstile-response');
  if (typeof token !== 'string' || !token) return false;
  const body = new FormData();
  body.set('secret', formEnv.TURNSTILE_SECRET_KEY);
  body.set('response', token);
  const ip = request.headers.get('cf-connecting-ip');
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
