// Inline emphasis for headlines and short copy edited in Sanity:
//   *texto*  → <em>  (Abril Fatface in purple)
//   _texto_  → <strong> (Abril Fatface, or bold Montserrat in body copy)
// Everything else is escaped, so editors can't inject markup.
const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function rich(s = ''): string {
  return escape(s)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1<strong>$2</strong>');
}

// The same copy without the emphasis marks, for meta descriptions
export const plain = (s = '') => s.replace(/\*([^*]+)\*/g, '$1').replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1$2');

// Plain text with blank lines between paragraphs → paragraphs
export const paragraphs = (s = '') =>
  s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// "febrero 10, 2023", as in the design
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export const waLink = (number: string, message?: string) =>
  `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
