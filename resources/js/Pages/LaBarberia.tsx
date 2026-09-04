import RootLayout from '@/Layouts/RootLayout';
import TextReveal, { CharReveal } from '@/Components/TextReveal';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const team = [
  { name: 'Luni', role: 'Master Barber & Fundador', years: '10+ años', specialty: 'Fades & Cortes Clásicos' },
  { name: 'Marco', role: 'Senior Barber',            years: '7 años',   specialty: 'Barba & Afeitado Clásico' },
  { name: 'Xabi',  role: 'Senior Barber',            years: '6 años',   specialty: 'Cortes Modernos & Textura' },
  { name: 'Dani',  role: 'Barber',                   years: '4 años',   specialty: 'Corte Infantil & Fade' },
];

export default function LaBarberia({ meta }: Props) {
  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: '-10%' });

  return (
    <RootLayout meta={meta}>
      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 md:px-10 min-h-[70vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 30% 70%, rgba(205,127,50,0.06) 0%, transparent 70%)' }} />
        {/* Background lettering */}
        <div className="absolute top-20 right-0 font-display font-black text-[30vw] tracking-tightest leading-none select-none pointer-events-none" style={{ color: 'rgba(255,255,255,0.02)' }} aria-hidden>
          LUNI
        </div>
        <div className="relative max-w-7xl mx-auto w-full">
          <p className="text-copper-400 text-xs tracking-ultra uppercase mb-6">La Barbería</p>
          <CharReveal
            text="El arte del grooming desde 2015."
            className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tightest leading-none text-bone"
          />
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 md:px-10 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <TextReveal
            text="Luni Styles nació de una pasión por la perfección. Un espacio donde el ritual del cuidado masculino se convierte en una experiencia que trasciende el simple corte de pelo."
            className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-relaxed text-bone"
          />
          <div className="space-y-6 pt-4">
            <TextReveal
              text="Creemos que cada hombre merece salir de la silla sintiéndose invencible. Para eso, nuestro equipo de maestros barberos combina técnica depurada, productos de primera línea y una atención al detalle obsesiva."
              className="text-ash text-base leading-relaxed"
              delay={0.1}
            />
            <TextReveal
              text="Desde el primer minuto, el ambiente, la música y el trato personalizan tu visita. Esto no es solo una barbería. Es tu ritual."
              className="text-steel text-base leading-relaxed"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-copper-400 text-xs tracking-ultra uppercase mb-3">El Equipo</p>
            <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter text-bone">Maestros Barberos.</h2>
          </div>

          <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.76, 0, 0.24, 1] }}
                className="group relative bg-surface rounded-2xl border border-border-subtle hover:border-copper-500/30 overflow-hidden transition-all duration-500 cursor-pointer"
              >
                {/* Avatar placeholder */}
                <div
                  className="h-72 w-full flex items-end justify-start p-6 relative overflow-hidden"
                  style={{ background: `linear-gradient(160deg, #1a1a1a 0%, #111 100%)` }}
                >
                  {/* Initials */}
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-9xl tracking-tightest" style={{ color: 'rgba(205,127,50,0.08)' }}>
                    {member.name[0]}
                  </span>
                  <div className="relative z-10">
                    <p className="text-copper-400 text-xs tracking-widest uppercase">{member.years}</p>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-copper-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-2xl text-bone tracking-tight">{member.name}</h3>
                  <p className="text-copper-400 text-xs tracking-widest uppercase mt-1 mb-3">{member.role}</p>
                  <p className="text-steel text-sm">{member.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 md:px-10 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { title: 'Precisión', desc: 'Cada línea, cada degradado, cada detalle ejecutado con milimétrica exactitud.' },
            { title: 'Técnica',   desc: 'Formación continua y dominio de las técnicas más actuales del sector.' },
            { title: 'Ritual',    desc: 'Más que un servicio: una experiencia de cuidado que honra la tradición.' },
          ].map((v, i) => (
            <div key={v.title} className="space-y-3">
              <span className="text-copper-400 text-xs tracking-ultra uppercase">0{i + 1}</span>
              <h3 className="font-display font-bold text-3xl text-bone tracking-tight">{v.title}</h3>
              <p className="text-steel text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </RootLayout>
  );
}
