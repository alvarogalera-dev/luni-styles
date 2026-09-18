import RootLayout from '@/Layouts/RootLayout';
import KidsScrollAnimation from '@/Components/KidsScrollAnimation';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const team = [
  { name: 'Mariely', role: 'Peluquera', years: '5+ años', specialty: 'Especialista en corte y peinado infantil' },
];

const services = [
  {
    name: 'Corte Infantil',
    duration: '30 – 60 min',
    desc: 'Corte profesional para niños, niñas y adolescentes. Adaptado a cada edad y tipo de cabello, con la paciencia que el momento requiere.',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Peinados',
    duration: '30 – 60 min',
    desc: 'Trenzas, coletas, ondas y peinados especiales para niñas. Perfectos para el día a día, comuniones, fiestas y cualquier ocasión especial.',
    img: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Accesorios',
    duration: 'Sin espera',
    desc: 'Coletas, lazos, broches, brillos y todo tipo de accesorios para terminar el look con ese toque especial que las pequeñas adoran.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
  },
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
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-3">{svc.name}</h3>
                    <div className="flex items-center gap-2 text-steel text-[10px] uppercase tracking-wider mb-4 font-bold">
                      <Clock className="w-3 h-3" /> {svc.duration}
                    </div>
                    <p className="text-ash text-sm md:text-base leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── La Peluquera ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 bg-[#111]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16">
              <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">El Equipo</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-white">La Peluquera.</h2>
            </div>

            <div ref={teamRef} className="max-w-xl">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={teamInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  className="group flex flex-col sm:flex-row gap-6 bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 hover:border-amber-400/30 transition-all duration-500 text-center sm:text-left items-center sm:items-start"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-carbon rounded-xl flex items-center justify-center font-display font-black text-5xl sm:text-6xl text-white/5 group-hover:text-amber-400/10 transition-colors">
                    {member.name[0]}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-bone tracking-tight">{member.name}</h3>
                    <p className="text-amber-400 text-[10px] tracking-widest uppercase mt-1 mb-2">{member.role}</p>
                    <p className="text-steel text-sm">{member.specialty}</p>
                    <p className="text-ash text-xs mt-2 italic">{member.years} de experiencia.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Galería ── */}
        <section className="py-20 md:py-24 overflow-hidden border-t border-white/5 bg-[#111]">
          <div className="max-w-7xl mx-auto px-4 md:px-10 mb-12 text-center">
            <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tighter">El Local.</h2>
            <p className="text-steel mt-4 text-sm">Nuestro segundo hogar.</p>
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
            <p className="text-ash text-sm md:text-base mb-8 relative z-10">Reserva el hueco que mejor te venga.</p>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'infantil' } }))}
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
