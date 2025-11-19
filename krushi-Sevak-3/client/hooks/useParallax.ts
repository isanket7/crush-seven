import { useEffect, useRef } from "react";

export function useParallax<T extends HTMLElement>(speed = 0.15) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined") return;

    let frame = 0;

    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const offset = rect.top + rect.height * 0.5 - window.innerHeight * 0.5;
      const translate = -offset * speed;
      ref.current.style.transform = `translate3d(0, ${translate}px, 0)`;
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  return ref;
}
