import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted
    const consent = localStorage.getItem('luni_cookie_consent');
    if (!consent) {
      // Small delay so it pops up nicely
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('luni_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('luni_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed bottom-4 left-4 right-4 md:bottom-10 md:left-10 md:right-auto md:max-w-sm z-[9999]"
        >
          <div className="bg-void border border-onyx p-6 rounded-2xl shadow-2xl flex flex-col gap-4 relative overflow-hidden">
            {/* Pequeño toque visual mixto: oscuro y menta */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <h3 className="text-bone font-display font-bold text-lg mb-2">Usamos cookies</h3>
              <p className="text-ash text-xs leading-relaxed mb-4">
                Utilizamos cookies propias y de terceros para mejorar tu experiencia en nuestra web y ofrecerte contenidos personalizados.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={acceptCookies}
                  className="flex-1 bg-amber-400 text-void font-bold text-xs tracking-widest uppercase py-3 rounded-lg hover:bg-amber-300 transition-colors"
                >
                  Aceptar Todo
                </button>
                <button
                  onClick={rejectCookies}
                  className="flex-1 bg-carbon text-bone border border-onyx font-bold text-xs tracking-widest uppercase py-3 rounded-lg hover:bg-onyx transition-colors"
                >
                  Rechazar
                </button>
              </div>
              <div className="mt-4 text-center">
                <a href="/politica-cookies" className="text-[10px] text-steel hover:text-amber-400 uppercase tracking-widest underline decoration-white/20 underline-offset-2">
                  Ver Política de Cookies
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
