import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import BookingModal from './BookingModal';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialService, setInitialService] = useState<'barberia' | 'infantil' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const handleOpenModal = (e: any) => {
      setInitialService(e.detail?.serviceType || null);
      setIsModalOpen(true);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('openBookingModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('openBookingModal', handleOpenModal);
    };
  }, []);

  const navLinks = [
    { label: 'La Barbería', href: '/la-barberia' },
    { label: 'Peluquería Infantil', href: '/peluqueria-infantil' },
    { label: 'Quiénes Somos', href: '/quienes-somos' },
    { label: 'Contacto', href: '/contacto' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out px-4 md:px-10',
          isScrolled ? 'py-4' : 'py-6 md:py-8'
        )}
      >
        {/* Backdrop blur when scrolled */}
        <motion.div
          className="absolute inset-0 bg-void/80 backdrop-blur-xl border-b border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <nav className="relative flex items-center justify-between w-full mx-auto">
          {/* Logo (Left aligned) */}
          <Link href="/" className="group flex items-center gap-3 z-10 w-auto lg:w-1/4">
            <span className="text-bone font-display font-black tracking-widest text-lg md:text-xl uppercase drop-shadow-lg whitespace-nowrap">
              Luni<span className="text-amber-400">Styles</span>
            </span>
          </Link>

          {/* Nav Links (Desktop Centered) */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-8 bg-black/40 px-8 py-3 rounded-full border border-white/10 backdrop-blur-md">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-bone/80 text-xs tracking-[0.2em] font-bold uppercase hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          {/* Book CTA & Mobile Menu Toggle (Right aligned) */}
          <div className="z-10 w-auto lg:w-1/4 flex justify-end items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative overflow-hidden inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-black/60 backdrop-blur-md border border-white/10 text-bone rounded-full font-display font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-amber-400 hover:text-void hover:border-amber-400 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
            >
              <span>Reservar</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-amber-400 p-2 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-amber-400 hover:text-void transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            >
              {isMobileMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-void/95 backdrop-blur-3xl pt-28 px-6 lg:hidden flex flex-col"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-display font-black text-bone uppercase hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialServiceType={initialService} />
    </>
  );
}
