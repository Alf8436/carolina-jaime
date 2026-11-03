import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './forms';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Reveal: [data-reveal] rises in as it enters, siblings in a short stagger ----------
const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
if (reduced) {
  gsap.set(items, { opacity: 1, y: 0 });
} else {
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true })
  });
}

// ---------- Leaves (Figma "Hojas" layers) ----------
// Floating ones drift against the scroll and sway a little; the blurred
// background ones move slower, so the two layers read at different depths.
if (!reduced) {
  gsap.utils.toArray<HTMLElement>('[data-leaf]').forEach((leaf) => {
    const floating = leaf.dataset.leaf === 'float';
    gsap.fromTo(leaf,
      { y: floating ? 60 : 30 },
      {
        y: floating ? -60 : -30,
        rotation: `+=${floating ? 8 : 3}`,
        ease: 'none',
        scrollTrigger: { trigger: leaf, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    if (floating) gsap.from(leaf, { opacity: 0, scale: 0.85, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: leaf, start: 'top 95%', once: true } });
  });
}

// ---------- Phone sliders: dots follow the card in view; the steps light it up ----------
document.querySelectorAll<HTMLElement>('[data-slider]').forEach((track) => {
  const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'));
  const dots = track.parentElement?.querySelector('[data-dots]')?.children;
  const setActive = (index: number) => {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    if (dots) Array.from(dots).forEach((d, i) => d.classList.toggle('is-active', i === index));
  };
  setActive(0);
  let frame = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const left = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).scrollPaddingInlineStart || '0');
      let best = 0;
      let bestDistance = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.getBoundingClientRect().left - left);
        if (d < bestDistance) { bestDistance = d; best = i; }
      });
      // At the end of the row the last card can't reach the left edge
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = slides.length - 1;
      setActive(best);
    });
  }, { passive: true });
});
