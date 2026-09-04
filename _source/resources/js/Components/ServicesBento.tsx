import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from '@inertiajs/react';

interface Service {
  title:       string;
  description: string;
  price:       string;
  span:        string; // grid span class
  accent:      boolean;
}

const services: Service[] = [
  {
    title:       'Corte Clásico',
    description: 'Corte de alta precisión adaptado a tu morfología facial. Técnica tijera y máquina.',
    price:       'desde 25€',
    span:        'md:col-span-2 md:row-span-2',
    accent:      true,
  },
  {
    title:       'Arreglo de Barba',
    description: 'Perfilado, relleno y definición de barba con productos premium.',
    price:       'desde 18€',
    span:        '',
    accent:      false,
  },
  {
    title:       'Corte Infantil',
    description: 'Para los más pequeños, con paciencia y cariño.',
    price:       'desde 15€',
    span:        '',
    accent:      false,
  },
  {
    title:       'Fade & Taper',
    description: 'Degradados perfectos. High fade, mid fade, skin fade.',
    price:       'desde 28€',
    span:        'md:col-span-2',
    accent:      false,
  },
  {
    title:       'Afeitado Clásico',
    description: 'Afeitado tradicional con navaja, toalla caliente y crema artesanal.',
    price:       'desde 30€',
    span:        '',
    accent:      false,
  },
  {
    title:       'Tratamiento Capilar',
    description: 'Hidratación, revitalización y nutrición para tu cabello.',
    price:       'desde 35€',
    span:        '',
    accent:      false,
  },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.76, 0, 0.24, 1] },
  }),
};

export default function ServicesBento() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section className="bg-void py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-copper-400 text-xs tracking-ultra uppercase mb-3">Nuestros Servicios</p>
            <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none text-bone">
              El Arte del<br />Grooming.
            </h2>
          </div>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-3 text-ash text-sm tracking-widest uppercase hover:text-copper-400 transition-colors group"
          >
            Ver todos
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Bento grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className={`group relative rounded-2xl overflow-hidden border border-border-subtle 
                          hover:border-copper-500/30 transition-all duration-500 cursor-pointer
                          ${service.span}
                          ${service.accent ? 'bg-charcoal' : 'bg-surface'}`}
            >
              {/* Copper glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(205,127,50,0.08) 0%, transparent 70%)' }}
              />

              <div className="relative p-7 h-full flex flex-col justify-between min-h-[160px]">
                {/* Icon placeholder */}
                <div className="w-10 h-10 rounded-full border border-copper-500/30 flex items-center justify-center mb-auto">
                  <div className="w-3 h-3 rounded-full bg-copper-400 group-hover:scale-150 transition-transform duration-300" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-bone tracking-tight mb-2 group-hover:text-copper-gradient transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-steel text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-copper-400 font-medium text-sm tracking-wide">{service.price}</span>
                    <span className="text-steel text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver más →
                    </span>
                  </div>
                </div>
              </div>

              {/* Accent top border on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-copper-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
