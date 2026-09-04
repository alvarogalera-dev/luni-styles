import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, motion, useTransform } from 'motion/react';
import { Link } from '@inertiajs/react';

const TOTAL_FRAMES = 40;

// Padding with leading zeros: frame_001.jpg
function getFramePath(index: number): string {
  return `/sequence/frame_${String(index).padStart(3, '0')}.jpg`;
}

interface TextLayer {
  startProgress: number;
  endProgress:   number;
  content:       React.ReactNode;
  align:         'left' | 'center' | 'right';
}

const textLayers: TextLayer[] = [
  {
    startProgress: 0,
    endProgress:   0.2,
    align:         'center',
    content: (
      <div className="text-center">
        <p className="text-copper-400 text-xs tracking-ultra uppercase mb-6 font-medium">Est. 2015</p>
        <h1 className="font-display font-black text-7xl md:text-9xl lg:text-10xl tracking-tightest leading-none text-bone mb-6">
          LUNI<br />
          <span className="text-shimmer">STYLES</span>
        </h1>
        <p className="text-ash text-lg md:text-xl tracking-widest uppercase font-light">
          Precision.&nbsp;&nbsp;Power.&nbsp;&nbsp;Style.
        </p>
      </div>
    ),
  },
  {
    startProgress: 0.25,
    endProgress:   0.5,
    align:         'left',
    content: (
      <div className="max-w-lg">
        <p className="text-copper-400 text-xs tracking-ultra uppercase mb-4">El Arte</p>
        <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none text-bone">
          Dominando el oficio hasta el último detalle.
        </h2>
      </div>
    ),
  },
  {
    startProgress: 0.55,
    endProgress:   0.8,
    align:         'right',
    content: (
      <div className="max-w-lg text-right">
        <p className="text-copper-400 text-xs tracking-ultra uppercase mb-4">La Tecnología</p>
        <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none text-bone">
          Tecnología avanzada de grooming.
        </h2>
      </div>
    ),
  },
  {
    startProgress: 0.85,
    endProgress:   1.0,
    align:         'center',
    content: (
      <div className="text-center">
        <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none text-bone mb-10">
          Siente la diferencia.
        </h2>
        <MagneticButton />
      </div>
    ),
  },
];

function MagneticButton() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.4;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.4;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block', transition: 'transform 0.4s cubic-bezier(0.76,0,0.24,1)' }}
    >
      <Link
        href="/reservas"
        className="group relative inline-flex items-center gap-3 px-10 py-5 overflow-hidden rounded-full"
        style={{
          background: 'linear-gradient(135deg, #cd7f32, #e8a87c)',
          boxShadow: '0 0 40px rgba(205,127,50,0.4)',
        }}
      >
        <span className="relative z-10 text-void font-display font-bold text-sm tracking-widest uppercase">
          Reservar Ahora
        </span>
        <span className="relative z-10 text-void text-lg">→</span>
        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, #e8a87c, #cd7f32)' }}
        />
      </Link>
    </div>
  );
}

function TextOverlay({ layer, scrollProgress }: { layer: TextLayer; scrollProgress: number }) {
  const mid = (layer.startProgress + layer.endProgress) / 2;
  const fadeInEnd  = layer.startProgress + 0.06;
  const fadeOutStart = layer.endProgress - 0.06;

  let opacity = 0;
  let translateY = 20;

  if (scrollProgress >= layer.startProgress && scrollProgress <= layer.endProgress) {
    if (scrollProgress < fadeInEnd) {
      const t = (scrollProgress - layer.startProgress) / 0.06;
      opacity = t;
      translateY = 20 * (1 - t);
    } else if (scrollProgress > fadeOutStart) {
      const t = (scrollProgress - fadeOutStart) / 0.06;
      opacity = 1 - t;
      translateY = -20 * t;
    } else {
      opacity = 1;
      translateY = 0;
    }
  }

  if (opacity <= 0.001) return null;

  const alignClass =
    layer.align === 'left'   ? 'items-start px-8 md:px-20'  :
    layer.align === 'right'  ? 'items-end   px-8 md:px-20'  :
                               'items-center px-8 md:px-20';

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center pointer-events-none ${alignClass}`}
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      {/* Enable pointer events on the last slide for the button */}
      <div style={{ pointerEvents: layer.startProgress >= 0.85 ? 'auto' : 'none' }}>
        {layer.content}
      </div>
    </div>
  );
}

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Preload all frames
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
          drawFrame(0);
        }
      };
      img.onerror = () => {
        loaded++;
        // Still count as loaded so the rest continues
        if (loaded === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
          drawFrame(0);
        }
      };
      images.push(img);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    const img    = imagesRef.current[index];

    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) {
      // Draw placeholder dark bg
      if (canvas && ctx) {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    // Cover logic
    const cW = canvas.width;
    const cH = canvas.height;
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    const scale = Math.max(cW / iW, cH / iH);
    const drawW = iW * scale;
    const drawH = iH * scale;
    const dx    = (cW - drawW) / 2;
    const dy    = (cH - drawH) / 2;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, cW, cH);
    ctx.drawImage(img, dx, dy, drawW, drawH);
  };

  // Canvas resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // Scroll → frame
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(latest);
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(latest * (TOTAL_FRAMES - 1)))
    );
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* Sticky canvas viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: '#0a0a0a' }}
        />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(10,10,10,0.6) 100%)',
          }}
        />

        {/* Text overlays */}
        {textLayers.map((layer, i) => (
          <TextOverlay key={i} layer={layer} scrollProgress={scrollProgress} />
        ))}

        {/* Scroll indicator (visible before first scroll) */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-ash text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-copper-400 to-transparent animate-pulse-slow" />
        </motion.div>
      </div>
    </div>
  );
}
