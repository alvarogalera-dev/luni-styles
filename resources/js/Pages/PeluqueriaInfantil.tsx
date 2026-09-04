import RootLayout from '@/Layouts/RootLayout';
import KidsScrollAnimation from '@/Components/KidsScrollAnimation';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Baby, Smile, Clock } from 'lucide-react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const team = [
  { name: 'Mariely', role: 'Especialista Infantil', years: '5 años', specialty: 'Cortes Creativos & Paciencia Infinita' },
];

const services = [
  { name: 'Corte Kids (0-12)', price: '15€', duration: '30 min', desc: 'Corte adaptado a los más peques. Con juegos, paciencia y sin tirones.', img: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=800&auto=format&fit=crop' },
  { name: 'Primer Corte (Bebés)', price: '12€', duration: '30 min', desc: 'Una experiencia tranquila con diploma de recuerdo y guardado del primer mechón.', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop' },
  { name: 'Peinados Especiales', price: '18€', duration: '45 min', desc: 'Para comuniones, bodas o fiestas. Trenzas, gominas de colores y mucha diversión.', img: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop' },
];

const products = [
  { name: 'Gel Fijador Kids', brand: 'GentleCare', price: '12€', desc: 'Sin alcohol, base de agua, aroma a fresa.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop' },
  { name: 'Champú No Lágrimas', brand: 'PureSoft', price: '14€', desc: 'Fórmula ultra suave para pieles sensibles.', img: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=500&auto=format&fit=crop' },
];

const gallery = [
  'https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop',
];

export default function PeluqueriaInfantil({ meta }: Props) {
  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: '-10%' });

  return (
    <RootLayout meta={meta}>
      
      {/* ── Kids Scroll Animation ── */}
      <KidsScrollAnimation />

      <div className="relative z-10 bg-white text-slate-800 -mt-[1px]">
        
        {/* ── Servicios ── */}
        {/* ── Servicios ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 border-t border-emerald-100 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 text-center">
              <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Lo que hacemos</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-slate-900">Cero dramas.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {services.map((svc, i) => (
                <div key={i} className="group relative bg-white border border-emerald-100 rounded-2xl overflow-hidden hover:border-emerald-300 transition-colors shadow-sm hover:shadow-xl hover:shadow-emerald-100/50">
                  <div className="h-48 md:h-64 overflow-hidden bg-slate-100">
                    <img src={svc.img} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900">{svc.name}</h3>
                      <span className="text-lg md:text-xl font-bold text-emerald-500">{svc.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-wider mb-4 font-bold">
                      <Clock className="w-3 h-3" /> {svc.duration}
                    </div>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── El Equipo ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16">
              <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">La Jefa</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-slate-900">Mano de santo.</h2>
            </div>

            <div ref={teamRef} className="max-w-xl">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={teamInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  className="group flex flex-col sm:flex-row gap-6 bg-emerald-50 rounded-3xl border border-emerald-100 p-6 md:p-8 hover:border-emerald-300 transition-all duration-500 items-center sm:items-start text-center sm:text-left"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-inner text-emerald-200 group-hover:text-emerald-400 transition-colors">
                    <Baby className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">{member.name}</h3>
                    <p className="text-emerald-600 font-bold text-[10px] tracking-widest uppercase mt-1 mb-2">{member.role}</p>
                    <p className="text-slate-600 text-sm">{member.specialty}</p>
                    <p className="text-slate-500 text-xs mt-2 italic">La que domina a cualquier fiera.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Productos ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 border-t border-emerald-100 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Para casa</p>
              <h2 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-slate-900 mb-6">Sin tirones.</h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                Llevate los productos que usamos aquí. Champús suaves y gominas sin alcohol para que peinarlos no sea una guerra.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {products.map((p, i) => (
                <div key={i} className="bg-white border border-emerald-100 p-4 md:p-6 rounded-2xl flex gap-4 md:gap-6 items-center hover:border-emerald-300 transition-colors shadow-sm">
                  <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden bg-emerald-50">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-all" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{p.brand}</span>
                    <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1">{p.name}</h3>
                    <p className="text-emerald-500 font-bold text-xs md:text-sm mb-1">{p.price}</p>
                    <p className="text-[10px] md:text-xs text-slate-600">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Galería ── */}
        <section className="py-20 md:py-24 overflow-hidden border-t border-emerald-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-10 mb-12 text-center">
            <h2 className="font-display font-black text-4xl md:text-5xl text-slate-900 tracking-tighter">Donde pasa la magia.</h2>
          </div>
          <div className="flex gap-4 md:gap-6 px-4 md:px-10 pb-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {gallery.map((img, i) => (
              <div key={i} className="min-w-[85vw] md:min-w-[50vw] h-[300px] md:h-[500px] shrink-0 snap-center rounded-3xl overflow-hidden relative shadow-lg">
                <img src={img} alt="Galería" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Reserva Calendario ── */}
        <section className="py-24 md:py-32 px-4 md:px-10 bg-emerald-50 border-t border-emerald-100 text-center">
          <div className="max-w-3xl mx-auto bg-white border border-emerald-100 p-8 md:p-12 rounded-[2rem] relative overflow-hidden shadow-xl shadow-emerald-900/5">
            <Smile className="w-12 h-12 md:w-16 md:h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="font-display font-black text-3xl md:text-5xl text-slate-900 mb-4 relative z-10">Píllale cita.</h2>
            <p className="text-slate-600 text-sm md:text-base mb-8 relative z-10">Dinos qué día te viene bien y nosotros nos encargamos de que salga guapísimo.</p>
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'infantil' } }))}
              className="relative z-10 px-8 py-3 md:px-10 md:py-4 bg-emerald-500 text-white font-bold uppercase tracking-widest text-[10px] md:text-sm rounded-full hover:bg-emerald-400 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
            >
              Abrir Calendario Infantil
            </button>
          </div>
        </section>

      </div>
    </RootLayout>
  );
}
