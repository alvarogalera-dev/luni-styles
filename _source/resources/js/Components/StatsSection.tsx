import { useRef, useEffect, useState } from 'react';
import { useInView } from 'motion/react';

interface Stat {
  value:    number;
  suffix:   string;
  label:    string;
  duration: number; // ms
}

const stats: Stat[] = [
  { value: 5000, suffix: '+', label: 'Cortes Realizados', duration: 2000 },
  { value: 10,   suffix: '+', label: 'Maestros Barberos', duration: 1400 },
  { value: 8,    suffix: '+', label: 'Años de Experiencia', duration: 1200 },
  { value: 4.9,  suffix: '★', label: 'Valoración Media', duration: 1600 },
];

function CountUp({ value, suffix, duration, inView }: { value: number; suffix: string; duration: number; inView: boolean }) {
  const [current, setCurrent] = useState(0);
  const isDecimal = !Number.isInteger(value);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = start + (value - start) * eased;
      setCurrent(isDecimal ? parseFloat(val.toFixed(1)) : Math.floor(val));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, isDecimal]);

  return (
    <span>
      {isDecimal ? current.toFixed(1) : current.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)' }}
    >
      {/* Copper line decorations */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(205,127,50,0.3), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(205,127,50,0.3), transparent)' }}
      />

      {/* Large BG text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-display font-black text-[20vw] tracking-tightest leading-none"
          style={{ color: 'rgba(255,255,255,0.015)' }}
        >
          LUNI
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-border-subtle">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-6 md:p-10"
              style={{
                opacity:   inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.7s cubic-bezier(0.76,0,0.24,1) ${i * 0.15}s, transform 0.7s cubic-bezier(0.76,0,0.24,1) ${i * 0.15}s`,
              }}
            >
              <div className="font-display font-black text-5xl md:text-6xl tracking-tighter text-copper-gradient mb-2">
                <CountUp value={stat.value} suffix={stat.suffix} duration={stat.duration} inView={inView} />
              </div>
              <p className="text-steel text-sm tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
