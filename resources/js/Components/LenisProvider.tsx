import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

// Callbacks that other components can register to receive scroll events
// directly inside the Lenis RAF tick (zero extra latency)
type ScrollCb = (scroll: number, limit: number) => void;
const scrollCallbacks = new Set<ScrollCb>();

export function onLenisScroll(cb: ScrollCb): () => void {
  scrollCallbacks.add(cb);
  return () => scrollCallbacks.delete(cb);
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Always start at top — never restore scroll position
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      // Faster, more responsive for mobile scroll-linked animations
      duration:        0.45,
      easing:          (t: number) => 1 - Math.pow(1 - t, 4), // ease-out quart — snappier
      orientation:     'vertical',
      smoothWheel:     true,
      touchMultiplier: 1.5,  // reduced to avoid over-shooting on mobile
      wheelMultiplier: 1.0,  // 1:1 wheel feel
    });

    lenisInstance = lenis;

    // Broadcast scroll to all registered components inside the RAF tick
    lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      scrollCallbacks.forEach(cb => cb(scroll, limit));
    });

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
