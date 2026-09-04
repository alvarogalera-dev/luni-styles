import RootLayout from '@/Layouts/RootLayout';
import { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="w-full bg-surface border border-border-subtle rounded-xl px-5 pt-7 pb-3 text-bone text-base outline-none
                   focus:border-copper-500/50 transition-all duration-300 peer"
      />
      <label
        className={`absolute left-5 transition-all duration-200 pointer-events-none
          ${focused || hasValue
            ? 'top-2.5 text-xs text-copper-400 tracking-widest uppercase'
            : 'top-1/2 -translate-y-1/2 text-steel text-base'}`}
      >
        {label}
      </label>
      <div
        className="absolute bottom-0 left-0 h-px transition-all duration-300 rounded-b-xl"
        style={{
          background: 'linear-gradient(90deg, #cd7f32, #e8a87c)',
          width: focused ? '100%' : '0%',
        }}
      />
    </div>
  );
}

function FloatingTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
        className="w-full bg-surface border border-border-subtle rounded-xl px-5 pt-8 pb-4 text-bone text-base outline-none
                   focus:border-copper-500/50 transition-all duration-300 resize-none"
      />
      <label
        className={`absolute left-5 transition-all duration-200 pointer-events-none
          ${focused || hasValue
            ? 'top-2.5 text-xs text-copper-400 tracking-widest uppercase'
            : 'top-5 text-steel text-base'}`}
      >
        {label}
      </label>
      <div
        className="absolute bottom-0 left-0 h-px transition-all duration-300 rounded-b-xl"
        style={{
          background: 'linear-gradient(90deg, #cd7f32, #e8a87c)',
          width: focused ? '100%' : '0%',
        }}
      />
    </div>
  );
}

export default function Contacto({ meta }: Props) {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (key: keyof FormData) => (v: string) => setForm(prev => ({ ...prev, [key]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSent(true);
  };

  return (
    <RootLayout meta={meta}>
      {/* Hero */}
      <section className="pt-36 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-copper-400 text-xs tracking-ultra uppercase mb-4">Contacto</p>
          <h1 className="font-display font-black text-7xl md:text-9xl tracking-tightest leading-none text-bone">
            Hablemos.
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">

          {/* Left: Info + Map */}
          <div className="space-y-10">
            <div className="space-y-6">
              {[
                { label: 'Dirección', value: 'C. Pedro Hernandez Guillamon "El Peseta", 4 — 30820, Alcantarilla(Murcia)' },
                { label: 'Teléfono', value: '+34 912 345 678' },
                { label: 'Email', value: 'contacto@lunistyles.com' },
                { label: 'Horario', value: 'Lun–Vie: 10:00 – 14:00 | 17:00 – 20:00' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-copper-400 text-xs tracking-ultra uppercase mb-1">{item.label}</p>
                  <p className="text-bone text-base">{item.value}</p>
                </div>
              ))}
            </div>

            {/* OpenStreetMap embed */}
            <div className="rounded-2xl overflow-hidden border border-border-subtle h-72">
              <iframe
                title="Luni Styles en el mapa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.93433600390372!2d-1.2100495486985499!3d37.97026913801462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd637fff9423f2bb%3A0x8c79e0cb3be8b953!2sKent%20School%20-%20Alcantarilla!5e1!3m2!1ses!2ses!4v1788524740608!5m2!1ses!2ses"
                className="w-full h-full"
                style={{ filter: 'invert(90%) hue-rotate(180deg) saturate(0.5) brightness(0.9)' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center gap-6 py-20"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #cd7f32, #e8a87c)' }}>
                  <span className="text-void text-2xl">✓</span>
                </div>
                <h2 className="font-display font-bold text-4xl text-bone tracking-tight">¡Mensaje enviado!</h2>
                <p className="text-ash">Nos pondremos en contacto contigo en menos de 24 horas.</p>
                <button onClick={() => setSent(false)} className="text-copper-400 text-sm tracking-widest uppercase hover:text-copper-300 transition-colors">
                  Enviar otro →
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <FloatingInput label="Nombre completo" value={form.name} onChange={update('name')} required />
                <FloatingInput label="Email" value={form.email} onChange={update('email')} type="email" required />
                <FloatingInput label="Teléfono" value={form.phone} onChange={update('phone')} type="tel" />
                <FloatingInput label="Asunto" value={form.subject} onChange={update('subject')} />
                <FloatingTextarea label="Mensaje" value={form.message} onChange={update('message')} />
                <button
                  type="submit"
                  className="w-full py-5 rounded-xl font-display font-bold text-sm tracking-widest uppercase text-void transition-all duration-300 hover:shadow-copper-lg"
                  style={{ background: 'linear-gradient(135deg, #cd7f32, #e8a87c)' }}
                >
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
