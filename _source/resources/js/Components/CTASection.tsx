import { Link } from '@inertiajs/react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function CTASection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section
      ref={ref}
      className="relative py-36 md:py-48 px-6 md:px-10 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Base */}
        <div className="absolute inset-0" style={{ background: '#0a0a0a' }} />
        {/* Animated copper blobs */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 40% 60% at 20% 50%, rgba(205,127,50,0.12) 0%, transparent 70%)',
              'radial-gradient(ellipse 50% 70% at 80% 50%, rgba(205,127,50,0.14) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 60% at 50% 30%, rgba(205,127,50,0.10) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 60% at 20% 50%, rgba(205,127,50,0.12) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(205,127,50,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(205,127,50,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #0a0a0a 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.p
          className="text-copper-400 text-xs tracking-ultra uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          ¿Listo para el cambio?
        </motion.p>

        <motion.h2
          className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tightest leading-none text-bone mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
        >
          RESERVA<br />
          <span className="text-shimmer">TU CITA</span>
        </motion.h2>

        <motion.p
          className="text-ash text-lg mb-12 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Selecciona tu servicio, elige a tu barbero y escoge el horario que mejor te va.
          Sin esperas, sin sorpresas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/reservas"
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #cd7f32, #e8a87c)',
              boxShadow:  '0 0 50px rgba(205,127,50,0.35)',
            }}
          >
            <span className="relative z-10 text-void font-display font-bold text-sm tracking-widest uppercase">
              Reservar Ahora
            </span>
            <motion.span
              className="relative z-10 text-void text-lg"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #e8a87c, #cd7f32)' }}
            />
          </Link>

          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-5 rounded-full border border-border text-ash text-sm tracking-widest uppercase hover:border-copper-500/40 hover:text-bone transition-all duration-300"
          >
            Contactar
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
