import type { APIRoute } from 'astro';
import { formEnv, isEmail, reply } from '../../lib/forms';

// Newsletter → MailerLite subscriber in the newsletter group. Double opt-in, if
// wanted, is switched on in MailerLite (Account settings › Subscribe settings).
export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();

  if (String(form.get('website') ?? '')) return reply(request, true);
  if (!isEmail(email)) return reply(request, false, 'Revisa tu correo electrónico.');

  const { MAILERLITE_API_KEY, MAILERLITE_GROUP_ID } = formEnv;
  if (!MAILERLITE_API_KEY) {
    console.error('[newsletter] MailerLite is not configured');
    return reply(request, false, 'La suscripción aún no está activa. ¡Vuelve pronto!');
  }

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${MAILERLITE_API_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, ...(MAILERLITE_GROUP_ID ? { groups: [MAILERLITE_GROUP_ID] } : {}) })
  });
  if (!res.ok) {
    console.error('[newsletter] MailerLite error', res.status, await res.text());
    return reply(request, false, 'No se pudo completar la suscripción. Intenta de nuevo en un momento.');
  }
  return reply(request, true);
};
