/** Small DOM effects ported from the standalone design (Web Animations API, no dependencies). */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const host = (): HTMLElement => (document.querySelector('.dk') as HTMLElement) || document.body;

export function burst(el: Element | null): void {
  if (!el || prefersReducedMotion()) return;
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const colors = ['#C9A25B', '#B96E42', '#68734A', '#F2E5CC'];
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('i');
    p.className = 'pt';
    p.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % 4]}`;
    host().appendChild(p);
    const a = (i / 10) * 6.28;
    const d = 34 + Math.random() * 22;
    p.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.2)`, opacity: 0 },
      ],
      { duration: 650, easing: 'ease-out' }
    ).onfinish = () => p.remove();
  }
}

/** A brass dot flies from `from` to the header cart button, which then pulses. */
export function flyToCart(from: DOMRect | null): void {
  if (!from || prefersReducedMotion()) return;
  const cart = document.querySelector('.dk .cartbtn') as HTMLElement | null;
  if (!cart) return;
  const c = cart.getBoundingClientRect();
  const x = from.left + from.width / 2;
  const y = from.top + from.height / 2;
  const dx = c.left + c.width / 2 - x;
  const dy = c.top + c.height / 2 - y;
  const d = document.createElement('i');
  d.className = 'pt';
  d.style.cssText = `left:${x - 7}px;top:${y - 7}px;width:14px;height:14px;background:#C9A25B;box-shadow:0 0 12px #C9A25B`;
  host().appendChild(d);
  d.animate(
    [
      { transform: 'translate(0,0) scale(1)' },
      { transform: `translate(${dx * 0.45}px,${dy * 0.45 - 70}px) scale(1.1)`, offset: 0.45 },
      { transform: `translate(${dx}px,${dy}px) scale(.3)`, opacity: 0.6 },
    ],
    { duration: 700, easing: 'cubic-bezier(.5,0,.3,1)' }
  ).onfinish = () => {
    d.remove();
    cart.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }],
      { duration: 320, easing: 'ease-out' }
    );
  };
}
