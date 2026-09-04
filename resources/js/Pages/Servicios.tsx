import RootLayout from '@/Layouts/RootLayout';
import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

type Category = 'Todos' | 'Corte' | 'Barba' | 'Tratamiento';

const allServices = [
  { category: 'Corte',       title: 'Corte Clásico',       description: 'Corte de tijera y máquina con acabado perfecto.', price: '25€',  duration: '45 min' },
  { category: 'Corte',       title: 'Fade / Degradado',     description: 'High, mid o skin fade. Transiciones perfectas.',   price: '28€',  duration: '50 min' },
  { category: 'Corte',       title: 'Corte + Barba',        description: 'Servicio completo de corte y arreglo de barba.',   price: '40€',  duration: '75 min' },
  { category: 'Corte',       title: 'Corte Infantil',       description: 'Corte para niños hasta 12 años, con paciencia.',   price: '15€',  duration: '30 min' },
  { category: 'Barba',       title: 'Arreglo de Barba',     description: 'Perfilado, líneas y nutrición con aceites premium.',price: '18€',  duration: '30 min' },
  { category: 'Barba',       title: 'Afeitado Clásico',     description: 'Navaja, toalla caliente y crema artesanal.',        price: '30€',  duration: '45 min' },
  { category: 'Barba',       title: 'Diseño de Barba',      description: 'Creación de forma y estilo desde cero.',            price: '25€',  duration: '40 min' },
  { category: 'Tratamiento', title: 'Hidratación Capilar',  description: 'Tratamiento intensivo con mascarilla premium.',     price: '35€',  duration: '60 min' },
  { category: 'Tratamiento', title: 'Masaje Craneal',        description: 'Relajante masaje de cuero cabelludo.',              price: '20€',  duration: '20 min' },
  { category: 'Tratamiento', title: 'Pack VIP',              description: 'Corte + barba + masaje + hidratación. Lo mejor.',   price: '80€',  duration: '120 min' },
];

export default function Servicios({ meta }: Props) {
  const [filter, setFilter] = useState<Category>('Todos');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const categories: Category[] = ['Todos', 'Corte', 'Barba', 'Tratamiento'];
  const filtered = filter === 'Todos' ? allServices : allServices.filter(s => s.category === filter);

  return (
    <RootLayout meta={meta}>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 md:px-10">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 20%, rgba(205,127,50,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto">
          <p className="text-copper-400 text-xs tracking-ultra uppercase mb-4">Menú de Servicios</p>
          <h1 className="font-display font-black text-7xl md:text-9xl tracking-tightest leading-none text-bone mb-6">
            Servicios.
          </h1>
          <p className="text-ash text-lg max-w-md">Cada servicio diseñado para elevar tu estética al máximo nivel.</p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="px-6 md:px-10 py-8 border-y border-border-subtle sticky top-20 z-30 bg-void/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300
                ${filter === cat
                  ? 'bg-copper-gradient text-void font-bold shadow-copper'
                  : 'border border-border text-ash hover:border-copper-500/40 hover:text-bone'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Services list */}
      <section ref={ref} className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-0">
            {filtered.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-7 border-b border-border-subtle hover:border-copper-500/30 gap-4 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <span className="text-copper-400/50 text-xs font-mono mt-1 w-6">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-bone tracking-tight group-hover:text-copper-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-steel text-sm mt-1">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 pl-12 sm:pl-0">
                  <div className="text-right">
                    <p className="text-copper-400 font-bold text-lg">{service.price}</p>
                    <p className="text-steel text-xs">{service.duration}</p>
                  </div>
                  <span className="text-steel opacity-0 group-hover:opacity-100 transition-all group-hover:text-copper-400 text-lg">→</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <Link
              href="/reservas"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-display font-bold text-sm tracking-widest uppercase text-void"
              style={{ background: 'linear-gradient(135deg, #cd7f32, #e8a87c)', boxShadow: '0 0 40px rgba(205,127,50,0.3)' }}
            >
              Reservar un Servicio →
            </Link>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
