import RootLayout from '@/Layouts/RootLayout';
import SequenceScroll from '@/Components/SequenceScroll';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';

// Promo de inauguración: 28 Sep 2026 – 12 Oct 2026 (zona horaria CET/CEST)
function isOpeningPromoActive(): boolean {
  const now = new Date();
  const promoStart = new Date('2026-09-28T00:00:00+02:00');
  const promoEnd   = new Date('2026-10-12T00:01:00+02:00');
  return now >= promoStart && now < promoEnd;
}

interface Meta { title: string; description: string; }
interface Props { meta: Meta; services?: any[]; products?: any[]; localMedia?: any[]; }

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

// Services are passed dynamically

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
function GalleryCarousel({ localMedia }: { localMedia: any[] }) {
  // Fallback to static if empty
  const defaultMedia = [
    { type: 'image', url: '', fallbackUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop' },
    { type: 'image', url: '', fallbackUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop' },
    { type: 'image', url: '', fallbackUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop' },
  ];
  const items = localMedia.length > 0 ? [...localMedia, ...localMedia, ...localMedia] : [...defaultMedia, ...defaultMedia, ...defaultMedia];

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
        {items.map((item, i) => {
          const src = item.url ? (item.url.startsWith('http') || item.url.startsWith('/') ? item.url : `/storage/${item.url}`) : item.fallbackUrl;
          return (
            <div
              key={i}
              className="shrink-0 w-[78vw] sm:w-[55vw] md:w-[38vw] lg:w-[30vw] h-[220px] md:h-[380px] rounded-2xl overflow-hidden relative bg-carbon"
            >
              {item.type === 'image' ? (
                <img
                  src={src}
                  alt={item.title || "Galería Barbería"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <video
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-void/10" />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function LaBarberia({ meta, services = [], products = [], localMedia = [] }: Props) {
  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: '-10%' });
  const promoActive = isOpeningPromoActive();

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

            {/* Banner promo inauguración */}
            {promoActive && (
              <div className="mb-8 p-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl flex items-start gap-3">
                <Tag className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-400 font-bold text-sm">🎉 Precio Especial de Inauguración</p>
                  <p className="text-amber-300/80 text-xs mt-1">Precios rebajados durante nuestras 2 primeras semanas. Oferta válida hasta el <strong>Lunes 12 de octubre de 2026</strong>. ¡Aprovecha y reserva ya!</p>
                </div>
              </div>
            )}

            {/* Mobile: vertical stack | Tablet+: grid 3 cols */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-5 md:gap-8">
              {services.map((svc, i) => {
                const imgUrl = svc.photo_url ? (svc.photo_url.startsWith('http') ? svc.photo_url : `/storage/${svc.photo_url}`) : 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop';
                return (
                  <button
                    key={i}
                    onClick={() => document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'barberia', preSelectedService: svc } }))}
                    className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors text-left w-full"
                  >
                    <div className="h-44 md:h-56 overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={svc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                  <div className="p-5 md:p-7">
                      {/* Name & price on same row */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg md:text-2xl font-display font-bold leading-tight">{svc.name}</h3>
                        <div className="shrink-0 ml-2 text-right flex flex-col items-end">
                          {svc.promo_price && svc.promo_price !== svc.price ? (
                            <>
                              <span className="text-steel/50 line-through text-xs">{svc.price}€</span>
                              <span className="text-xl md:text-2xl font-black text-amber-400">{svc.promo_price}€</span>
                            </>
                          ) : (
                            <span className="text-xl md:text-2xl font-black text-amber-400">{svc.price !== 'Consultar' ? `${svc.price}€` : svc.price}</span>
                          )}
                        </div>
                      </div>
                      {/* Duration */}
                      <div className="flex items-center gap-1.5 text-steel text-[10px] uppercase tracking-wider mb-3">
                        <Clock className="w-3 h-3 shrink-0" />
                        {svc.duration_label || `${svc.duration_minutes} min`}
                      </div>
                      {/* Includes */}
                      <p className="text-ash text-xs md:text-sm leading-relaxed">{svc.description}</p>
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
              {products.map((prod, i) => {
                const imgUrl = prod.photo_url ? (prod.photo_url.startsWith('http') || prod.photo_url.startsWith('/') ? prod.photo_url : `/storage/${prod.photo_url}`) : 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop';
                return (
                  <div key={i} className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors flex flex-col sm:flex-row">
                    <div className="h-48 sm:h-auto sm:w-2/5 overflow-hidden bg-white/5">
                      <img
                        src={imgUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 md:p-7 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg md:text-xl font-display font-bold leading-tight">{prod.name}</h3>
                        <span className="text-xl font-black text-amber-400 shrink-0 ml-2">{prod.price}€</span>
                      </div>
                      <p className="text-amber-400/80 text-[10px] uppercase tracking-wider mb-3">{prod.tag} &nbsp;<span className="text-white/30">·</span>&nbsp; <span className="text-white/40">Comprar en tienda</span></p>
                      <p className="text-ash text-xs md:text-sm leading-relaxed">
                        {prod.description}
                      </p>
                    </div>
                  </div>
                );
              })}
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
          <GalleryCarousel localMedia={localMedia} />
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
