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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rotate-45 bg-copper-gradient rounded-sm" />
                <div className="absolute inset-[3px] rotate-45 bg-void rounded-sm" />
              </div>
              <span className="text-bone font-display font-bold tracking-widest text-sm uppercase">
                Luni<span className="text-copper-400">.</span>
              </span>
            </div>
            <p className="text-steel text-sm leading-relaxed max-w-xs">
              Barbería de precisión. Donde el arte del grooming se encuentra con la
              tecnología moderna. Cada corte, una obra maestra.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-bone text-xs tracking-widest uppercase mb-5 font-medium">Navegación</p>
            <ul className="space-y-3">
              {[
                { label: 'La Barbería', href: '/la-barberia' },
                { label: 'Servicios', href: '/servicios' },
                { label: 'Corte Infantil', href: '/corte-infantil' },
                { label: 'Reservas', href: '/reservas' },
                { label: 'Contacto', href: '/contacto' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-steel text-sm hover:text-copper-400 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-bone text-xs tracking-widest uppercase mb-5 font-medium">Contacto</p>
            <ul className="space-y-3">
              <li className="text-steel text-sm">C. Pedro Hernandez Guillamon "El Peseta", 4</li>
              <li className="text-steel text-sm"> 30820, Alcantarilla(Murcia)</li>
              <li>
                <a href="tel:+34623599890" className="text-steel text-sm hover:text-copper-400 transition-colors">
                  +34 623 59 98 90
                </a>
              </li>
              <li>
                <a href="mailto:contacto@lunistyles.com" className="text-steel text-sm hover:text-copper-400 transition-colors">
                  contacto@lunistyles.com
                </a>
              </li>
            </ul>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              {['IG', 'FB', 'TT'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-steel text-xs hover:border-copper-500 hover:text-copper-400 transition-all duration-200"
                >
                  {s}
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
