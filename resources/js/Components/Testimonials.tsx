import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Testimonial {
  quote:  string;
  author: string;
  role:   string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:  '"Llevo 3 años viniendo a Luni Styles. El nivel de detalle y la atención personalizada son incomparables. Mi mejor opción en Madrid."',
    author: 'Alejandro M.',
    role:   'Cliente desde 2021',
    rating: 5,
  },
  {
    quote:  '"Vine por primera vez y quedé flipando. El ambiente, la música, el resultado... Todo perfecto. No voy a ningún otro sitio."',
    author: 'Carlos R.',
    role:   'Cliente desde 2022',
    rating: 5,
  },
  {
    quote:  '"Para mi hijo fue su primera experiencia en una barbería y el trato fue 10. Volveremos sin duda. Profesionales de verdad."',
    author: 'Laura G.',
    role:   'Madre de cliente',
    rating: 5,
  },
  {
    quote:  '"El fade que me hacen aquí no lo encuentro en ningún otro sitio de Madrid. Precisión milimétrica. Absolutamente recomendable."',
    author: 'Darío K.',
    role:   'Cliente desde 2023',
    rating: 5,
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
  }),
};

export default function Testimonials() {
  const [index, setIndex]    = useState(0);
  const [dir,   setDir]      = useState(1);
  const intervalRef          = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  };

  const next = () => goTo((index + 1) % testimonials.length);
  const prev = () => goTo((index - 1 + testimonials.length) % testimonials.length);

  // Autoplay
  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const t = testimonials[index];

  return (
    <section className="relative bg-void overflow-hidden py-0">
      {/* Fullscreen slide */}
      <div className="relative h-screen flex flex-col">
        {/* Background copper glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(205,127,50,0.04) 0%, transparent 70%)' }}
        />

        {/* Header row */}
        <div className="relative z-10 px-8 md:px-20 pt-24 md:pt-32 pb-0 flex justify-between items-end">
          <div>
            <p className="text-copper-400 text-xs tracking-ultra uppercase">Lo que dicen de nosotros</p>
            <p className="text-steel text-sm mt-1">{index + 1} / {testimonials.length}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border hover:border-copper-500/40 flex items-center justify-center text-ash hover:text-copper-400 transition-all"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border hover:border-copper-500/40 flex items-center justify-center text-ash hover:text-copper-400 transition-all"
            >
              →
            </button>
          </div>
        </div>

        {/* Quote area */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-20 overflow-hidden">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={index}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center max-w-4xl"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-copper-400 text-xl">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-bone mb-12">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-px bg-copper-gradient" />
                <p className="text-bone font-medium text-sm tracking-widest uppercase mt-2">{t.author}</p>
                <p className="text-steel text-xs tracking-wider">{t.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="relative px-8 md:px-20 pb-12">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="h-px flex-1 transition-all duration-300"
                style={{ background: i === index ? '#cd7f32' : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
