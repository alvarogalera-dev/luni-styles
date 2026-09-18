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
    duration: '15 – 30 min',
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

      <div className="relative z-10 bg-white text-slate-800 -mt-[1px]">

        {/* ── Servicios ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 border-t border-emerald-100 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 text-center">
              <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Lo que hacemos</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-slate-900">Nuestros Servicios.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((svc, i) => (
                <div key={i} className="group relative bg-white border border-emerald-100 rounded-2xl overflow-hidden hover:border-emerald-300 transition-colors shadow-sm hover:shadow-xl hover:shadow-emerald-100/50">
                  <div className="h-48 md:h-64 overflow-hidden bg-slate-100">
                    <img src={svc.img} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-3">{svc.name}</h3>
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

        {/* ── La Peluquera ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16">
              <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">El Equipo</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-slate-900">La Peluquera.</h2>
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
                  <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-white rounded-2xl flex items-center justify-center font-display font-black text-5xl sm:text-6xl text-emerald-200 group-hover:text-emerald-400 transition-colors shadow-inner">
                    {member.name[0]}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">{member.name}</h3>
                    <p className="text-emerald-600 font-bold text-[10px] tracking-widest uppercase mt-1 mb-2">{member.role}</p>
                    <p className="text-slate-600 text-sm">{member.specialty}</p>
                    <p className="text-slate-500 text-xs mt-2 italic">{member.years} de experiencia.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Galería (Carrusel animado como La Barbería) ── */}
        <section className="py-20 md:py-24 overflow-hidden border-t border-emerald-100 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto px-4 md:px-10 mb-12 text-center">
            <h2 className="font-display font-black text-4xl md:text-5xl text-slate-900 tracking-tighter">El Local.</h2>
            <p className="text-slate-500 mt-4 text-sm">Nuestro segundo hogar.</p>
          </div>

          {/* Marquee infinito */}
          <div className="relative w-full overflow-hidden">
            {/* Sombra fundido bordes */}
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-emerald-50/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-emerald-50/30 to-transparent z-10 pointer-events-none" />

            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
              className="flex gap-4 md:gap-6 w-max"
            >
              {[...gallery, ...gallery].map((img, i) => (
                <div
                  key={i}
                  className="w-[80vw] md:w-[550px] h-[280px] md:h-[420px] shrink-0 rounded-2xl overflow-hidden shadow-lg"
                >
                  <img src={img} alt="Galería" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Reserva Calendario ── */}
        <section className="py-24 md:py-32 px-4 md:px-10 bg-emerald-50 border-t border-emerald-100 text-center">
          <div className="max-w-3xl mx-auto bg-white border border-emerald-100 p-8 md:p-12 rounded-[2rem] relative overflow-hidden shadow-xl shadow-emerald-900/5">
            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="font-display font-black text-3xl md:text-5xl text-slate-900 mb-8 relative z-10">Pide tu cita.</h2>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'infantil' } }))}
              className="relative z-10 px-8 py-3 md:px-10 md:py-4 bg-emerald-500 text-white font-bold uppercase tracking-widest text-[10px] md:text-sm rounded-full hover:bg-emerald-400 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
            >
              Abrir Calendario
            </button>
          </div>
        </section>

      </div>
    </RootLayout>
  );
}
