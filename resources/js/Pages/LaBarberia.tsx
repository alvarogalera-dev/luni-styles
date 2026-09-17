import RootLayout from '@/Layouts/RootLayout';
import SequenceScroll from '@/Components/SequenceScroll';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const team = [
  {
    name: 'Luis',
    role: 'CEO & Barber',
    age: '19 años',
    specialty: 'Fades · Barba',
    initial: 'L',
  },
  {
    name: 'Carlos',
    role: 'Barber',
    age: '19 años',
    specialty: 'Fades · Barba',
    initial: 'C',
  },
];

const services = [
  {
    name: 'Corte Normal',
    price: '12€',
    duration: '30 min',
    includes: 'Corte de pelo · Lavado · Cejas',
    img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Corte + Barba',
    price: '15€',
    duration: '45–60 min',
    includes: 'Corte de pelo · Lavado · Cejas · Barba',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Solo Barba',
    price: '4€',
    duration: '15–30 min',
    includes: 'Arreglo de barba',
    img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop',
  },
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

      {/* ── Sequence Scroll (Máquina — sin texto encima) ── */}
      <SequenceScroll />

      <div className="relative z-10 bg-[#0a0a0a] text-bone -mt-[1px]">

        {/* ── Servicios ── */}
        <section className="py-16 md:py-24 px-4 md:px-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 md:mb-16 text-center">
              <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">La Carta</p>
              <h2 className="font-display font-black text-3xl md:text-6xl tracking-tighter text-white">Nuestros Servicios.</h2>
            </div>

            {/* Mobile: vertical stack | Tablet+: grid 3 cols */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-5 md:gap-8">
              {services.map((svc, i) => (
                <div key={i} className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors">
                  <div className="h-44 md:h-56 overflow-hidden">
                    <img
                      src={svc.img}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 md:p-7">
                    {/* Name & price on same row */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg md:text-2xl font-display font-bold leading-tight">{svc.name}</h3>
                      <span className="text-xl md:text-2xl font-black text-amber-400 shrink-0 ml-2">{svc.price}</span>
                    </div>
                    {/* Duration */}
                    <div className="flex items-center gap-1.5 text-steel text-[10px] uppercase tracking-wider mb-3">
                      <Clock className="w-3 h-3 shrink-0" />
                      {svc.duration}
                    </div>
                    {/* Includes */}
                    <p className="text-ash text-xs md:text-sm leading-relaxed">{svc.includes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── El Equipo ── */}
        <section className="py-16 md:py-24 px-4 md:px-10 bg-[#111]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 md:mb-16">
              <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Los Chavales</p>
              <h2 className="font-display font-black text-3xl md:text-6xl tracking-tighter text-white">El Equipo.</h2>
            </div>

            <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                  className="group flex flex-col items-center text-center gap-4 bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 hover:border-amber-400/30 transition-all duration-500"
                >
                  {/* Avatar */}
                  <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-carbon rounded-full flex items-center justify-center font-display font-black text-4xl md:text-5xl text-white/10 group-hover:text-amber-400/20 transition-colors border border-white/5">
                    {member.initial}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-bone tracking-tight">{member.name}</h3>
                    <p className="text-amber-400 text-[10px] tracking-widest uppercase mt-1">{member.role}</p>
                    <p className="text-steel text-xs mt-2">{member.age}</p>
                    <p className="text-ash text-xs mt-1 tracking-wide">{member.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Galería ── */}
        <section className="py-16 md:py-24 overflow-hidden border-t border-white/5 bg-[#111]">
          <div className="max-w-7xl mx-auto px-4 md:px-10 mb-10 md:mb-12 text-center">
            <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tighter">El Local.</h2>
            <p className="text-steel mt-3 text-sm">El sitio donde pasa todo.</p>
          </div>
          {/* Horizontally scrollable on mobile, natural grid on desktop */}
          <div className="flex gap-3 md:gap-5 px-4 md:px-10 pb-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {gallery.map((img, i) => (
              <div
                key={i}
                className="min-w-[82vw] sm:min-w-[60vw] md:min-w-[45vw] h-[240px] md:h-[420px] shrink-0 snap-center rounded-2xl overflow-hidden relative"
              >
                <img src={img} alt="Galería" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-void/20" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Reserva ── */}
        <section className="py-20 md:py-28 px-4 md:px-10 bg-void border-t border-white/5 text-center">
          <div className="max-w-sm md:max-w-lg mx-auto bg-carbon border border-onyx p-7 md:p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 to-transparent pointer-events-none" />
            <Calendar className="w-10 h-10 md:w-14 md:h-14 text-amber-400 mx-auto mb-5" />
            <h2 className="font-display font-black text-2xl md:text-4xl text-white mb-6 relative z-10">Pide tu cita.</h2>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'barberia' } }))}
              className="relative z-10 w-full md:w-auto px-8 py-3.5 md:px-10 md:py-4 bg-amber-400 text-void font-bold uppercase tracking-widest text-xs md:text-sm rounded-full hover:bg-amber-300 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-400/20"
            >
              Abrir Calendario
            </button>
          </div>
        </section>

      </div>
    </RootLayout>
  );
}
