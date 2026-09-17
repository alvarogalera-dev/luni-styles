import { useEffect, useRef } from 'react';
import { onLenisScroll, getLenis } from './LenisProvider';

const TOTAL_FRAMES = 38;
const SCROLL_HEIGHT = '300vh';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const framePath = (i: number) => `/sequence/frame_${String(i + 1).padStart(3, '0')}.jpg`;

export default function SequenceScroll() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const scrollIndRef  = useRef<HTMLDivElement>(null);

  // GPU-decoded bitmaps, frame state, smooth progress
  const bitmapsRef    = useRef<(ImageBitmap | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const drawnFrameRef = useRef(-1);
  const targetPRef    = useRef(0);   // raw scroll progress [0,1]
  const currentPRef   = useRef(0);   // smoothed progress
  const rafRef        = useRef<number | null>(null);
  const canvasCtxRef  = useRef<CanvasRenderingContext2D | null>(null);

  // ── Draw ────────────────────────────────────────────────────────────────────

  const drawBitmap = (bmp: ImageBitmap, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const hRatio = canvas.width  / bmp.width;
    const vRatio = canvas.height / bmp.height;
    const ratio  = Math.max(hRatio, vRatio);
    const cx = (canvas.width  - bmp.width  * ratio) / 2;
    const cy = (canvas.height - bmp.height * ratio) / 2;
    ctx.drawImage(bmp, 0, 0, bmp.width, bmp.height, cx, cy, bmp.width * ratio, bmp.height * ratio);
  };

  // ── RAF loop — smooth interpolation ─────────────────────────────────────────

  const startLoop = () => {
    const canvas = canvasRef.current;
    const ctx    = canvasCtxRef.current;
    if (!canvas || !ctx) return;

    const loop = () => {
      // Lerp current progress towards target — tweak 0.18 for feel
      const diff = targetPRef.current - currentPRef.current;
      if (Math.abs(diff) > 0.0002) {
        currentPRef.current += diff * 0.18;
      } else {
        currentPRef.current = targetPRef.current;
      }

      const p          = currentPRef.current;
      const frameIndex = Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES - 1);

      if (frameIndex !== drawnFrameRef.current) {
        // Find the nearest loaded frame at or below target
        let f = frameIndex;
        while (f > 0 && !bitmapsRef.current[f]) f--;
        if (f >= 0 && bitmapsRef.current[f] && f !== drawnFrameRef.current) {
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawBitmap(bitmapsRef.current[f]!, canvas, ctx);
          drawnFrameRef.current = f;
        }
      }

      // Scroll indicator fade
      if (scrollIndRef.current) {
        scrollIndRef.current.style.opacity = p > 0.04 ? '0' : '1';
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  // ── Canvas setup & frame loading ─────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })!;
    canvasCtxRef.current = ctx;

    const setSize = () => {
      canvas.width  = window.innerWidth  * (window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, 2) : 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, 2) : 1);
      canvas.style.width  = '100%';
      canvas.style.height = '100%';
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (drawnFrameRef.current >= 0 && bitmapsRef.current[drawnFrameRef.current]) {
        drawBitmap(bitmapsRef.current[drawnFrameRef.current]!, canvas, ctx);
      }
    };
    setSize();
    window.addEventListener('resize', setSize, { passive: true });

    // Load frame 0 first, then ALL others fully concurrent — fastest possible
    const loadFrame = async (i: number): Promise<void> => {
      try {
        const resp = await fetch(framePath(i));
        if (!resp.ok) return;
        const blob = await resp.blob();
        const bmp  = await createImageBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
        bitmapsRef.current[i] = bmp;
        if (i === 0 && drawnFrameRef.current === -1) {
          drawnFrameRef.current = 0;
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawBitmap(bmp, canvas, ctx);
        }
      } catch { /* ignore */ }
    };

    const loadAll = async () => {
      // Frame 0 first, then all frames truly parallel
      await loadFrame(0);
      await Promise.all(Array.from({ length: TOTAL_FRAMES - 1 }, (_, k) => loadFrame(k + 1)));
    };
    loadAll();

    startLoop();

    return () => {
      window.removeEventListener('resize', setSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      bitmapsRef.current.forEach(bmp => bmp?.close());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Lenis scroll → just update targetP, let RAF loop do the rest ────────────

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const tryAttach = () => {
      cleanup = onLenisScroll((scroll) => {
        const container = containerRef.current;
        if (!container) return;
        const top   = container.offsetTop;
        const range = container.offsetHeight - window.innerHeight;
        if (range <= 0) return;
        targetPRef.current = clamp((scroll - top) / range, 0, 1);
      });
    };

    const interval = setInterval(() => {
      if (getLenis()) { clearInterval(interval); tryAttach(); }
    }, 30);

    return () => { clearInterval(interval); cleanup?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-void">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'contents' }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(10,10,10,0.35) 100%)' }}
        />
        {/* Scroll indicator */}
        <div
          ref={scrollIndRef}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ transition: 'opacity 0.8s', willChange: 'opacity' }}
        >
          <span className="text-ash text-[10px] md:text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 md:h-12 bg-gradient-to-b from-amber-400/60 to-transparent animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
}
