import RootLayout from '@/Layouts/RootLayout';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const services = ['Corte Clásico', 'Fade / Degradado', 'Corte + Barba', 'Arreglo de Barba', 'Afeitado Clásico', 'Tratamiento Capilar'];
const barbers  = ['Sin preferencia', 'Luni', 'Marco', 'Xabi', 'Dani'];
const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Reservas({ meta }: Props) {
  const today    = new Date();
  const [step,   setStep]   = useState(1);
  const [service, setService] = useState('');
  const [barber,  setBarber]  = useState('Sin preferencia');
  const [year,    setYear]    = useState(today.getFullYear());
  const [month,   setMonth]   = useState(today.getMonth());
  const [day,     setDay]     = useState<number | null>(null);
  const [time,    setTime]    = useState('');
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [done,    setDone]    = useState(false);

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const daysInMonth   = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month); // 0=Sun

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); setDay(null); };

  const isPast = (d: number) => {
    const sel = new Date(year, month, d);
    sel.setHours(0,0,0,0);
    const now = new Date(); now.setHours(0,0,0,0);
    return sel < now;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <RootLayout meta={meta}>
        <section className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-lg space-y-6"
          >
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #cd7f32, #e8a87c)' }}>
              <span className="text-void text-3xl">✓</span>
            </div>
            <h1 className="font-display font-black text-5xl text-bone tracking-tighter">¡Reserva confirmada!</h1>
            <p className="text-ash">
              <span className="text-bone font-medium">{service}</span> con <span className="text-bone font-medium">{barber}</span>
              <br />el <span className="text-copper-400 font-medium">{day} de {monthNames[month]} de {year}</span> a las <span className="text-copper-400 font-medium">{time}</span>
            </p>
            <p className="text-steel text-sm">Recibirás una confirmación en <span className="text-bone">{email}</span></p>
            <button
              onClick={() => { setDone(false); setStep(1); setService(''); setDay(null); setTime(''); }}
              className="text-copper-400 text-sm tracking-widest uppercase hover:text-copper-300"
            >
              Nueva reserva →
            </button>
          </motion.div>
        </section>
      </RootLayout>
    );
  }

  return (
    <RootLayout meta={meta}>
      {/* Hero */}
      <section className="pt-36 pb-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-copper-400 text-xs tracking-ultra uppercase mb-4">Reservas Online</p>
          <h1 className="font-display font-black text-7xl md:text-9xl tracking-tightest leading-none text-bone">
            Reserva<br />tu cita.
          </h1>
        </div>
      </section>

      {/* Step indicator */}
      <div className="px-6 md:px-10 pb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {['Servicio', 'Fecha & Hora', 'Tus datos'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${step > i + 1 ? 'bg-copper-gradient text-void' : step === i + 1 ? 'border border-copper-400 text-copper-400' : 'border border-border text-steel'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs tracking-widest uppercase hidden sm:block ${step === i + 1 ? 'text-bone' : 'text-steel'}`}>{label}</span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 md:px-10 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">

            {/* Step 1: Service & Barber */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-bone mb-6 tracking-tight">Elige tu servicio</h2>
                    <div className="space-y-3">
                      {services.map((s) => (
                        <button key={s} onClick={() => setService(s)}
                          className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200
                            ${service === s ? 'border-copper-500 bg-copper-500/10 text-copper-400' : 'border-border-subtle text-ash hover:border-copper-500/30 hover:text-bone'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-2xl text-bone mb-6 tracking-tight">Elige tu barbero</h2>
                    <div className="space-y-3">
                      {barbers.map((b) => (
                        <button key={b} onClick={() => setBarber(b)}
                          className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200
                            ${barber === b ? 'border-copper-500 bg-copper-500/10 text-copper-400' : 'border-border-subtle text-ash hover:border-copper-500/30 hover:text-bone'}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <button
                    onClick={() => service && setStep(2)}
                    disabled={!service}
                    className="px-10 py-4 rounded-full font-display font-bold text-sm tracking-widest uppercase text-void disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    style={{ background: service ? 'linear-gradient(135deg, #cd7f32, #e8a87c)' : '#333' }}
                  >
                    Continuar →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Calendar */}
                  <div>
                    <h2 className="font-display font-bold text-2xl text-bone mb-6 tracking-tight">Elige la fecha</h2>
                    <div className="bg-surface rounded-2xl border border-border-subtle p-6">
                      {/* Month nav */}
                      <div className="flex items-center justify-between mb-6">
                        <button onClick={prevMonth} className="text-ash hover:text-bone p-2 rounded-lg hover:bg-charcoal transition-colors">←</button>
                        <span className="font-display font-bold text-bone tracking-tight">{monthNames[month]} {year}</span>
                        <button onClick={nextMonth} className="text-ash hover:text-bone p-2 rounded-lg hover:bg-charcoal transition-colors">→</button>
                      </div>
                      {/* Day names */}
                      <div className="grid grid-cols-7 mb-2">
                        {['D','L','M','X','J','V','S'].map(d => (
                          <div key={d} className="text-center text-steel text-xs py-1">{d}</div>
                        ))}
                      </div>
                      {/* Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                          const past = isPast(d);
                          const selected = day === d;
                          return (
                            <button
                              key={d}
                              onClick={() => !past && setDay(d)}
                              disabled={past}
                              className={`h-10 w-full rounded-lg text-sm transition-all duration-200 font-medium
                                ${selected ? 'text-void font-bold' : past ? 'text-steel/30 cursor-not-allowed' : 'text-ash hover:text-bone hover:bg-charcoal'}
                              `}
                              style={selected ? { background: 'linear-gradient(135deg, #cd7f32, #e8a87c)' } : {}}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <h2 className="font-display font-bold text-2xl text-bone mb-6 tracking-tight">Elige la hora</h2>
                    {day ? (
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setTime(slot)}
                            className={`py-3 rounded-xl text-sm font-medium border transition-all duration-200
                              ${time === slot ? 'border-copper-500 text-copper-400 bg-copper-500/10' : 'border-border-subtle text-ash hover:border-copper-500/30 hover:text-bone'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-steel text-sm">Selecciona una fecha primero</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={() => setStep(1)} className="px-8 py-4 rounded-full border border-border text-ash text-sm tracking-widest uppercase hover:border-copper-500/40 hover:text-bone transition-all">
                    ← Atrás
                  </button>
                  <button
                    onClick={() => day && time && setStep(3)}
                    disabled={!day || !time}
                    className="px-10 py-4 rounded-full font-display font-bold text-sm tracking-widest uppercase text-void disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: day && time ? 'linear-gradient(135deg, #cd7f32, #e8a87c)' : '#333' }}
                  >
                    Continuar →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Personal info */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-bone mb-6 tracking-tight">Tus datos</h2>
                    <form onSubmit={handleConfirm} className="space-y-4">
                      <input
                        placeholder="Nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-surface border border-border-subtle rounded-xl px-5 py-4 text-bone placeholder-steel outline-none focus:border-copper-500/50 transition-all"
                      />
                      <input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-surface border border-border-subtle rounded-xl px-5 py-4 text-bone placeholder-steel outline-none focus:border-copper-500/50 transition-all"
                      />
                      <input
                        placeholder="Teléfono"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface border border-border-subtle rounded-xl px-5 py-4 text-bone placeholder-steel outline-none focus:border-copper-500/50 transition-all"
                      />
                      <div className="mt-6 flex gap-4">
                        <button type="button" onClick={() => setStep(2)} className="px-8 py-4 rounded-full border border-border text-ash text-sm tracking-widest uppercase hover:border-copper-500/40 hover:text-bone transition-all">
                          ← Atrás
                        </button>
                        <button type="submit" className="px-10 py-4 rounded-full font-display font-bold text-sm tracking-widest uppercase text-void" style={{ background: 'linear-gradient(135deg, #cd7f32, #e8a87c)' }}>
                          Confirmar Reserva →
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Summary */}
                  <div className="bg-surface rounded-2xl border border-border-subtle p-8 h-fit">
                    <p className="text-copper-400 text-xs tracking-ultra uppercase mb-6">Resumen</p>
                    <div className="space-y-4">
                      {[
                        { label: 'Servicio', value: service },
                        { label: 'Barbero',  value: barber },
                        { label: 'Fecha',    value: day ? `${day} de ${monthNames[month]} de ${year}` : '—' },
                        { label: 'Hora',     value: time || '—' },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-start border-b border-border-subtle pb-4 last:border-0 last:pb-0">
                          <span className="text-steel text-sm">{item.label}</span>
                          <span className="text-bone text-sm font-medium text-right max-w-[60%]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </RootLayout>
  );
}
