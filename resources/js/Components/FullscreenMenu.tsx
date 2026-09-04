import { useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';

interface NavLink {
  label: string;
  href: string;
  number: string;
}

const links: NavLink[] = [
  { label: 'Inicio',           href: '/',              number: '01' },
  { label: 'La Barbería',      href: '/la-barberia',   number: '02' },
  { label: 'Servicios',        href: '/servicios',     number: '03' },
  { label: 'Corte Infantil',   href: '/corte-infantil',number: '04' },
  { label: 'Reservas',         href: '/reservas',      number: '05' },
  { label: 'Contacto',         href: '/contacto',      number: '06' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  exit:   { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const bgVariants = {
  hidden:  { clipPath: 'inset(0 0 100% 0)' },
  visible: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
  exit:    { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } },
};

const linkVariants = {
  hidden:  { y: '110%', opacity: 0 },
  visible: { y: '0%',   opacity: 1, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
  exit:    { y: '-110%',opacity: 0, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
};

interface Props {
  onClose: () => void;
}

export default function FullscreenMenu({ onClose }: Props) {
  const magneticRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Magnetic effect
  useEffect(() => {
    const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    magneticRefs.current.forEach((el) => {
      if (!el) return;
      const move = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
        const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
        el.style.transform = `translate(${x}px, ${y}px)`;
      };
      const leave = () => { el.style.transform = 'translate(0,0)'; };
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      handlers.push({ el, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col"
      variants={bgVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Copper line accent top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #cd7f32, transparent)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1, transition: { delay: 0.4, duration: 0.8 } }}
        exit={{ scaleX: 0 }}
      />

      {/* Radial copper glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(205,127,50,0.06) 0%, transparent 70%)' }}
      />

      {/* Close button */}
      <div className="relative px-6 md:px-10 py-6 flex justify-end">
        <button
          onClick={onClose}
          className="text-ash text-sm tracking-widest uppercase hover:text-bone transition-colors"
        >
          Cerrar ✕
        </button>
      </div>

      {/* Nav links */}
      <motion.nav
        className="flex-1 flex flex-col justify-center px-8 md:px-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {links.map((link, i) => (
          <div key={link.href} className="overflow-hidden border-b border-border-subtle last:border-b-0">
            <motion.div variants={linkVariants}>
              <Link
                href={link.href}
                onClick={onClose}
                ref={(el) => { magneticRefs.current[i] = el; }}
                className="group flex items-baseline justify-between py-5 md:py-7 transition-all duration-300 magnetic"
                style={{ transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)' }}
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-steel text-xs tracking-widest font-mono">{link.number}</span>
                  <span className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none text-bone group-hover:text-copper-gradient transition-all duration-500">
                    {link.label}
                  </span>
                </div>
                <span className="text-copper-400 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4 group-hover:translate-x-0 transform duration-300">
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        ))}
      </motion.nav>

      {/* Footer social + info */}
      <motion.div
        className="px-8 md:px-20 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-steel text-xs tracking-widest uppercase">Síguenos</p>
          <div className="flex gap-6 mt-2">
            {['Instagram', 'Facebook', 'TikTok'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-ash text-sm hover:text-copper-400 transition-colors tracking-wider"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <p className="text-steel text-xs tracking-widest uppercase">Horario</p>
          <p className="text-ash text-sm">Lun — Sáb: 9:00 — 20:00</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
