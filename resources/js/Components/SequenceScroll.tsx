import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { onLenisScroll, getLenis } from './LenisProvider';

const TOTAL_FRAMES = 40;
const SCROLL_HEIGHT = '400vh';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const framePath = (i: number) => `/sequence/frame_${String(i + 1).padStart(3, '0')}.jpg`;

// ─── Magnetic CTA ─────────────────────────────────────────────────────────────

function MagneticButton() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform =
      `translate(${(e.clientX - r.left - r.width  / 2) * 0.35}px,
                 ${(e.clientY - r.top  - r.height / 2) * 0.35}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ display: 'inline-block', transition: 'transform 0.45s cubic-bezier(0.76,0,0.24,1)' }}>
      <Link href="/reservas"
        className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#cd7f32,#e8a87c)', boxShadow: '0 0 50px rgba(205,127,50,0.45)' }}>
        <span className="relative z-10 text-void font-display font-bold text-sm tracking-widest uppercase">
          Reservar Ahora
        </span>
        <span className="relative z-10 text-void text-lg">→</span>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg,#e8a87c,#cd7f32)' }} />
      </Link>
    </div>
  );
}

// ─── Text overlay definitions ─────────────────────────────────────────────────

interface Layer {
  start:   number;
  end:     number;
  align:   'left' | 'center' | 'right';
  content: React.ReactNode;
}

const LAYERS: Layer[] = [
  {
    start: 0, end: 0.2, align: 'center',
    content: (
      <div className="text-center select-none">
        <p className="text-copper-400 text-xs tracking-ultra uppercase mb-6 font-medium">Est. 2015</p>
        <h1 className="font-display font-black text-7xl md:text-9xl lg:text-10xl tracking-tightest leading-none text-bone mb-6">
          LUNI<br /><span className="text-shimmer">STYLES</span>
        </h1>
        <p className="text-ash text-lg md:text-xl tracking-widest uppercase font-light">
          Precision.&nbsp;&nbsp;Power.&nbsp;&nbsp;Style.
        </p>
      </div>
    ),
  },
  {
    start: 0.25, end: 0.5, align: 'left',
    content: (
      <div className="max-w-lg select-none">
        <p className="text-copper-400 text-xs tracking-ultra uppercase mb-4">El Arte</p>
        <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none text-bone">
          Dominando el oficio hasta el último detalle.
        </h2>
      </div>
    ),
  },
  {
    start: 0.55, end: 0.8, align: 'right',
    content: (
      <div className="max-w-lg text-right select-none">
        <p className="text-copper-400 text-xs tracking-ultra uppercase mb-4">La Tecnología</p>
        <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none text-bone">
          Tecnología avanzada de grooming.
        </h2>
      </div>
    ),
  },
  {
    start: 0.85, end: 1.0, align: 'center',
    content: (
      <div className="text-center select-none">
        <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none text-bone mb-10">
          Siente la diferencia.
        </h2>
        <MagneticButton />
      </div>
    ),
  },
];

// ─── Overlay DOM manager (zero React state) ───────────────────────────────────

function Overlays({ refs }: { refs: React.MutableRefObject<(HTMLDivElement | null)[]> }) {
  return (
    <>
      {LAYERS.map((layer, i) => {
        const align =
          layer.align === 'left'  ? 'items-start px-8 md:px-20' :
          layer.align === 'right' ? 'items-end   px-8 md:px-20' :
                                    'items-center px-8 md:px-20';
        return (
          <div
            key={i}
            ref={el => { refs.current[i] = el; }}
            className={`absolute inset-0 flex flex-col justify-center ${align}`}
            style={{
              opacity:      0,
              transform:    'translateY(20px)',
              willChange:   'opacity, transform',
              // pointer events: active only on the CTA slide
              pointerEvents: layer.start >= 0.85 ? 'auto' : 'none',
            }}
          >
            {layer.content}
          </div>
        );
      })}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);
  const overlayRefs  = useRef<(HTMLDivElement | null)[]>([]);

  // All mutable animation state lives in refs — zero React re-renders
  const bitmapsRef    = useRef<(ImageBitmap | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const frameRef      = useRef(-1);   // last drawn frame (-1 = nothing drawn yet)
  const progressRef   = useRef(0);
  // Pre-computed draw geometry (set once after first frame loads)
  const drawGeoRef    = useRef<{ dx: number; dy: number } | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Draw a single pre-scaled bitmap.
   * All bitmaps are already scaled to cover the canvas — draw is a fast
   * pixel blit with a simple offset, no per-frame scaling math.
   */
  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const bmp = bitmapsRef.current[index];
    const geo = drawGeoRef.current;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (bmp && geo) {
      ctx.drawImage(bmp, geo.dx, geo.dy);   // ← no scaling arg = fastest path
    }
  };

  /**
   * Update all overlay opacities/transforms via direct DOM mutation.
   * Called inside the Lenis RAF tick — no React involvement.
   */
  const updateOverlays = (p: number) => {
    const FADE = 0.07;
    LAYERS.forEach((layer, i) => {
      const el = overlayRefs.current[i];
      if (!el) return;

      let opacity = 0, ty = 20;
      if (p >= layer.start && p <= layer.end) {
        const inEnd  = layer.start + FADE;
        const outStart = layer.end - FADE;
        if      (p < inEnd)    { const t = (p - layer.start) / FADE; opacity = t;     ty = 20 * (1 - t); }
        else if (p > outStart) { const t = (p - outStart)    / FADE; opacity = 1 - t; ty = -20 * t; }
        else                   { opacity = 1; ty = 0; }
      }
      el.style.opacity   = String(+opacity.toFixed(4));
      el.style.transform = `translateY(${+ty.toFixed(2)}px)`;
    });

    if (scrollIndRef.current) {
      scrollIndRef.current.style.opacity = p > 0.04 ? '0' : '1';
    }
  };

  // ── Canvas setup & image loading ───────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial size + dark fill
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const resize = () => {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Recompute draw geometry and redraw
      if (bitmapsRef.current[0]) recomputeGeo(bitmapsRef.current[0]);
      draw(Math.max(0, frameRef.current));
    };
    window.addEventListener('resize', resize, { passive: true });

    /**
     * Compute pixel-perfect cover offset once, store in drawGeoRef.
     * All bitmaps are pre-scaled to the SAME cover dimensions,
     * so this is computed once and reused.
     */
    const recomputeGeo = (bmp: ImageBitmap) => {
      const cW = canvas.width, cH = canvas.height;
      drawGeoRef.current = {
        dx: Math.round((cW - bmp.width)  / 2),
        dy: Math.round((cH - bmp.height) / 2),
      };
    };

    /**
     * Load a frame:
     * 1. fetch → blob
     * 2. createImageBitmap with resizeWidth/Height = cover dimensions
     *    → GPU-decoded, pre-scaled, ready for zero-cost blit
     */
    const loadFrame = async (i: number) => {
      try {
        const resp = await fetch(framePath(i));
        if (!resp.ok) return;
        const blob = await resp.blob();

        // For the very first frame: decode at natural size to get dimensions
        if (i === 0 && !drawGeoRef.current) {
          const naturalBmp = await createImageBitmap(blob);
          const cW = canvas.width, cH = canvas.height;
          const scale   = Math.max(cW / naturalBmp.width, cH / naturalBmp.height);
          const scaledW = Math.ceil(naturalBmp.width  * scale);
          const scaledH = Math.ceil(naturalBmp.height * scale);
          naturalBmp.close();

          // Store cover offset
          drawGeoRef.current = {
            dx: Math.round((cW - scaledW) / 2),
            dy: Math.round((cH - scaledH) / 2),
          };

          // Re-decode at exact cover size
          const coverBmp = await createImageBitmap(blob, {
            resizeWidth:   scaledW,
            resizeHeight:  scaledH,
            resizeQuality: 'high',
          });
          bitmapsRef.current[0] = coverBmp;
          if (frameRef.current === -1) {
            frameRef.current = 0;
            draw(0);
          }
          return;
        }

        // For all other frames: use the cover dimensions we already know
        const geo = drawGeoRef.current;
        if (!geo) {
          // Geometry not ready yet — store a naturally-sized fallback
          bitmapsRef.current[i] = await createImageBitmap(blob);
          return;
        }

        const first = bitmapsRef.current[0];
        if (!first) return;
        const targetW = first.width;
        const targetH = first.height;

        bitmapsRef.current[i] = await createImageBitmap(blob, {
          resizeWidth:   targetW,
          resizeHeight:  targetH,
          resizeQuality: 'high',
        });
      } catch { /* frame 404 or decode error — skip */ }
    };

    // Priority loading: [0] first, then [1-4] in parallel, then the rest
    loadFrame(0).then(() => {
      const batch1 = [1, 2, 3, 4].map(loadFrame);
      Promise.all(batch1).then(() => {
        for (let i = 5; i < TOTAL_FRAMES; i++) loadFrame(i);
      });
    });

    return () => {
      window.removeEventListener('resize', resize);
      bitmapsRef.current.forEach(bmp => bmp?.close());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Lenis scroll listener — runs INSIDE Lenis RAF tick ────────────────────
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Retry until Lenis instance is ready
    const tryAttach = () => {
      cleanup = onLenisScroll((scroll) => {
        const container = containerRef.current;
        if (!container) return;

        const top   = container.offsetTop;
        const range = container.offsetHeight - window.innerHeight;
        if (range <= 0) return;

        const p     = clamp((scroll - top) / range, 0, 1);
        const frame = Math.round(p * (TOTAL_FRAMES - 1));

        progressRef.current = p;

        // Draw only when frame actually changes — zero redundant work
        if (frame !== frameRef.current && bitmapsRef.current[frame]) {
          frameRef.current = frame;
          draw(frame);          // ← called synchronously inside Lenis RAF tick
        }

        // DOM-mutate overlays — no React, no vdom diff
        updateOverlays(p);
      });
    };

    // Lenis may not be ready on first render — poll briefly
    const interval = setInterval(() => {
      if (getLenis()) {
        clearInterval(interval);
        tryAttach();
      }
    }, 30);

    return () => {
      clearInterval(interval);
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative" style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-void">

        {/* Canvas — alpha:false = ~15% faster draw, will-change hints GPU layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'contents', imageRendering: 'auto' }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 25%, rgba(10,10,10,0.65) 100%)' }}
        />

        {/* Text overlays — zero React state, pure DOM mutation */}
        <Overlays refs={overlayRefs} />

        {/* Scroll indicator */}
        <div
          ref={scrollIndRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ transition: 'opacity 0.6s', willChange: 'opacity' }}
        >
          <span className="text-ash text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-copper-400 to-transparent animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
}
