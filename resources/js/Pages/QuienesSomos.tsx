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
            Dos hermanos.<br />
            <span className="text-amber-400">Un imperio.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-ash text-sm md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Con solo 19 años decidimos que en Alcantarilla faltaba un sitio donde pudieras cortarte el pelo con rollo, y además, traer a tu hijo sin que la líe.
          </motion.p>
        </div>
      </section>

      {/* ── La Historia (Mitad Oscuro / Mitad Claro) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Lado Oscuro */}
        <div className="bg-[#0a0a0a] p-10 md:p-20 text-bone flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
          <p className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4">La Barbería</p>
          <h2 className="font-display font-black text-3xl md:text-5xl mb-6 tracking-tight">Sangre nueva, <br />estilo clásico.</h2>
          <p className="text-ash leading-relaxed mb-6 text-sm md:text-base">
            No somos los típicos barberos. Somos jóvenes, sabemos lo que se lleva y cómo se lleva. Fades que son pura matemática, líneas limpias y un trato de tú a tú. 
          </p>
          <ul className="space-y-4 text-steel text-sm md:text-base">
            <li className="flex items-center gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Especialistas en degradados.</li>
            <li className="flex items-center gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Asesoría real, sin rodeos.</li>
            <li className="flex items-center gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Trato cercano en Alcantarilla.</li>
          </ul>
        </div>

        {/* Lado Claro (Blanco total) */}
        <div className="bg-white p-10 md:p-20 text-slate-800 flex flex-col justify-center">
          <p className="text-emerald-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4">Zona Kids</p>
          <h2 className="font-display font-black text-3xl md:text-5xl mb-6 tracking-tight">Paciencia y <br />cero dramas.</h2>
          <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base">
            Sabemos que traer al peque al peluquero suele ser una odisea. Por eso montamos esta zona. Tenemos a la jefa, que tiene el cielo ganado, juguetes y mucho tacto para que salgan encantados.
          </p>
          <ul className="space-y-4 text-slate-600 text-sm md:text-base font-medium">
            <li className="flex items-center gap-3"><Check className="text-emerald-500 w-5 h-5 shrink-0" /> Material 100% seguro para niños.</li>
            <li className="flex items-center gap-3"><Check className="text-emerald-500 w-5 h-5 shrink-0" /> Entorno de juegos interactivo.</li>
            <li className="flex items-center gap-3"><Check className="text-emerald-500 w-5 h-5 shrink-0" /> Técnicas sin tirones.</li>
          </ul>
        </div>
      </section>

    </RootLayout>
  );
}
