import { useEffect, useRef } from 'react';
import { onLenisScroll, getLenis } from './LenisProvider';

const TOTAL_FRAMES = 38;
const SCROLL_HEIGHT = '300vh'; // shorter scroll = faster to get through on mobile

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const framePath = (i: number) => `/sequence/frame_${String(i + 1).padStart(3, '0')}.jpg`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);

  // Use ImageBitmap for GPU-accelerated decode — no layout/paint cost
  const bitmapsRef    = useRef<(ImageBitmap | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const frameRef      = useRef(-1);

  // ── Draw ────────────────────────────────────────────────────────────────────

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const bmp = bitmapsRef.current[index];

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (bmp) {
      const hRatio = canvas.width  / bmp.width;
      const vRatio = canvas.height / bmp.height;
      const ratio  = Math.max(hRatio, vRatio);
      const cx = (canvas.width  - bmp.width  * ratio) / 2;
      const cy = (canvas.height - bmp.height * ratio) / 2;
      ctx.drawImage(bmp, 0, 0, bmp.width, bmp.height, cx, cy, bmp.width * ratio, bmp.height * ratio);
    }
  };

  // ── Canvas setup & image loading ────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      if (frameRef.current >= 0) draw(frameRef.current);
    };
    setSize();
    window.addEventListener('resize', setSize, { passive: true });

    // Load all frames as ImageBitmap (GPU decoded, no HTML img element overhead)
    const loadFrame = async (i: number) => {
      try {
        const resp = await fetch(framePath(i));
        if (!resp.ok) return;
        const blob = await resp.blob();
        const bmp  = await createImageBitmap(blob);
        bitmapsRef.current[i] = bmp;
        // Draw frame 0 immediately so first frame shows fast
        if (i === 0 && frameRef.current === -1) {
          frameRef.current = 0;
          draw(0);
        }
      } catch {
        // ignore
      }
    };

    // Load frames 0..3 urgently first, then the rest concurrently
    const loadAll = async () => {
      await Promise.all([0, 1, 2, 3].map(loadFrame));
      const rest = Array.from({ length: TOTAL_FRAMES - 4 }, (_, k) => k + 4);
      await Promise.all(rest.map(loadFrame));
    };
    loadAll();

    return () => {
      window.removeEventListener('resize', setSize);
      // Release GPU memory
      bitmapsRef.current.forEach(bmp => bmp?.close());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Lenis scroll listener ────────────────────────────────────────────────────

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const tryAttach = () => {
      cleanup = onLenisScroll((scroll) => {
        const container = containerRef.current;
        if (!container) return;

        const top   = container.offsetTop;
        const range = container.offsetHeight - window.innerHeight;
        if (range <= 0) return;

        const p     = clamp((scroll - top) / range, 0, 1);
        // Use floor+clamp for minimal frame skipping
        const targetFrame = Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES - 1);

        // Find closest loaded frame
        let drawFrame = targetFrame;
        while (drawFrame > 0 && !bitmapsRef.current[drawFrame]) drawFrame--;

        if (drawFrame >= 0 && drawFrame !== frameRef.current) {
          frameRef.current = drawFrame;
          draw(drawFrame);
        }

        // Scroll indicator
        if (scrollIndRef.current) {
          scrollIndRef.current.style.opacity = p > 0.04 ? '0' : '1';
        }
      });
    };

    const interval = setInterval(() => {
      if (getLenis()) { clearInterval(interval); tryAttach(); }
    }, 30);

    return () => { clearInterval(interval); cleanup?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative" style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-void">

        {/* Canvas — alpha:false = ~15% faster draw */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'contents', imageRendering: 'auto' }}
        />

        {/* Subtle vignette — no text, no overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(10,10,10,0.4) 100%)' }}
        />

        {/* Scroll indicator */}
        <div
          ref={scrollIndRef}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ transition: 'opacity 0.6s', willChange: 'opacity' }}
        >
          <span className="text-ash text-[10px] md:text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 md:h-12 bg-gradient-to-b from-amber-400/60 to-transparent animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
}
