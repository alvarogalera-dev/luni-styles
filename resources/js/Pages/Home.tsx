import RootLayout from '@/Layouts/RootLayout';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, Fragment } from 'react';
import { Link } from '@inertiajs/react';

interface Meta {
  title: string;
  description: string;
}

interface Props {
  meta: Meta;
}

export default function Home({ meta }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <RootLayout meta={meta}>
      {/* ── Hero Video Background (Light & Dark Mix) ── */}
      <div ref={containerRef} className="relative h-screen overflow-hidden bg-void">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          {/* Split background fallback */}
          <div className="absolute inset-0 flex">
             <div className="w-1/2 h-full bg-carbon" />
             <div className="w-1/2 h-full bg-white" />
          </div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
          >
            {/* Video abstracto elegante */}
            <source src="https://cdn.pixabay.com/video/2015/10/24/1109-143167194_large.mp4" type="video/mp4" />
          </video>
          {/* Degradado sobre el video: oscuro a la izquierda, transición a blanco, terminando en verde claro (KIDS) a la derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-white to-emerald-100/90 mix-blend-multiply opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-emerald-50/80" />
        </motion.div>

        {/* ── Hero Content ── */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center mt-8 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="space-y-4 md:space-y-6 max-w-4xl bg-black/40 backdrop-blur-md p-6 md:p-16 rounded-3xl border border-white/20 shadow-2xl mx-4"
          >
            <p className="text-amber-400 font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm drop-shadow-md">
              Tradición y Pasión
            </p>
            <h1 className="font-display font-black text-4xl md:text-7xl lg:text-8xl tracking-tighter text-bone drop-shadow-2xl leading-[1.1]">
              <span className="text-white">DOS</span> MUNDOS.<br />
              <span className="text-emerald-400">UNA</span> <span className="text-amber-400">FAMILIA</span>.
            </h1>
            <p className="text-white/90 text-sm md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Un proyecto nacido del amor por nuestro trabajo. Una peluquería infantil y una barbería clásica, unidas en un mismo espacio en Alcantarilla, Murcia.
            </p>
          </motion.div>
        </div>


      </div>

      {/* ── Intro Text (White Block) ── */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-white relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="font-display font-black text-3xl md:text-5xl text-slate-900 tracking-tighter">
            Nuestra Historia.
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed px-4">
            Somos un negocio familiar impulsado por dos generaciones. Una madre venezolana con años de experiencia y verdadera vocación por la peluquería infantil, y su hijo de 19 años, dedicado en cuerpo y alma al arte de la barbería. A él se le suma un gran amigo y compañero, también venezolano, para ofrecer el mejor servicio de barbería en nuestro centro. Dos mundos que se encuentran para ofrecer una experiencia única para todas las edades.
          </p>
        </div>
      </section>

      {/* ── Dual Concept Section ── */}
      <section className="relative z-20 bg-void">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
          
          {/* Lado Barbería (Oscuro) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="h-full flex flex-col"
          >
            <Link 
              href="/la-barberia"
              className="flex-1 flex flex-col items-center justify-center p-10 lg:p-24 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/5 relative group overflow-hidden cursor-pointer text-center transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-carbon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 text-center max-w-sm space-y-6">
                <h2 className="font-display font-black text-4xl md:text-5xl text-bone tracking-tighter uppercase transition-transform duration-300 group-hover:scale-105">
                  La Barbería
                </h2>
                <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
                <p className="text-ash text-sm md:text-base leading-relaxed">
                  Cortes clásicos, degradados precisos y arreglo de barba profesional. Un espacio dedicado al cuidado masculino, donde la técnica y la dedicación marcan la diferencia en cada servicio.
                </p>
                <span className="inline-block mt-4 px-8 py-3 md:py-4 bg-white/5 group-hover:bg-white/15 border border-white/10 rounded-full text-bone text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg">
                  Reservar Cita
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Lado Infantil (Claro) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="h-full flex flex-col"
          >
            <Link 
              href="/peluqueria-infantil"
              className="flex-1 flex flex-col items-center justify-center p-10 lg:p-24 bg-[#f8fafc] relative group overflow-hidden cursor-pointer text-center transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 text-center max-w-sm space-y-6">
                <h2 className="font-display font-black text-4xl md:text-5xl text-[#0f172a] tracking-tighter uppercase transition-transform duration-300 group-hover:scale-105">
                  Infantil
                </h2>
                <div className="w-12 h-1 bg-emerald-400 mx-auto rounded-full" />
                <p className="text-[#475569] text-sm md:text-base leading-relaxed">
                  Un entorno seguro y divertido diseñado especialmente para los más pequeños. Con la paciencia y el cariño que requieren, convertimos el corte de pelo en una experiencia positiva y agradable.
                </p>
                <span className="inline-block mt-4 px-8 py-3 md:py-4 bg-[#0f172a] group-hover:bg-[#1e293b] text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-xl shadow-slate-200">
                  Reservar Cita
                </span>
              </div>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ── Carrusel de Reseñas (Oculto temporalmente hasta la apertura del martes 22 de septiembre) ── */}
      {/*
      <section className="py-20 md:py-32 bg-[#0a0a0a] text-bone border-t border-white/5 overflow-hidden flex flex-col items-center">
        <div className="max-w-7xl mx-auto w-full px-6 mb-12">
          <h2 className="text-center font-display font-black text-3xl md:text-5xl mb-4">Lo que dice la calle</h2>
          <p className="text-center text-steel text-sm md:text-base">Y las mamás también.</p>
        </div>

        <div className="relative w-full overflow-hidden flex">
          <div className="absolute top-0 left-0 w-24 md:w-64 h-full bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 md:w-64 h-full bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            className="flex gap-6 w-max"
          >
            {[...Array(2)].map((_, arrayIndex) => (
              <React.Fragment key={arrayIndex}>
                {[
                  { name: "Alejandro M.", type: "Barbería", text: "Estos chavales con 19 años cortan mejor que mucha gente que lleva 20 años en esto. El fade espectacular y el rollo del local mola mucho." },
                  { name: "Laura G.", type: "Infantil", text: "Llevé a mi hijo de 3 años que siempre monta unos pollos tremendos. La chica tuvo una paciencia infinita. Salió súper contento con su piruleta." },
                  { name: "David S.", type: "Barbería", text: "El mejor sitio de Alcantarilla sin duda. Llego, me tomo algo, buena charla y salgo niquelao." },
                  { name: "María P.", type: "Infantil", text: "Un acierto total. El espacio es súper bonito, lleno de luz y el trato a los niños es un 10. Mi hija no quiere ir a otra peluquería." },
                  { name: "Carlos R.", type: "Barbería", text: "Fui por primera vez recomendado por un colega y ya no cambio. Ambiente de 10 y el corte impecable. Tienen mucho talento." },
                  { name: "Sofía T.", type: "Infantil", text: "Me encanta que tengan dos zonas tan diferenciadas. Mi niño se lo pasó genial con los juguetes y yo estuve súper tranquila." },
                  { name: "Javier L.", type: "Barbería", text: "Si buscas un buen fade y que te arreglen la barba en condiciones, este es el lugar. Profesionales y súper rápidos." },
                  { name: "Elena V.", type: "Infantil", text: "Tienen un tacto increíble con los bebés. Fue su primer corte y hasta le dieron un diploma de recuerdo. ¡Un detallazo!" }
                ].map((review, i) => (
                  <div key={i} className="w-[300px] md:w-[400px] bg-carbon p-6 md:p-8 rounded-2xl border border-onyx shrink-0 flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => <span key={j} className="text-amber-400">★</span>)}
                    </div>
                    <p className="text-steel text-sm leading-relaxed mb-6 italic">"{review.text}"</p>
                    <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                      <p className="font-bold text-sm text-bone">{review.name}</p>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${review.type === 'Barbería' ? 'bg-amber-400/10 text-amber-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                        {review.type}
                      </span>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>
      */}
      
    </RootLayout>
  );
}
