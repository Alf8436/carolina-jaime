import type { APIRoute } from 'astro';
import { formEnv, isEmail, passesTurnstile, reply } from '../../lib/forms';

// Contact form → email to Carolina through Resend. Reply-To is the visitor, so she
// can answer straight from her inbox.
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const field = (k: string, max: number) => String(form.get(k) ?? '').trim().slice(0, max);
  const name = field('name', 120);
  const email = field('email', 160);
  const service = field('service', 120);
  const message = field('message', 4000);

  // Honeypot: silently accept so bots don't retry
  if (field('website', 200)) return reply(request, true);
  if (!name || !message) return reply(request, false, 'Completa tu nombre y tu mensaje.');
  if (!isEmail(email)) return reply(request, false, 'Revisa tu correo electrónico.');
  if (!(await passesTurnstile(form, request))) return reply(request, false, 'No pudimos verificar el envío. Recarga la página e intenta de nuevo.');

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = formEnv;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error('[contact] Resend is not configured');
    return reply(request, false, 'El formulario aún no está activo. Escríbeme por WhatsApp o correo, por favor.');
  }

  const rows: [string, string][] = [['Nombre', name], ['Email', email], ['Servicio', service || '—']];
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#222;line-height:1.5">
      <h2 style="color:#81608f;margin:0 0 16px">Nuevo mensaje desde la web</h2>
      <table style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b6b6b">${k}</td><td style="padding:4px 0"><strong>${escape(v)}</strong></td></tr>`).join('')}</table>
      <p style="margin:20px 0 6px;color:#6b6b6b">Mensaje</p>
      <p style="margin:0;white-space:pre-wrap">${escape(message)}</p>
    </div>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: CONTACT_TO.split(',').map((s) => s.trim()),
      reply_to: email,
      subject: `Consulta web: ${service || 'Mensaje'} · ${name}`,
      html,
      text
    })
  });
  if (!res.ok) {
    console.error('[contact] Resend error', res.status, await res.text());
    return reply(request, false, 'No se pudo enviar el mensaje. Intenta de nuevo o escríbeme por WhatsApp.');
  }
  return reply(request, true);
};
