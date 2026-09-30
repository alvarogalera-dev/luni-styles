import RootLayout from '@/Layouts/RootLayout';
import KidsScrollAnimation from '@/Components/KidsScrollAnimation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; services?: any[]; catalogPhotos?: any[]; localMedia?: any[]; }

const team = [
  { name: 'Mariely', role: 'CEO & PELUQUERA', years: '50 años', specialty: 'CORTES INFANTILES', initial: 'M' },
];

// Services and media are passed dynamically

export default function PeluqueriaInfantil({ meta, services = [], catalogPhotos = [], localMedia = [] }: Props) {
  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: '-10%' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <RootLayout meta={meta}>

      {/* ── Kids Scroll Animation ── */}
      <KidsScrollAnimation />

      <div className="relative z-10 bg-white text-slate-800 -mt-[1px]">

        {/* ── El Catálogo (PRIMERO, justo después del scroll) ── */}
        <section className="py-20 md:py-28 px-4 md:px-10 bg-white border-t border-emerald-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Inspiración</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-slate-900 mb-4">El Catálogo.</h2>
              <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                ¿No sabéis qué hacerle? Aquí os dejamos algunas de nuestras creaciones para que podáis traerlas de referencia. ¡Nuestras peques siempre salen guapísimas!
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {catalogPhotos.map((photo, index) => {
                const imgUrl = photo.url ? (photo.url.startsWith('http') || photo.url.startsWith('/') ? photo.url : `/storage/${photo.url}`) : `/images/catalogo/${(index % 12) + 1}.jpg`;
                return (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-100/60 transition-all duration-500 w-full text-left"
                  >
                    <img
                      src={imgUrl}
                      alt={photo.caption || 'Catálogo'}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                        Ver inspiración
                      </span>
                    </div>
                    <div className="absolute top-2 left-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-md">
                        #STYLE-{photo.id.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <p className="text-slate-400 text-xs md:text-sm">
                Trae cualquiera de estas fotos como referencia o dínos en qué estáis pensando y lo hacemos realidad 😊
              </p>
            </div>
          </div>
        </section>

        {/* ── Servicios ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 border-t border-emerald-100 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 text-center">
              <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">Lo que hacemos</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-slate-900">Nuestros Servicios.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((svc, i) => {
                const imgUrl = svc.photo_url ? (svc.photo_url.startsWith('http') || svc.photo_url.startsWith('/') ? svc.photo_url : `/storage/${svc.photo_url}`) : 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop';
                return (
                  <button
                    key={i}
                    onClick={() => document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'infantil', preSelectedService: svc } }))}
                    className="group relative bg-white border border-emerald-100 rounded-2xl overflow-hidden hover:border-emerald-300 transition-colors shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 text-left w-full"
                  >
                    <div className="h-48 md:h-64 overflow-hidden bg-slate-100">
                      <img src={imgUrl} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-3">{svc.name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-wider mb-2 font-bold">
                        <Clock className="w-3 h-3" /> {svc.duration_label || `${svc.duration_minutes} min`}
                      </div>
                      <p className="text-emerald-600/80 text-[10px] uppercase tracking-wider mb-3 font-bold">
                        Horario &nbsp;<span className="text-slate-300">·</span>&nbsp; <span className="text-slate-400">16:00 – 21:00 · L–V</span>
                      </p>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">{svc.description}</p>
                      <span className="mt-4 inline-block text-[10px] font-bold tracking-widest uppercase text-emerald-500/60 group-hover:text-emerald-500 transition-colors">Reservar →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── La Peluquera ── */}
        <section className="py-20 md:py-24 px-4 md:px-10 bg-white border-t border-emerald-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16">
              <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">El Equipo</p>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-slate-900">La Peluquera.</h2>
            </div>
            <div ref={teamRef} className="grid grid-cols-1 gap-4 md:gap-6 max-w-sm">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                  className="group flex flex-col items-center text-center gap-4 bg-white rounded-2xl border border-emerald-400 p-6 hover:border-emerald-500 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-emerald-50 rounded-full flex items-center justify-center font-display font-black text-4xl md:text-5xl text-emerald-200 group-hover:text-emerald-400/50 transition-colors border border-emerald-100">
                    {member.initial}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 tracking-tight">{member.name}</h3>
                    <p className="text-emerald-600 font-bold text-[10px] tracking-widest uppercase mt-1">{member.role}</p>
                    <p className="text-slate-600 text-xs mt-2 tracking-wide font-medium">{member.specialty}</p>
                    <p className="text-slate-500 text-xs mt-1">{member.years}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── El Local (galería carrusel) ── */}
        <section className="py-20 md:py-24 overflow-hidden border-t border-emerald-100 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto px-4 md:px-10 mb-12 text-center">
            <h2 className="font-display font-black text-4xl md:text-5xl text-slate-900 tracking-tighter">El Local.</h2>
            <p className="text-slate-500 mt-4 text-sm">Nuestro segundo hogar.</p>
          </div>
            <div className="relative w-full overflow-hidden">
              <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-emerald-50/30 to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-emerald-50/30 to-transparent z-10 pointer-events-none" />
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
                className="flex gap-4 md:gap-6 w-max"
              >
                {(() => {
                  const defaultMedia = [{ media_type: 'photo', url: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=1200&auto=format&fit=crop', caption: 'Peluquería Infantil' }];
                  const itemsToRender = localMedia.length > 0 ? localMedia : defaultMedia;
                  return [...itemsToRender, ...itemsToRender, ...itemsToRender, ...itemsToRender].map((media, i) => {
                    const src = media.url ? (media.url.startsWith('http') || media.url.startsWith('/') ? media.url : `/storage/${media.url}`) : 'https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=1200&auto=format&fit=crop';
                    return (
                    <div
                      key={i}
                      className="w-[80vw] md:w-[550px] h-[280px] md:h-[420px] shrink-0 rounded-2xl overflow-hidden shadow-lg"
                    >
                      {media.media_type === 'video' || media.type === 'video' ? (
                        <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={src} alt={media.caption || "Galería local peluquería infantil"} className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                  );
                  });
                })()}
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
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full text-slate-800 hover:bg-white hover:text-emerald-600 transition-colors shadow-sm"
              >
                <X size={20} strokeWidth={3} />
              </button>
              
              <div className="aspect-[4/5] sm:aspect-square w-full bg-slate-100 relative">
                <img
                  src={selectedImage}
                  alt="Inspiración Infantil"
                  className="w-full h-full object-contain sm:object-cover"
                />
              </div>
              
              <div className="p-6 md:p-8 text-center bg-emerald-50">
                <p className="text-emerald-600 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2">Referencia del Corte</p>
                <h3 className="font-display font-black text-3xl text-slate-900 mb-4">#STYLE-{selectedImage.toString().padStart(2, '0')}</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  ¿Te gusta este peinado? Dínos este código al reservar o enséñanos la foto cuando vengas a visitarnos.
                </p>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setTimeout(() => {
                      document.dispatchEvent(new CustomEvent('openBookingModal', { detail: { serviceType: 'infantil' } }));
                    }, 300);
                  }}
                  className="mt-6 inline-flex items-center justify-center px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-widest uppercase text-xs rounded-full transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95"
                >
                  Reservar Ahora
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </RootLayout>
  );
}
