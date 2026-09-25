import RootLayout from '@/Layouts/RootLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Phone, Plus, Minus, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const faqs = [
  { q: '¿Necesito cita previa?', a: 'Sí, recomendamos reservar cita previa a través de nuestra web para garantizar tu plaza y evitar esperas, tanto en la barbería como en la peluquería infantil. Puedes reservar en cualquier momento desde el botón "Reservar" de la web.' },
  { q: '¿Qué métodos de pago aceptáis?', a: 'Actualmente aceptamos pago en efectivo y Bizum directamente en el local. Próximamente habilitaremos el pago con tarjeta.' },
  { q: '¿A partir de qué edad cortáis el pelo a niños?', a: 'Atendemos a niños desde los primeros meses de vida. Tenemos experiencia en el primer corte de bebés y contamos con el material y la paciencia necesaria para que sea una experiencia tranquila y agradable.' },
  { q: '¿Vendéis productos para el cuidado en casa?', a: 'Sí. En nuestra tienda física disponemos de una selección de productos de barbería (ceras, geles de fijación) y también gafas de sol. Puedes consultarnos directamente en el local.' },
  { q: '¿Puedo cancelar o modificar mi cita?', a: 'Sí. Para cancelar o modificar una cita, por favor contáctanos con al menos 24 horas de antelación por teléfono o por mensaje a nuestras redes sociales. Consulta nuestros Términos de Reserva para más información.' },
  { q: '¿Cuáles son vuestro horario de apertura?', a: 'Abrimos de lunes a viernes de 10:00 a 14:00 y de 17:00 a 20:00. Los sábados y domingos permanecemos cerrados. En épocas especiales (verano, festivos) podemos ajustar el horario; te recomendamos consultarlo antes de venir.' },
  { q: '¿Ofrecéis servicios para toda la familia?', a: 'Sí. Luni Styles combina barbería para adultos y peluquería infantil en el mismo espacio, por lo que puedes reservar cita para ti y para tus hijos en la misma visita sin necesidad de desplazarte a otro establecimiento.' },
  { q: '¿Cómo puedo llegar al local?', a: 'Estamos ubicados en C. Pedro Hernández Guillamón "El Peseta", 5, en Alcantarilla (Murcia). Dispones de aparcamiento en las calles del entorno. Puedes ver la ubicación exacta en el mapa de esta misma página.' },
];

const COUNTRY_CODES = [
  { code: '+34', iso: 'es', maxLength: 9, isOther: false },
  { code: '+33', iso: 'fr', maxLength: 9, isOther: false },
  { code: '+351', iso: 'pt', maxLength: 9, isOther: false },
  { code: '+44', iso: 'gb', maxLength: 10, isOther: false },
  { code: '+1', iso: 'us', maxLength: 10, isOther: false },
  { code: '+54', iso: 'ar', maxLength: 10, isOther: false },
  { code: '+57', iso: 'co', maxLength: 10, isOther: false },
  { code: '+52', iso: 'mx', maxLength: 10, isOther: false },
  { code: 'Otro', iso: 'other', maxLength: 15, isOther: true },
];

export default function Contacto({ meta }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({ nombre: '', apellidos: '', telefono: '', phonePrefix: '+34', customPrefix: '', email: '', asunto: 'Duda General', mensaje: '' });
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);
  const showEmailErrorRealtime = formData.email.length > 0 && !isEmailValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || ''
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ nombre: '', apellidos: '', telefono: '', phonePrefix: '+34', customPrefix: '', email: '', asunto: 'Duda General', mensaje: '' });
      } else {
        setSubmitStatus('error');
        setSubmitError(data.message || 'Error al enviar el mensaje.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitError('Fallo de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RootLayout meta={meta}>
      
      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 md:px-10 bg-[#111] text-center border-b border-white/5">
        <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4">Contacto</p>
        <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter text-bone mb-6">
          Contáctanos.
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
                Si tienes alguna consulta sobre nuestros servicios, precios u horarios, no dudes en ponerte en contacto con nosotros. Estaremos encantados de atenderte.
              </p>
            </div>

            <div className="space-y-8">
              {/* Dirección */}
              <div className="flex gap-4 items-start">
                <MapPin className="text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Dónde estamos</p>
                  <p className="text-steel leading-relaxed">
                    C. Pedro Hernández Guillamón "El Peseta", 5<br/>
                    30820 Alcantarilla, Murcia
                  </p>
                  <a
                    href="https://maps.app.goo.gl/teJ2BCwoX7fQ4rJaA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-amber-400 text-sm hover:text-amber-300 transition-colors font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ver en Google Maps
                  </a>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex gap-4 items-start">
                <Mail className="text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Correo electrónico</p>
                  <a href="mailto:contacto@lunistyles.com" className="text-steel hover:text-amber-400 transition-colors">contacto@lunistyles.com</a>
                </div>
              </div>

              {/* Teléfonos */}
              <div className="flex gap-4 items-start">
                <Phone className="text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-3">Teléfonos de contacto</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-ash font-bold text-xs uppercase tracking-wider block mb-0.5">Barbería</span>
                      <div className="flex items-center gap-3 flex-wrap">
                        <a href="tel:+34623599890" className="text-steel hover:text-amber-400 transition-colors">
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
                    </div>
                    <div>
                      <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-0.5">Peluquería Infantil</span>
                      <div className="flex items-center gap-3 flex-wrap">
                        <a href="tel:+34675372813" className="text-steel hover:text-emerald-400 transition-colors">
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
                    </div>
                  </div>
                </div>
              </div>
              {/* Horario */}
              <div className="flex gap-4 items-start">
                <div className="text-amber-400 shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="font-bold mb-3">Horario</p>
                  <div className="space-y-1">
                    {[
                      { day: 'Lunes' },
                      { day: 'Martes' },
                      { day: 'Mi\u00e9rcoles' },
                      { day: 'Jueves' },
                      { day: 'Viernes' },
                    ].map((d) => (
                      <p key={d.day} className="text-steel text-sm">
                        <span className="text-amber-400 font-bold inline-block w-24">{d.day}:</span> 10:00 \u2013 14:00 | 17:00 \u2013 20:00
                      </p>
                    ))}
                    <p className="text-steel text-sm">
                      <span className="text-steel/50 font-bold inline-block w-24">S\u00e1b \u2013 Dom:</span> Cerrado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-[#111] p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="font-display font-bold text-2xl mb-8">Envíanos un mensaje</h2>
            
            {submitStatus === 'success' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#111] z-10 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-void">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">¡Mensaje enviado!</h3>
                <p className="text-steel text-sm mb-6">Hemos recibido tu mensaje correctamente. Te responderemos lo antes posible.</p>
                <button onClick={() => setSubmitStatus('idle')} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : null}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {submitError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-steel mb-2">Nombre</label>
                  <input type="text" maxLength={50} required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full bg-carbon border border-amber-400/40 rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-steel mb-2">Apellidos</label>
                  <input type="text" maxLength={50} required value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} className="w-full bg-carbon border border-amber-400/40 rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" />
                </div>
              </div>
              <div className="relative">
                  <label className="block text-xs uppercase tracking-wider text-steel mb-2">Teléfono</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPhoneDropdown(!showPhoneDropdown)}
                      className="w-24 md:w-28 bg-carbon border border-amber-400/40 rounded-lg px-2 py-3 text-bone text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 flex items-center justify-center gap-2 shrink-0 transition-all"
                    >
                      {formData.phonePrefix === 'Otro' ? (
                        <span>🌍 Otro</span>
                      ) : (
                        <>
                          <img src={`https://flagcdn.com/w20/${COUNTRY_CODES.find(c => c.code === formData.phonePrefix)?.iso}.png`} alt="" className="w-4 h-3 object-cover rounded-sm" />
                          <span>{formData.phonePrefix}</span>
                        </>
                      )}
                    </button>
                    <input 
                      type="tel" 
                      pattern={formData.phonePrefix === 'Otro' ? `[0-9]{8,15}` : `[0-9]{${COUNTRY_CODES.find(c => c.code === formData.phonePrefix)?.maxLength || 9}}`}
                      maxLength={formData.phonePrefix === 'Otro' ? 15 : COUNTRY_CODES.find(c => c.code === formData.phonePrefix)?.maxLength || 9}
                      title={formData.phonePrefix === 'Otro' ? "El número debe tener entre 8 y 15 dígitos" : `Debe tener ${COUNTRY_CODES.find(c => c.code === formData.phonePrefix)?.maxLength || 9} dígitos`}
                      required 
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value.replace(/[^0-9]/g, '')})}
                      className="flex-1 min-w-0 bg-carbon border border-amber-400/40 rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" 
                    />
                  </div>
                  {showPhoneDropdown && (
                    <div className="absolute z-10 mt-2 w-full max-h-40 overflow-y-auto bg-[#111] border border-onyx rounded-xl p-1.5 grid grid-cols-2 sm:grid-cols-3 gap-1.5 custom-scrollbar shadow-xl">
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setFormData({...formData, phonePrefix: c.code, customPrefix: '', telefono: ''});
                            setShowPhoneDropdown(false);
                          }}
                          className="flex items-center gap-2 px-2.5 py-2 text-xs md:text-sm text-bone hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
                        >
                          {c.isOther ? (
                            <span>🌍 Otro</span>
                          ) : (
                            <>
                              <img src={`https://flagcdn.com/w20/${c.iso}.png`} alt="" className="w-4 h-3 object-cover rounded-sm" />
                              <span>{c.code}</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {formData.phonePrefix === 'Otro' && (
                    <div className="mt-3">
                      <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Prefijo Manual</label>
                      <input
                        required
                        value={formData.customPrefix}
                        type="text"
                        placeholder="+XX"
                        maxLength={5}
                        onChange={e => setFormData({...formData, customPrefix: e.target.value.replace(/[^0-9+]/g, '')})}
                        className="w-full bg-carbon border border-amber-400/40 rounded-lg px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                      />
                    </div>
                  )}
                </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel mb-2">Correo electrónico</label>
                  <input 
                    type="email" 
                    maxLength={100} 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    title="Debe ser un correo electrónico válido, ej: nombre@dominio.com"
                    className={`w-full bg-carbon border rounded-lg px-4 py-3 text-bone focus:outline-none transition-all ${showEmailErrorRealtime ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-amber-400/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'}`} 
                  />
                  {showEmailErrorRealtime && (
                    <div className="mt-2 flex items-start gap-2 text-red-400 bg-red-950/30 p-2.5 rounded-lg border border-red-900/50">
                      <svg className="w-4 h-4 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <p className="text-xs">Formato no válido. Debe incluir un dominio real (ej: @gmail.com)</p>
                    </div>
                  )}
                </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel mb-2">Asunto (Opcional)</label>
                <select value={formData.asunto} onChange={e => setFormData({...formData, asunto: e.target.value})} className="w-full bg-carbon border border-amber-400/40 rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all">
                  <option>Duda General</option>
                  <option>Sobre La Barbería</option>
                  <option>Sobre Peluquería Infantil</option>
                  <option>Colaboraciones</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel mb-2">Mensaje</label>
                <textarea rows={4} maxLength={500} required value={formData.mensaje} onChange={e => setFormData({...formData, mensaje: e.target.value})} className="w-full bg-carbon border border-amber-400/40 rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none" />
              </div>
              <button disabled={isSubmitting || showEmailErrorRealtime} type="submit" className="disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 bg-bone text-void font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                    ENVIANDO...
                  </>
                ) : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ── Mapa y FAQs ── */}
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
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4"
                  >
                    <span className="font-bold text-slate-800 text-sm md:text-base">{faq.q}</span>
                    {openFaq === i ? <Minus className="text-slate-400 shrink-0 w-4 h-4" /> : <Plus className="text-slate-400 shrink-0 w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 md:px-6 pb-5 md:pb-6 text-slate-600 leading-relaxed border-t border-slate-200/50 pt-3 text-sm md:text-base">
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
          <div className="h-[500px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d786.3234516300157!2d-1.2105969303449573!3d37.97027215547939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd637f007f220c1b%3A0x3efbfe67ec17fe64!2sLuni%20Styles!5e0!3m2!1ses!2ses!4v1789993724849!5m2!1ses!2ses" 
              width="100%"  
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

        </div>
      </section>

    </RootLayout>
  );
}

