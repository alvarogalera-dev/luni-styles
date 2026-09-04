import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScissorScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Calculate rotation for blades based on scroll progress
  // At 0 scroll: closed (0 deg). At 0.5 scroll: open (30 deg). At 1: closed (0 deg).
  const angle = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -35, 0]);
  const bottomAngle = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 35, 0]);
  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div ref={containerRef} className="relative h-[200vh] bg-emerald-50">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Text */}
        <motion.div style={{ y: yParallax }} className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <h1 className="font-display font-black text-[20vw] tracking-tighter text-emerald-100 opacity-50 whitespace-nowrap">
            KIDS
          </h1>
        </motion.div>

        {/* Scissors Container */}
        <div className="relative z-10 w-64 h-64 md:w-96 md:h-96 text-emerald-800 rotate-45">
          {/* Top Blade */}
          <motion.div
            style={{ rotate: angle }}
            className="absolute top-1/2 left-0 w-full h-8 -mt-4 origin-[70%_50%]"
          >
            <svg viewBox="0 0 200 40" className="w-full h-full drop-shadow-xl" fill="currentColor">
              <path d="M140,20 C140,30 130,40 120,40 C110,40 100,30 100,20 C100,10 110,0 120,0 C130,0 140,10 140,20 Z M130,20 C130,15 125,10 120,10 C115,10 110,15 110,20 C110,25 115,30 120,30 C125,30 130,25 130,20 Z M140,18 L195,18 L200,20 L195,22 L140,22 Z M100,18 L0,18 L0,22 L100,22 Z" />
            </svg>
          </motion.div>

          {/* Bottom Blade */}
          <motion.div
            style={{ rotate: bottomAngle }}
            className="absolute top-1/2 left-0 w-full h-8 -mt-4 origin-[70%_50%]"
          >
            <svg viewBox="0 0 200 40" className="w-full h-full drop-shadow-xl" fill="currentColor">
              <path d="M140,20 C140,30 130,40 120,40 C110,40 100,30 100,20 C100,10 110,0 120,0 C130,0 140,10 140,20 Z M130,20 C130,15 125,10 120,10 C115,10 110,15 110,20 C110,25 115,30 120,30 C125,30 130,25 130,20 Z M140,18 L195,18 L200,20 L195,22 L140,22 Z M100,18 L0,18 L0,22 L100,22 Z" />
            </svg>
          </motion.div>
          
          {/* Pivot Screw */}
          <div className="absolute top-1/2 left-[70%] w-3 h-3 bg-emerald-950 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-emerald-50 shadow-inner" />
        </div>

        {/* Floating elements (bubbles) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 rounded-full border-2 border-emerald-200"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
