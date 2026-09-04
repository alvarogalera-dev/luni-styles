import { Link } from '@inertiajs/react';

export default function Footer() {
  const year = new Date().getFullYear();

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
              Barbería premium y peluquería infantil en Alcantarilla, Murcia. El espacio perfecto que aúna el grooming de lujo y un entorno divertido para los más pequeños.
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
                    href={item.href}
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
                    href={item.href}
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
              <li className="text-steel text-sm">C. Pedro Hernandez Guillamon "El Peseta", 4</li>
              <li className="text-steel text-sm">30820, Alcantarilla (Murcia)</li>
              <li>
                <span className="text-ash font-bold text-xs uppercase tracking-wider block mb-1">Barbería</span>
                <a href="tel:+34623599890" className="text-steel text-sm hover:text-amber-400 transition-colors">
                  +34 623 59 98 90
                </a>
              </li>
              <li className="pt-2">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">Peluquería Infantil</span>
                <a href="tel:+34623599890" className="text-steel text-sm hover:text-amber-400 transition-colors">
                  +34 623 59 98 90
                </a>
              </li>
              <li>
                <a href="mailto:contacto@lunistyles.com" className="text-steel text-sm hover:text-amber-400 transition-colors">
                  contacto@lunistyles.com
                </a>
              </li>
            </ul>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              {[
                { 
                  name: 'Instagram', 
                  href: '#',
                  svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                },
                { 
                  name: 'TikTok', 
                  href: '#',
                  svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                },
                { 
                  name: 'YouTube', 
                  href: '#',
                  svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.1 8.4 2 10.2 2 12s.1 3.6.5 4.9c.5 1.5 1.7 2.7 3.2 3.1 1.6.4 5.2.5 6.3.5s4.7-.1 6.3-.5c1.5-.4 2.7-1.6 3.2-3.1.4-1.3.5-3.1.5-4.9s-.1-3.6-.5-4.9c-.5-1.5-1.7-2.7-3.2-3.1C16.7 3.6 13.1 3.5 12 3.5s-4.7.1-6.3.5c-1.5.4-2.7 1.6-3.2 3.1z"/><path d="m10 15 5-3-5-3z"/></svg>
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-steel hover:border-amber-400 hover:text-amber-400 transition-all duration-200"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-steel text-xs tracking-wider">
            © {year} Luni Styles. Todos los derechos reservados.
          </p>
          <p className="text-steel/50 text-xs tracking-wider">
            Precision. Power. Style.
          </p>
        </div>
      </div>
    </footer>
  );
}
