import RootLayout from '@/Layouts/RootLayout';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Link } from '@inertiajs/react';
import TextReveal from '@/Components/TextReveal';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const features = [
  { icon: '🌟', title: 'Ambiente Divertido',     desc: 'Un espacio pensado para los más pequeños: música, pantallas y colores que les encantan.' },
  { icon: '✋', title: 'Barberos Especializados', desc: 'Nuestro equipo tiene experiencia y paciencia infinita para trabajar con niños.' },
  { icon: '⏱️', title: 'Corte Rápido',           desc: 'Sabemos que los niños no quieren estar mucho tiempo sentados. Somos ágiles y eficientes.' },
  { icon: '💧', title: 'Productos Seguros',       desc: 'Solo usamos productos específicos para cabello infantil, seguros e hipoalergénicos.' },
];

export default function CorteInfantil({ meta }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <RootLayout meta={meta}>
      {/* Hero — softer amber tones instead of copper */}
      <section className="relative pt-36 pb-24 px-6 md:px-10 min-h-[80vh] flex flex-col justify-end overflow-hidden">
        {/* Warmer amber gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
        />
        {/* Star shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-500/10 font-bold text-6xl select-none pointer-events-none"
            style={{ top: `${10 + i * 12}%`, left: `${5 + i * 12}%` }}
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
          >
            ✦
          </motion.div>
        ))}

        <div className="relative max-w-7xl mx-auto w-full">
          <p className="text-amber-400 text-xs tracking-ultra uppercase mb-6">Para los Campeones</p>
          <h1 className="font-display font-black text-7xl md:text-9xl tracking-tightest leading-none text-bone mb-6">
            Corte<br />
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Infantil.
            </span>
          </h1>
          <p className="text-ash text-lg max-w-md leading-relaxed">
            Una experiencia pensada para los más pequeños. Cómoda, rápida y con resultados que los hacen sentir geniales.
          </p>
        </div>
      </section>

      {/* Tagline */}
      <section className="py-24 px-6 md:px-10 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <TextReveal
            text="Cada niño merece un corte tan especial como él mismo."
            className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-tight text-bone text-center"
          />
        </div>
      </section>

      {/* Features grid */}
      <section ref={ref} className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-surface rounded-2xl border border-border-subtle hover:border-amber-500/30 p-7 transition-all duration-300 group"
            >
              <span className="text-4xl mb-5 block">{f.icon}</span>
              <h3 className="font-display font-bold text-xl text-bone tracking-tight mb-2 group-hover:text-amber-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-steel text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Price section */}
      <section className="py-24 px-6 md:px-10 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <p className="text-amber-400 text-xs tracking-ultra uppercase mb-3">Precio</p>
            <div className="font-display font-black text-8xl tracking-tighter text-bone">
              15<span className="text-amber-400">€</span>
            </div>
            <p className="text-steel mt-2">Niños hasta 12 años · ~30 minutos</p>
          </div>
          <div className="space-y-4 max-w-md">
            <p className="text-ash leading-relaxed">
              Incluye lavado, corte, secado y peinado. Nuestros barberos expertos están especializados en hacer que la experiencia sea tranquila y agradable para los más pequeños.
            </p>
            <Link
              href="/reservas"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-sm tracking-widest uppercase text-void"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
            >
              Reservar Cita →
            </Link>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
