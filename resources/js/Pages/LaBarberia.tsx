import RootLayout from '@/Layouts/RootLayout';
import SequenceScroll from '@/Components/SequenceScroll';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Scissors, Sparkles, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const team = [
  { name: 'Luis', role: 'Master Barber', years: '10+ años', specialty: 'Fades & Cortes Clásicos' },
  { name: 'Carlos', role: 'Senior Barber', years: '7 años', specialty: 'Barba & Afeitado Clásico' },
];

const services = [
  { name: 'Corte Clásico', price: '18€', duration: '40 min', desc: 'Corte a tijera o máquina, lavado, masaje capilar y peinado con producto premium.', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop' },
  { name: 'Arreglo de Barba', price: '14€', duration: '30 min', desc: 'Ritual de toallas calientes, perfilado a navaja, aceites esenciales y bálsamo hidratante.', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop' },
  { name: 'Corte + Barba', price: '28€', duration: '60 min', desc: 'El servicio completo. Corte premium y ritual de barba para salir impecable.', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop' },
];

const products = [
  { name: 'Pomada Mate', brand: 'Reuzel', price: '22€', desc: 'Fijación media, acabado natural sin brillos.', img: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=500&auto=format&fit=crop' },
  { name: 'Aceite de Barba', brand: 'Proraso', price: '18€', desc: 'Hidrata, suaviza y perfuma (madera y especias).', img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500&auto=format&fit=crop' },
];

const gallery = [
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop',
];

export default function LaBarberia({ meta }: Props) {
  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: '-10%' });

  return (
    <RootLayout meta={meta}>
      
      {/* ── Sequence Scroll (Máquina) ── */}
      <SequenceScroll />

      <div className="relative z-10 bg-[#0a0a0a] text-bone -mt-[1px]">
        
        {/* ── Servicios ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 text-center">
              <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">La Carta</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-white">Nuestros Servicios.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((svc, i) => (
                <div key={i} className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors">
                  <div className="h-48 md:h-64 overflow-hidden">
                    <img src={svc.img} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-xl md:text-2xl font-display font-bold">{svc.name}</h3>
                      <span className="text-lg md:text-xl font-bold text-amber-400">{svc.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-steel text-[10px] uppercase tracking-wider mb-4">
                      <Clock className="w-3 h-3" /> {svc.duration}
                    </div>
                    <p className="text-ash text-sm md:text-base leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── El Equipo ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 bg-[#111]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16">
              <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Los Chavales</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-white">El Equipo.</h2>
            </div>

            <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                  className="group flex flex-col sm:flex-row gap-6 bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 hover:border-amber-400/30 transition-all duration-500 text-center sm:text-left items-center sm:items-start"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-carbon rounded-xl flex items-center justify-center font-display font-black text-5xl sm:text-6xl text-white/5 group-hover:text-amber-400/10 transition-colors">
                    {member.name[0]}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-bone tracking-tight">{member.name}</h3>
                    <p className="text-amber-400 text-[10px] tracking-widest uppercase mt-1 mb-2">{member.role}</p>
                    <p className="text-steel text-sm">{member.specialty}</p>
                    <p className="text-ash text-xs mt-2 italic">19 años, energía a tope.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Productos ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Mantenimiento</p>
              <h2 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-white mb-6">Cuida tu rollo.</h2>
              <p className="text-ash text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                Píllate las ceras y aceites que usamos nosotros en el local para llevar el pelo y la barba finos toda la semana.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {products.map((p, i) => (
                <div key={i} className="bg-[#111] border border-white/5 p-4 md:p-6 rounded-2xl flex gap-4 md:gap-6 items-center hover:border-amber-400/30 transition-colors">
                  <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden bg-carbon">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-steel">{p.brand}</span>
                    <h3 className="font-bold text-base md:text-lg mb-1">{p.name}</h3>
                    <p className="text-amber-400 font-bold text-xs md:text-sm mb-1">{p.price}</p>
                    <p className="text-[10px] md:text-xs text-ash">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Galería ── */}
        <section className="py-20 md:py-24 overflow-hidden border-t border-white/5 bg-[#111]">
          <div className="max-w-7xl mx-auto px-4 md:px-10 mb-12 text-center">
            <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tighter">El Local.</h2>
            <p className="text-steel mt-4 text-sm">El sitio donde pasa todo.</p>
          </div>
          <div className="flex gap-4 md:gap-6 px-4 md:px-10 pb-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {gallery.map((img, i) => (
              <div key={i} className="min-w-[85vw] md:min-w-[50vw] h-[300px] md:h-[500px] shrink-0 snap-center rounded-2xl overflow-hidden relative">
                <img src={img} alt="Galería" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-void/20" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Reserva Calendario ── */}
        <section className="py-24 md:py-32 px-4 md:px-10 bg-void border-t border-white/5 text-center">
          <div className="max-w-3xl mx-auto bg-carbon border border-onyx p-8 md:p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 to-transparent" />
            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="font-display font-black text-3xl md:text-5xl text-white mb-4 relative z-10">Pide tu cita.</h2>
            <p className="text-ash text-sm md:text-base mb-8 relative z-10">No te quedes sin hueco para este finde.</p>
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'barberia' } }))}
              className="relative z-10 px-8 py-3 md:px-10 md:py-4 bg-amber-400 text-void font-bold uppercase tracking-widest text-[10px] md:text-sm rounded-full hover:bg-amber-300 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-400/20"
            >
              Abrir Calendario
            </button>
          </div>
        </section>

      </div>
    </RootLayout>
  );
}
