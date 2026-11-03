// The contact form: posted with fetch so the page stays put, with the
// answer shown under the form. Without JS they still post and the API redirects back.
const MESSAGES: Record<string, { sending: string; ok: string }> = {
  contact: { sending: 'Enviando…', ok: '¡Gracias! Tu mensaje fue enviado, te responderé pronto.' }
};

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  const kind = form.dataset.form!;
  const status = (form.querySelector('[data-status]') ?? form.parentElement?.querySelector('[data-status]')) as HTMLElement | null;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const say = (text: string, error = false) => {
      if (!status) return;
      status.textContent = text;
      status.classList.toggle('is-error', error);
    };
    button.disabled = true;
    say(MESSAGES[kind].sending);
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { accept: 'application/json' } });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'No se pudo enviar. Intenta de nuevo en un momento.');
      say(MESSAGES[kind].ok);
      form.reset();
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
    } catch (err) {
      say(err instanceof Error ? err.message : 'No se pudo enviar.', true);
    } finally {
      button.disabled = false;
    }
  });
});
