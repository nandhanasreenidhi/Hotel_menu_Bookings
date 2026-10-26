import { useEffect, useRef, useState } from 'react';

/** One-shot reveal: returns [ref, seen]. `seen` flips true (after optional delay) the first time the element intersects. */
export function useInView<T extends Element>(threshold = 0.12, delayMs = 0): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  // Browsers without IntersectionObserver just show everything immediately.
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          timer = setTimeout(() => setSeen(true), delayMs);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [threshold, delayMs]);

  return [ref, seen];
}
