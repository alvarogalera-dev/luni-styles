import RootLayout from '@/Layouts/RootLayout';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

export default function QuienesSomos({ meta }: Props) {
  return (
    <RootLayout meta={meta}>
      
      {/* ── Hero Quienes Somos ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 md:px-10 bg-void overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-6xl lg:text-7xl tracking-tighter text-bone uppercase leading-[1.1]"
          >
            Dos mundos.<br />
            <span className="text-amber-400">Una familia.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-ash text-sm md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Luni Styles nació de la ilusión por el trabajo bien hecho y del deseo de ofrecer en Alcantarilla algo diferente: un espacio donde conviven la barbería y la peluquería infantil bajo el mismo techo.
          </motion.p>
        </div>
      </section>

      {/* ── Nuestra Historia ── */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[#0a0a0a] text-bone border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase font-bold">Nuestra historia</p>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tighter">Cómo empezó todo.</h2>
          <div className="space-y-5 text-ash text-sm md:text-base leading-relaxed max-w-2xl">
            <p>
              Luni Styles arrancó con una idea clara: crear un negocio de barrio donde cada cliente se sintiera bien atendido. Desde el principio apostamos por la calidad, la profesionalidad y el trato cercano como señas de identidad.
            </p>
            <p>
              La barbería nació para ofrecer cortes modernos, degradados precisos y el cuidado de barba que merece cada cliente. Poco después, sumamos la peluquería infantil para dar respuesta a las familias que buscaban un sitio de confianza donde llevar a sus hijos.
            </p>
            <p>
              Hoy Luni Styles es un referente en Alcantarilla: dos servicios, un mismo espacio y el mismo compromiso de siempre con el trabajo bien hecho.
            </p>
          </div>
        </div>
      </section>

      {/* ── La Barbería / Zona Kids ── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Lado Oscuro */}
        <div className="bg-[#111] p-10 md:p-20 text-bone flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
          <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4">La Barbería</p>
          <h2 className="font-display font-black text-3xl md:text-5xl mb-6 tracking-tight">Corte profesional,<br />resultado garantizado.</h2>
          <p className="text-ash leading-relaxed mb-6 text-sm md:text-base">
            Especialistas en degradados, líneas limpias y arreglo de barba. Utilizamos técnicas actuales y productos de calidad para que cada visita se note.
          </p>
          <ul className="space-y-4 text-steel text-sm md:text-base">
            <li className="flex items-center gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Especialistas en degradados y fades.</li>
            <li className="flex items-center gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Arreglo y perfilado de barba.</li>
            <li className="flex items-center gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Atención personalizada en cada visita.</li>
          </ul>
        </div>

        {/* Lado Claro */}
        <div className="bg-white p-10 md:p-20 text-slate-800 flex flex-col justify-center">
          <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4">Zona Kids</p>
          <h2 className="font-display font-black text-3xl md:text-5xl mb-6 tracking-tight">Confianza y<br />paciencia con los más pequeños.</h2>
          <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base">
            Sabemos que llevar a un niño al peluquero requiere paciencia y experiencia. Ofrecemos un entorno pensado para que los más pequeños se sientan cómodos y la visita sea una buena experiencia para toda la familia.
          </p>
          <ul className="space-y-4 text-slate-600 text-sm md:text-base font-medium">
            <li className="flex items-center gap-3"><Check className="text-emerald-500 w-5 h-5 shrink-0" /> Material 100% seguro para niños.</li>
            <li className="flex items-center gap-3"><Check className="text-emerald-500 w-5 h-5 shrink-0" /> Técnicas adaptadas a cada edad.</li>
            <li className="flex items-center gap-3"><Check className="text-emerald-500 w-5 h-5 shrink-0" /> Ambiente tranquilo y acogedor.</li>
          </ul>
        </div>
      </section>

    </RootLayout>
  );
}
