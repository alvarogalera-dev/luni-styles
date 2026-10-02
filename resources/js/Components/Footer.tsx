import { Link, usePage } from '@inertiajs/react';
import { ExternalLink, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  const { props } = usePage();
  const currentLocale = ((props as any).locale as string) || 'es';
  const currentPath = ((props as any).currentPath as string) || '/';
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'cn', label: '中文' }
  ];

  const currentLangLabel = languages.find(l => l.code === currentLocale)?.code.toUpperCase() || 'ES';

  // Helper to generate locale URLs
  const getLocaleUrl = (localeCode: string) => {
    // Strip current locale prefix if any
    let path = currentPath.replace(/^(en|ru|cn)(\/|$)/, '');
    if (!path.startsWith('/')) path = '/' + path;
    if (localeCode === 'es') return path;
    return `/${localeCode}${path === '/' ? '' : path}`;
  };

  const getUrl = (path: string) => {
    return currentLocale === 'es' ? path : `/${currentLocale}${path}`;
  };

  return (
    <footer className="bg-void border-t border-border-subtle">
      {/* Top separator line */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(205,127,50,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 mb-16">
          
          {/* Brand - Left Side */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-bone font-display font-black tracking-widest text-lg md:text-xl uppercase drop-shadow-lg">
                Luni<span className="text-amber-400">Styles</span>
              </span>
            </div>
            <p className="text-steel text-sm leading-relaxed max-w-sm">
              Barbería moderna y peluquería infantil en Alcantarilla, Murcia. Un mismo espacio para el cuidado profesional de toda la familia.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 md:col-start-6">
            <p className="text-bone text-xs tracking-widest uppercase mb-5 font-bold">Navegación</p>
            <ul className="space-y-3">
              {[
                { label: 'La Barbería', href: '/la-barberia' },
                { label: 'Peluquería Infantil', href: '/peluqueria-infantil' },
                { label: 'Quiénes Somos', href: '/quienes-somos' },
                { label: 'Contacto',    href: '/contacto'    },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={getUrl(item.href)}
                    className="text-steel text-sm hover:text-amber-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <p className="text-bone text-xs tracking-widest uppercase mb-5 font-bold">Legal</p>
            <ul className="space-y-3">
              {[
                { label: 'Aviso Legal', href: '/aviso-legal' },
                { label: 'Política de Privacidad', href: '/politica-privacidad' },
                { label: 'Política de Cookies', href: '/politica-cookies' },
                { label: 'Términos de Reserva', href: '/terminos-reserva' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={getUrl(item.href)}
                    className="text-steel text-sm hover:text-amber-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Right Side */}
          <div className="md:col-span-3">
            <p className="text-bone text-xs tracking-widest uppercase mb-5 font-bold">Contacto</p>
            <ul className="space-y-3">
              <li className="text-steel text-sm">C. Pedro Hernández Guillamón "El Peseta", 5</li>
              <li className="text-steel text-sm">30820 Alcantarilla, Murcia</li>
              <li className="pt-1 pb-1">
                <a 
                  href="https://maps.app.goo.gl/teJ2BCwoX7fQ4rJaA" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver en Google Maps
                </a>
              </li>
              <li>
                <span className="text-ash font-bold text-xs uppercase tracking-wider block mb-1">Barbería</span>
                <div className="flex items-center gap-3 flex-wrap">
                  <a href="tel:+34623599890" className="text-steel text-sm hover:text-amber-400 transition-colors">
                    +34 623 59 98 90
                  </a>
                  <div className="flex items-center gap-1.5">
                    <a href="https://www.instagram.com/glow.barber_ofi" target="_blank" rel="noopener noreferrer" title="Instagram Barbería"
                      className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-steel hover:border-amber-400 hover:text-amber-400 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <a href="https://www.tiktok.com/@glow.barber_ofi" target="_blank" rel="noopener noreferrer" title="TikTok Barbería"
                      className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-steel hover:border-amber-400 hover:text-amber-400 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                    </a>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">Peluquería Infantil</span>
                <div className="flex items-center gap-3 flex-wrap">
                  <a href="tel:+34675372813" className="text-steel text-sm hover:text-emerald-400 transition-colors">
                    +34 675 37 28 13
                  </a>
                  <div className="flex items-center gap-1.5">
                    <a href="https://www.instagram.com/luni_styles/" target="_blank" rel="noopener noreferrer" title="Instagram Peluquería Infantil"
                      className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-steel hover:border-emerald-400 hover:text-emerald-400 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <a href="https://www.tiktok.com/@luni_styles" target="_blank" rel="noopener noreferrer" title="TikTok Peluquería"
                      className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-steel hover:border-emerald-400 hover:text-emerald-400 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                    </a>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-1">Correo Electrónico</span>
                <a href="mailto:contacto@lunistyles.com" className="text-steel text-sm hover:text-amber-400 transition-colors">
                  contacto@lunistyles.com
                </a>
              </li>
              <li className="pt-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-1">Horario Barbería</span>
                <p className="text-steel text-sm leading-relaxed">
                  Lun – Vie: <span className="text-bone/80 font-medium">16:00 – 21:00</span>
                </p>
                <p className="text-steel text-sm leading-relaxed mt-0.5">
                  Sábado: <span className="text-bone/80 font-medium">10:00 – 12:00 | 16:00 – 21:00</span>
                </p>
              </li>
              <li className="pt-1">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">Horario Peluquería Infantil</span>
                <p className="text-steel text-sm leading-relaxed">
                  Lun y Mié: <span className="text-bone/80 font-medium">16:00 – 19:00</span>
                </p>
                <p className="text-steel text-sm leading-relaxed mt-0.5">
                  Mar, Jue y Vie: <span className="text-bone/80 font-medium">16:00 – 20:00</span>
                </p>
                <p className="text-steel text-sm leading-relaxed mt-0.5">
                  Sábado: <span className="text-bone/80 font-medium">10:00 – 12:00 | 16:00 – 20:00</span>
                </p>
                <p className="text-steel/50 text-xs mt-1">Domingo: Cerrado</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <p className="text-steel text-xs tracking-wider text-center md:text-left">
            © {year} Luni Styles. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6">
            <p className="text-steel text-xs tracking-wider text-center md:text-right">
              Developed by <span className="text-bone font-bold">CodeOS</span>
            </p>

            {/* Language Selector */}
            <div className="relative">
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute bottom-full right-0 mb-2 bg-[#111] border border-white/10 rounded-xl py-2 min-w-[120px] shadow-2xl z-50 overflow-hidden">
                    {languages.map((lang) => (
                      <a
                        key={lang.code}
                        href={getLocaleUrl(lang.code)}
                        className={`block px-4 py-2 text-sm transition-colors ${currentLocale === lang.code ? 'text-amber-400 font-bold bg-white/5' : 'text-steel hover:text-white hover:bg-white/5'}`}
                      >
                        {lang.label}
                      </a>
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-steel hover:text-white transition-colors text-sm font-bold uppercase"
              >
                {currentLangLabel} <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
