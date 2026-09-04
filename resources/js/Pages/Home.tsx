import RootLayout from '@/Layouts/RootLayout';
import SequenceScroll from '@/Components/SequenceScroll';
import ServicesBento from '@/Components/ServicesBento';
import StatsSection from '@/Components/StatsSection';
import Testimonials from '@/Components/Testimonials';
import CTASection from '@/Components/CTASection';
import TextReveal from '@/Components/TextReveal';
import { motion } from 'motion/react';

interface Meta {
  title:       string;
  description: string;
}

interface Props {
  meta: Meta;
}

export default function Home({ meta }: Props) {
  return (
    <RootLayout meta={meta}>
      {/* ── Hero Sequence ── */}
      <SequenceScroll />

      {/* ── Everything below scrolls over the canvas ── */}
      <div className="relative z-10 bg-void -mt-[1px]">

        {/* ── About / Marquee Divider ── */}
        <section className="overflow-hidden border-y border-border-subtle py-5">
          <div className="marquee-track">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-8 px-8 text-xs tracking-ultra uppercase text-steel whitespace-nowrap">
                <span className="text-copper-400">✦</span>
                Luni Styles
                <span className="text-copper-400">✦</span>
                Precision Barbershop
                <span className="text-copper-400">✦</span>
                Madrid
                <span className="text-copper-400">✦</span>
                Est. 2015
              </span>
            ))}
          </div>
        </section>

        {/* ── About Text Reveal ── */}
        <section className="py-32 md:py-48 px-6 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-copper-400 text-xs tracking-ultra uppercase mb-6">Sobre Nosotros</p>
              <TextReveal
                text="Somos más que una barbería. Somos un estudio de grooming donde cada visita es una experiencia."
                className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-tight text-bone"
              />
            </div>
            <div className="space-y-6">
              <TextReveal
                text="Desde 2015, nuestro equipo de maestros barberos combina técnicas tradicionales con las tendencias más actuales para ofrecerte un resultado que habla por sí solo."
                className="text-ash text-lg leading-relaxed"
                delay={0.2}
              />
              <TextReveal
                text="Cada detalle importa. Desde el ambiente hasta los productos que usamos, todo está pensado para darte la mejor versión de ti mismo."
                className="text-steel text-base leading-relaxed"
                delay={0.4}
              />
              <motion.a
                href="/la-barberia"
                className="inline-flex items-center gap-2 text-copper-400 text-sm tracking-widest uppercase group mt-4"
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                Conoce nuestro equipo
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.a>
            </div>
          </div>
        </section>

        {/* ── Services Bento ── */}
        <ServicesBento />

        {/* ── Stats ── */}
        <StatsSection />

        {/* ── Testimonials ── */}
        <Testimonials />

        {/* ── CTA ── */}
        <CTASection />
      </div>
    </RootLayout>
  );
}
