import RootLayout from '@/Layouts/RootLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Phone, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const faqs = [
  { q: '¿Necesito cita previa?', a: 'Sí, recomendamos reservar cita previa a través de nuestra web para asegurar tu plaza y evitar esperas, tanto en la barbería como en la peluquería infantil.' },
  { q: '¿Qué métodos de pago aceptáis?', a: 'Actualmente aceptamos pago en efectivo, tarjeta de crédito/débito y Bizum en el local.' },
  { q: '¿A partir de qué edad cortáis el pelo a niños?', a: 'Atendemos a niños desde sus primeros meses. Tenemos experiencia en el "primer corte" de bebés y mucha paciencia para que sea una buena experiencia.' },
  { q: '¿Vendéis productos para el cuidado en casa?', a: 'Sí, disponemos de una selección premium de ceras, aceites para barba, y también productos suaves y sin lágrimas para los más pequeños.' },
  { q: '¿Puedo cancelar o modificar mi cita?', a: 'Puedes modificar o cancelar tu cita desde el enlace que recibirás en tu correo de confirmación, con al menos 24 horas de antelación.' },
];

export default function Contacto({ meta }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <RootLayout meta={meta}>
      
      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 md:px-10 bg-[#111] text-center border-b border-white/5">
        <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4">Contacto</p>
        <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter text-bone mb-6">
          Hablemos.
        </h1>
      </section>

      {/* ── Contact Info & Form ── */}
      <section className="py-24 px-6 md:px-10 bg-[#0a0a0a] text-bone">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          
          {/* Info */}
          <div className="space-y-12">
            <div>
              <h2 className="font-display font-bold text-3xl mb-6">Información General</h2>
              <p className="text-ash leading-relaxed mb-8">
                Tienes dudas sobre nuestros servicios, quieres colaborar o simplemente decir hola. Estamos aquí para escucharte.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <MapPin className="text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Dónde estamos</p>
                  <p className="text-steel">C. Pedro Hernandez Guillamon "El Peseta", 4<br/>30820, Alcantarilla (Murcia)</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <Mail className="text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Correo electrónico</p>
                  <a href="mailto:contacto@lunistyles.com" className="text-steel hover:text-amber-400 transition-colors">contacto@lunistyles.com</a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Phone className="text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Teléfonos de contacto</p>
                  <p className="text-steel"><span className="text-ash font-bold">Barbería:</span> +34 623 59 98 90</p>
                  <p className="text-steel"><span className="text-emerald-400 font-bold">Peluquería Infantil:</span> +34 623 59 98 90</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="text-amber-400 shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="font-bold mb-3">Horario</p>
                  <div className="space-y-1">
                    {[
                      { day: 'Lunes', color: 'text-amber-400' },
                      { day: 'Martes', color: 'text-amber-400' },
                      { day: 'Miércoles', color: 'text-amber-400' },
                      { day: 'Jueves', color: 'text-amber-400' },
                      { day: 'Viernes', color: 'text-amber-400' },
                    ].map((d) => (
                      <p key={d.day} className="text-steel text-sm">
                        <span className={`${d.color} font-bold inline-block w-20`}>{d.day}:</span> 10:00 – 14:00 | 17:00 – 20:00
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <p className="font-bold mb-4">Síguenos</p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-carbon flex items-center justify-center text-bone hover:bg-amber-400 hover:text-void transition-colors">
                  {/* Instagram SVG */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                {/* TikTok SVG */}
                <a href="#" className="w-12 h-12 rounded-full bg-carbon flex items-center justify-center text-bone hover:bg-amber-400 hover:text-void transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-carbon flex items-center justify-center text-bone hover:bg-amber-400 hover:text-void transition-colors">
                  {/* YouTube SVG */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-[#111] p-8 md:p-10 rounded-3xl border border-white/5">
            <h2 className="font-display font-bold text-2xl mb-8">Envíanos un mensaje</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-steel mb-2">Nombre</label>
                  <input type="text" maxLength={50} required className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-steel mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    pattern="[0-9]{9}" 
                    maxLength={9} 
                    required 
                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                    placeholder="Ej. 600000000"
                    className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel mb-2">Correo electrónico</label>
                <input type="email" maxLength={100} required className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel mb-2">Asunto (Opcional)</label>
                <select className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 transition-colors">
                  <option>Duda General</option>
                  <option>Sobre La Barbería</option>
                  <option>Sobre Peluquería Infantil</option>
                  <option>Colaboraciones</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel mb-2">Mensaje</label>
                <textarea rows={4} maxLength={500} required className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 transition-colors resize-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-bone text-void font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-amber-400 transition-colors">
                Enviar Mensaje
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ── Mapa y FAQs (Transición a Claro) ── */}
      <section className="py-24 px-6 md:px-10 bg-white text-slate-800 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          
          {/* FAQs */}
          <div>
            <h2 className="font-display font-black text-4xl mb-10 text-slate-900">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-bold text-slate-800">{faq.q}</span>
                    {openFaq === i ? <Minus className="text-slate-400 shrink-0" /> : <Plus className="text-slate-400 shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-200/50 mt-2">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa */}
          <div className="h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-200">
            {/* Mapa interactivo */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.93433600390372!2d-1.2100495486985499!3d37.97026913801462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd637fff9423f2bb%3A0x8c79e0cb3be8b953!2sKent%20School%20-%20Alcantarilla!5e1!3m2!1ses!2ses!4v1788524740608!5m2!1ses!2ses" 
              width="100%"  
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="eager"
              fetchpriority="high"
            />
          </div>

        </div>
      </section>

    </RootLayout>
  );
}
