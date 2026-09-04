import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function KidsScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Animaciones basadas en scroll de 0 a 1
  const xOffset = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // Viento animado que baja con el scroll
  const windY = useTransform(scrollYProgress, [0, 1], [0, 800]);

  return (
    <div ref={containerRef} className="relative h-[200vh] bg-emerald-50">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Text */}
        <motion.div style={{ y: yParallax }} className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <h1 className="font-display font-black text-[15vw] tracking-tighter text-emerald-100 opacity-60 whitespace-nowrap">
            KIDS
          </h1>
        </motion.div>

        {/* Viento animado (Líneas / Partículas) */}
        <motion.div style={{ y: windY, rotate }} className="absolute z-0 flex flex-col gap-6 -mt-[40vh] md:-mt-[60vh]">
          <div className="w-2 h-32 bg-gradient-to-b from-transparent to-emerald-400 rounded-full ml-12 blur-[2px]" />
          <div className="w-2 h-48 bg-gradient-to-b from-transparent to-amber-400 rounded-full -ml-8 blur-[2px]" />
          <div className="w-2 h-24 bg-gradient-to-b from-transparent to-rose-400 rounded-full ml-20 blur-[2px]" />
          <div className="w-2 h-40 bg-gradient-to-b from-transparent to-sky-400 rounded-full -ml-16 blur-[2px]" />
        </motion.div>

        {/* Secador SVG Avanzado */}
        <motion.div 
          style={{ x: xOffset, rotate, willChange: 'transform' }} 
          className="relative z-10 drop-shadow-2xl w-64 h-64 md:w-96 md:h-96 flex items-center justify-center origin-center"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cable */}
            <path d="M50 85 Q60 110, 30 110" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Mango */}
            <rect x="42" y="50" width="16" height="38" rx="6" fill="#14b8a6" />
            {/* Botones */}
            <rect x="40" y="55" width="4" height="10" rx="2" fill="#0f766e" />
            <rect x="40" y="70" width="4" height="6" rx="2" fill="#ef4444" />
            {/* Cuerpo principal */}
            <path d="M25 25 H75 A15 15 0 0 1 90 40 V40 A15 15 0 0 1 75 55 H25 A15 15 0 0 1 10 40 V40 A15 15 0 0 1 25 25 Z" fill="#ffffff" />
            {/* Rejilla Trasera */}
            <circle cx="25" cy="40" r="12" fill="#cbd5e1" />
            <circle cx="25" cy="40" r="10" fill="#94a3b8" />
            <circle cx="25" cy="40" r="6" fill="#475569" />
            <circle cx="25" cy="40" r="2" fill="#1e293b" />
            {/* Boquilla delantera */}
            <path d="M90 32 L102 24 V56 L90 48 Z" fill="#fbbf24" />
            {/* Detalles cuerpo / Brillos */}
            <line x1="45" y1="28" x2="45" y2="52" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="28" x2="60" y2="52" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
            <path d="M25 28 H75" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
        
        {/* Floating elements (bubbles) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-emerald-300 bg-emerald-100/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                width: `${10 + Math.random() * 30}px`,
                height: `${10 + Math.random() * 30}px`,
                willChange: 'transform, opacity'
              }}
              animate={{
                y: '-120vh',
                x: (Math.random() - 0.5) * 100,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
