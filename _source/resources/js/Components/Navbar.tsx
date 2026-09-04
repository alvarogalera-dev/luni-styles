import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import FullscreenMenu from './FullscreenMenu';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHidden(currentY > lastScrollY.current && currentY > 200);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6"
        animate={{ y: hidden && !menuOpen ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Backdrop blur when scrolled */}
        <motion.div
          className="absolute inset-0 border-b border-border-subtle"
          style={{ backdropFilter: scrolled ? 'blur(20px)' : 'none' }}
          animate={{
            backgroundColor: scrolled ? 'rgba(10,10,10,0.8)' : 'rgba(10,10,10,0)',
          }}
          transition={{ duration: 0.3 }}
        />

        <nav className="relative flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 z-10"
            onClick={() => setMenuOpen(false)}
          >
            {/* Copper diamond mark */}
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rotate-45 bg-copper-gradient rounded-sm" />
              <div className="absolute inset-[3px] rotate-45 bg-void rounded-sm" />
            </div>
            <span className="text-bone font-display font-bold tracking-widest text-sm uppercase">
              Luni<span className="text-copper-400">.</span>
            </span>
          </Link>

          {/* Nav center links (desktop) */}
          <div className="hidden lg:flex items-center gap-10">
            {[
              { label: 'La Barbería', href: '/la-barberia' },
              { label: 'Servicios', href: '/servicios' },
              { label: 'Contacto', href: '/contacto' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ash text-sm tracking-wider uppercase hover:text-bone transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-copper-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 z-10">
            {/* Book CTA (desktop) */}
            <Link
              href="/reservas"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 border border-copper-500/40 rounded-full text-copper-400 text-xs tracking-widest uppercase hover:bg-copper-500/10 transition-all duration-300"
            >
              Reservar
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
            >
              <motion.span
                className="block w-6 h-px bg-bone origin-center"
                animate={{
                  rotate: menuOpen ? 45 : 0,
                  y: menuOpen ? 4 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-6 h-px bg-bone origin-center"
                animate={{
                  rotate: menuOpen ? -45 : 0,
                  y: menuOpen ? -4 : 0,
                  opacity: menuOpen ? 1 : 1,
                  scaleX: menuOpen ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && <FullscreenMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
