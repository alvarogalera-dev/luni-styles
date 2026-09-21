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
    role: 'CEO & BARBERO',
    age: '19 años',
    specialty: 'Fades · Barba',
    initial: 'L',
  },
  {
    name: 'Carlos',
    role: 'BARBERO',
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
    img: '/images/fade.webp',
  },
  {
    name: 'Corte + Barba',
    price: '15€',
    duration: '45–60 min',
    includes: 'Corte de pelo · Lavado · Cejas · Barba',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Barba',
    price: '4€',
    duration: '15–30 min',
    includes: 'Arreglo de barba',
    img: '/images/barba.avif',
  },
];

// Carrusel: 3 fotos + 1 video, se repiten para scroll infinito
const CAROUSEL_ITEMS = [
  {
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop',
    alt: 'El local - barbería',
  },
  {
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop',
    alt: 'El local - corte',
  },
  {
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop',
    alt: 'El local - barba',
  },
  {
    type: 'video' as const,
    src: 'https://cdn.pixabay.com/video/2022/09/14/131481-750374874_large.mp4',
    alt: 'El local - ambiente',
  },
];

// ─── Carrusel automático infinito ─────────────────────────────────────────────
function GalleryCarousel() {
  // Duplicamos los items para el truco de scroll infinito sin saltos
  const items = [...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS];

  return (
    <div className="relative w-full overflow-hidden flex">
      {/* Sombras laterales */}
      <div className="absolute top-0 left-0 w-12 md:w-32 h-full bg-gradient-to-r from-[#111] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-12 md:w-32 h-full bg-gradient-to-l from-[#111] to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 28,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex gap-3 md:gap-5 w-max"
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="shrink-0 w-[78vw] sm:w-[55vw] md:w-[38vw] lg:w-[30vw] h-[220px] md:h-[380px] rounded-2xl overflow-hidden relative bg-carbon"
          >
            {item.type === 'image' ? (
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <video
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-void/10" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

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
              {services.map((svc, i) => {
                // Map service index to modal service id
                const serviceIds = ['b1', 'b2', 'b3'];
                const BARBERIA_SERVICES = [
                  { id: 'b1', name: 'Corte Normal', subtitle: 'Corte de pelo, lavado y arreglo de cejas.', duration: 30, durationLabel: '30 min', price: 12 },
                  { id: 'b2', name: 'Corte + Barba', subtitle: 'Corte completo más arreglo y perfilado de barba con navaja y productos premium.', duration: 60, durationLabel: '45–60 min', price: 15 },
                  { id: 'b3', name: 'Solo Barba', subtitle: 'Arreglo, perfilado y acabado de barba.', duration: 20, durationLabel: '15–30 min', price: 4 },
                ];
                const modalSvc = BARBERIA_SERVICES[i];
                return (
                  <button
                    key={i}
                    onClick={() => document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'barberia', preSelectedService: modalSvc } }))}
                    className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors text-left w-full"
                  >
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
                      <span className="mt-4 inline-block text-[10px] font-bold tracking-widest uppercase text-amber-400/60 group-hover:text-amber-400 transition-colors">Reservar →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── La Tienda ── */}
        <section className="py-16 md:py-24 px-4 md:px-10 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 md:mb-16 text-center">
              <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Nuestro Escaparate</p>
              <h2 className="font-display font-black text-3xl md:text-6xl tracking-tighter text-white">La Tienda.</h2>
            </div>
            
            <div className="flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-8 max-w-4xl mx-auto">
              {/* Producto Rojo */}
              <div className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors flex flex-col sm:flex-row">
                <div className="h-48 sm:h-auto sm:w-2/5 overflow-hidden bg-white/5">
                  <img
                    src="/products/redone-aqua-hair-red.png"
                    alt="RedOne Aqua Hair Wax Roja"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 md:p-7 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-display font-bold leading-tight">RedOne Aqua Hair Wax</h3>
                    <span className="text-xl font-black text-amber-400 shrink-0 ml-2">6€</span>
                  </div>
                  <p className="text-amber-400/80 text-[10px] uppercase tracking-wider mb-3">Cera &nbsp;<span className="text-white/30">·</span>&nbsp; <span className="text-white/40">Comprar en tienda</span></p>
                  <p className="text-ash text-xs md:text-sm leading-relaxed">
                    Fijación extrema y brillo duradero. Fórmula a base de agua ideal para peinados que necesitan máxima sujeción sin dejar residuos.
                  </p>
                </div>
              </div>

              {/* Producto Negro */}
              <div className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors flex flex-col sm:flex-row">
                <div className="h-48 sm:h-auto sm:w-2/5 overflow-hidden bg-white/5">
                  <img
                    src="/products/redone-aqua-hair-black.png"
                    alt="RedOne Black Gel Wax"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 md:p-7 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-display font-bold leading-tight">RedOne Black Gel Wax</h3>
                    <span className="text-xl font-black text-amber-400 shrink-0 ml-2">6€</span>
                  </div>
                  <p className="text-amber-400/80 text-[10px] uppercase tracking-wider mb-3">Gel Fijador &nbsp;<span className="text-white/30">·</span>&nbsp; <span className="text-white/40">Comprar en tienda</span></p>
                  <p className="text-ash text-xs md:text-sm leading-relaxed">
                    Fijación fuerte con acabado natural. Efecto gel que proporciona un look estructurado y limpio durante todo el día.
                  </p>
                </div>
              </div>

              {/* Gafas 1 */}
              <div className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors flex flex-col sm:flex-row">
                <div className="h-48 sm:h-auto sm:w-2/5 overflow-hidden bg-white/5">
                  <img
                    src="/images/gafas2.jpg"
                    alt="Gafas Classic Blue"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 md:p-7 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-display font-bold leading-tight">Gafas Classic Blue</h3>
                    <span class="text-xl font-black text-amber-400 shrink-0 ml-2">6€</span>
                  </div>
                  <p className="text-amber-400/80 text-[10px] uppercase tracking-wider mb-3">Gafas &nbsp;<span className="text-white/30">·</span>&nbsp; <span className="text-white/40">Comprar en tienda</span></p>
                  <p className="text-ash text-xs md:text-sm leading-relaxed">
                    Montura clásica de acetato negro con cristales tintados en azul para un look atemporal.
                  </p>
                </div>
              </div>

              {/* Gafas 2 */}
              <div className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors flex flex-col sm:flex-row">
                <div className="h-48 sm:h-auto sm:w-2/5 overflow-hidden bg-white/5">
                  <img
                    src="/images/gafas1.png"
                    alt="Gafas Clear Ice"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 md:p-7 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-display font-bold leading-tight">Gafas Clear Ice</h3>
                    <span class="text-xl font-black text-amber-400 shrink-0 ml-2">6€</span>
                  </div>
                  <p className="text-amber-400/80 text-[10px] uppercase tracking-wider mb-3">Gafas &nbsp;<span className="text-white/30">·</span>&nbsp; <span className="text-white/40">Comprar en tienda</span></p>
                  <p className="text-ash text-xs md:text-sm leading-relaxed">
                    Diseño moderno con montura transparente y cristales azules, perfectas para destacar.
                  </p>
                </div>
              </div>

              {/* Gafas 3 */}
              <div className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors flex flex-col sm:flex-row">
                <div className="h-48 sm:h-auto sm:w-2/5 overflow-hidden bg-white/5">
                  <img
                    src="/images/gafas3.png"
                    alt="Gafas Retro Amber"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 md:p-7 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-display font-bold leading-tight">Gafas Retro Amber</h3>
                    <span class="text-xl font-black text-amber-400 shrink-0 ml-2">6€</span>
                  </div>
                  <p className="text-amber-400/80 text-[10px] uppercase tracking-wider mb-3">Gafas &nbsp;<span className="text-white/30">·</span>&nbsp; <span className="text-white/40">Comprar en tienda</span></p>
                  <p className="text-ash text-xs md:text-sm leading-relaxed">
                    Estilo vintage de montura negra y cristales ámbar, protegiendo tus ojos con elegancia y carácter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── El Equipo ── */}
        <section className="py-16 md:py-24 px-4 md:px-10 bg-[#111] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 md:mb-16">
              <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Los Barberos</p>
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
                    <p className="text-ash text-xs mt-2 tracking-wide">{member.specialty}</p>
                    <p className="text-steel text-xs mt-1">{member.age}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Galería — Carrusel Automático ── */}
        <section className="py-16 md:py-24 overflow-hidden border-t border-white/5 bg-[#111]">
          <div className="max-w-7xl mx-auto px-4 md:px-10 mb-10 md:mb-12 text-center">
            <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tighter">El Local.</h2>
            <p className="text-steel mt-3 text-sm">Nuestro segundo hogar.</p>
          </div>
          <GalleryCarousel />
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
