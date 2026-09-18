import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Scissors, Baby, Calendar as CalendarIcon, Clock, AlertCircle, User } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: 'barberia' | 'infantil' | null;
}

const BARBERIA_SERVICES = [
  {
    id: 'b1',
    name: 'Corte Normal',
    subtitle: 'Corte de pelo, lavado y arreglo de cejas. El esencial del día a día.',
    duration: 30,
    durationLabel: '30 min',
  },
  {
    id: 'b2',
    name: 'Corte + Barba',
    subtitle: 'Corte completo más arreglo y perfilado de barba con navaja y productos premium.',
    duration: 60,
    durationLabel: '45–60 min',
  },
  {
    id: 'b3',
    name: 'Solo Barba',
    subtitle: 'Arreglo, perfilado y acabado de barba. Ideal para mantenimiento rápido.',
    duration: 20,
    durationLabel: '15–30 min',
  },
];

const INFANTIL_SERVICES = [
  {
    id: 'k1',
    name: 'Corte Infantil',
    subtitle: 'Corte profesional para niños, niñas y adolescentes adaptado a cada edad y tipo de cabello.',
    duration: 45,
    durationLabel: '30 – 60 min',
  },
  {
    id: 'k2',
    name: 'Peinados',
    subtitle: 'Trenzas, coletas, ondas y peinados especiales para niñas. Perfectos para el día a día o cualquier ocasión.',
    duration: 45,
    durationLabel: '30 – 60 min',
  },
  {
    id: 'k3',
    name: 'Accesorios',
    subtitle: 'Coletas, lazos, broches y brillos para dar el toque final y especial al look de las pequeñas.',
    duration: 20,
    durationLabel: '15 – 30 min',
  },
];

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

export default function BookingModal({ isOpen, onClose, initialServiceType }: BookingModalProps) {
  const [step, setStep] = useState(1);

  // Form State
  const [serviceType, setServiceType] = useState<'barberia' | 'infantil' | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [contactData, setContactData] = useState({ name: '', lastName: '', email: '', phone: '' });
  const [acceptedTerms, setTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'local' | 'bizum' | 'stripe'>('local');

  React.useEffect(() => {
    if (isOpen) {
      if (initialServiceType) {
        setServiceType(initialServiceType);
        setStep(2);
      } else {
        setServiceType(null);
        setStep(1);
      }
    }
  }, [isOpen, initialServiceType]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => {
    if (step === 2 && initialServiceType) {
      onClose();
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setServiceType(null);
    setSelectedService(null);
    setDate(undefined);
    setTime(null);
    setContactData({ name: '', lastName: '', email: '', phone: '' });
    setTermsAccepted(false);
    setShowTermsError(false);
    setPaymentMethod('local');
    onClose();
  };

  const isKids = serviceType === 'infantil';
  const services = serviceType === 'barberia' ? BARBERIA_SERVICES : INFANTIL_SERVICES;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-void/90 backdrop-blur-md z-50"
          />
          {/* Full-screen on mobile, centered modal on desktop */}
          <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="w-full sm:max-w-xl bg-[#111] border border-onyx sm:rounded-3xl rounded-t-3xl shadow-2xl pointer-events-auto relative flex flex-col"
              style={{ maxHeight: '92vh' }}
            >
              {/* Drag handle visible on mobile */}
              <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1 shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 md:px-8 pt-4 md:pt-6 pb-3 shrink-0">
                <p className="text-[10px] text-steel uppercase tracking-widest font-bold">
                  Paso {step} de 6
                </p>
                <button
                  onClick={resetAndClose}
                  className="p-2 text-steel hover:text-bone bg-carbon rounded-full hover:bg-onyx transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex gap-1.5 px-5 md:px-8 pb-4 shrink-0">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-500", i <= step ? "bg-amber-400" : "bg-carbon")} />
                ))}
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5 md:px-8 pb-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.18 }}
                  >

                    {/* STEP 1: ELECCIÓN SECCIÓN */}
                    {step === 1 && (
                      <div className="space-y-5 text-bone">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-center mb-6">¿Qué deseas reservar?</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              setServiceType('barberia');
                              setSelectedService(null);
                              setDate(undefined);
                              setTime(null);
                              setContactData({ name: '', lastName: '', email: '', phone: '' });
                              setTermsAccepted(false);
                              setShowTermsError(false);
                              setPaymentMethod('local');
                              nextStep();
                            }}
                            className={cn(
                              "p-5 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 active:scale-95",
                              serviceType === 'barberia' ? "border-amber-400 bg-void text-bone" : "border-carbon hover:border-amber-400/50 hover:bg-carbon text-ash"
                            )}
                          >
                            <Scissors className="w-9 h-9" />
                            <span className="font-display font-bold tracking-wider text-sm text-center">BARBERÍA</span>
                          </button>
                          <button
                            onClick={() => {
                              setServiceType('infantil');
                              setSelectedService(null);
                              setDate(undefined);
                              setTime(null);
                              setContactData({ name: '', lastName: '', email: '', phone: '' });
                              setTermsAccepted(false);
                              setShowTermsError(false);
                              setPaymentMethod('local');
                              nextStep();
                            }}
                            className={cn(
                              "p-5 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 active:scale-95",
                              serviceType === 'infantil' ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-carbon hover:border-emerald-400/50 hover:bg-carbon text-ash"
                            )}
                          >
                            <Baby className="w-9 h-9" />
                            <span className="font-display font-bold tracking-wider text-sm text-center">CORTE INFANTIL</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: SERVICIO */}
                    {step === 2 && (
                      <div className="space-y-4 text-bone">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-center mb-5">Selecciona el servicio</h3>
                        <div className="space-y-2.5">
                          {services.map(svc => (
                            <button
                              key={svc.id}
                              onClick={() => setSelectedService(svc)}
                              className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 text-left active:scale-[0.99]",
                                selectedService?.id === svc.id
                                  ? (isKids ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-amber-400 bg-carbon text-bone")
                                  : "border-onyx hover:border-steel bg-[#111] text-ash"
                              )}
                            >
                              <div className="flex-1 min-w-0 pr-3">
                                <p className="font-bold text-sm md:text-base">{svc.name}</p>
                                {svc.subtitle && (
                                  <p className={cn("text-xs mt-0.5 truncate", selectedService?.id === svc.id ? (isKids ? "text-emerald-600" : "text-ash/70") : "text-steel")}>
                                    {svc.subtitle}
                                  </p>
                                )}
                                <p className={cn("text-[10px] mt-1 flex items-center gap-1", selectedService?.id === svc.id ? (isKids ? "text-emerald-700" : "text-amber-400") : "text-steel")}>
                                  <Clock className="w-3 h-3 shrink-0" />
                                  {(svc as any).durationLabel ?? `${svc.duration} min`}
                                </p>
                              </div>
                              {(svc as any).price != null && (
                                <div className="font-display font-black text-xl md:text-2xl shrink-0">
                                  {(svc as any).price}€
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                          <button onClick={prevStep} className="px-5 py-2 text-steel hover:text-bone transition-colors text-sm">Volver</button>
                          <button
                            disabled={!selectedService}
                            onClick={nextStep}
                            className="disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm active:scale-95"
                          >
                            Continuar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: DÍA Y HORA */}
                    {step === 3 && (
                      <div className="space-y-4 text-bone">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-center mb-2">Elige fecha y hora</h3>

                        <div className="bg-carbon/50 p-3 md:p-4 rounded-2xl border border-onyx flex justify-center overflow-hidden">
                          <style>{`
                            .rdp { --rdp-accent-color: transparent; margin: 0; }
                            .rdp-day, .rdp-cell { border: none !important; background: transparent !important; border-radius: 50% !important; }
                            .rdp-button, .rdp-day_button {
                              border-radius: 50% !important;
                              border: none !important;
                              box-shadow: none !important;
                              outline: none !important;
                              background: transparent !important;
                            }
                            .rdp-button:hover:not([disabled]) {
                              background-color: #27272a !important;
                              color: #fbbf24 !important;
                            }
                            .rdp-selected, .rdp-day_selected {
                              border: none !important;
                              background: transparent !important;
                            }
                            .rdp-selected .rdp-button, .rdp-selected .rdp-day_button, button.rdp-selected, button.rdp-day_selected {
                              background-color: transparent !important;
                              color: #fbbf24 !important;
                              font-weight: bold !important;
                              border: 2px solid #fbbf24 !important;
                              box-shadow: none !important;
                            }
                            .rdp-today, .rdp-day_today {
                              border: none !important;
                              background: transparent !important;
                            }
                            .rdp-today .rdp-button, .rdp-today .rdp-day_button, button.rdp-today, button.rdp-day_today {
                              border: none !important;
                              color: #fbbf24 !important;
                              font-weight: bold !important;
                            }
                            .rdp-nav_button, .rdp-nav_icon, .rdp-chevron {
                              color: #fbbf24 !important;
                              fill: #fbbf24 !important;
                              stroke: #fbbf24 !important;
                            }
                            .rdp-outside { opacity: 0.3 !important; pointer-events: none; }
                            .rdp-caption_label { text-transform: capitalize; }
                            /* Scale down calendar on mobile */
                            @media (max-width: 400px) {
                              .rdp { transform: scale(0.88); transform-origin: top center; }
                            }
                          `}</style>
                          <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={(d) => { setDate(d); setTime(null); }}
                            locale={es}
                            disabled={[
                              { before: new Date() },
                              { dayOfWeek: [0, 6] }
                            ]}
                            className="text-sm font-medium text-bone"
                          />
                        </div>

                        <AnimatePresence>
                          {date && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-carbon/50 p-4 rounded-2xl border border-onyx"
                            >
                              <div className="flex items-center gap-2 mb-3 text-steel">
                                <Clock className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                  {format(date, "d 'de' MMMM", { locale: es })}
                                </span>
                              </div>
                              {/* 4 cols on mobile, 5 on wider */}
                              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {TIME_SLOTS.map((t) => (
                                  <button
                                    key={t}
                                    onClick={() => setTime(t)}
                                    className={cn(
                                      "py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border active:scale-95",
                                      time === t
                                        ? "bg-amber-400 text-void border-amber-400"
                                        : "bg-[#111] text-ash border-onyx hover:border-steel"
                                    )}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex justify-between pt-4 border-t border-white/10">
                          <button onClick={prevStep} className="px-5 py-2 text-steel hover:text-bone transition-colors text-sm">Volver</button>
                          <button
                            disabled={!date || !time}
                            onClick={nextStep}
                            className="disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm active:scale-95"
                          >
                            Continuar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: DATOS DE CONTACTO */}
                    {step === 4 && (
                      <div className="space-y-4 text-bone">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-center mb-5">Tus datos</h3>
                        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Nombre</label>
                              <input
                                required
                                value={contactData.name}
                                onChange={e => setContactData({...contactData, name: e.target.value})}
                                type="text"
                                className="w-full bg-carbon border border-onyx rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Apellidos</label>
                              <input
                                required
                                value={contactData.lastName}
                                onChange={e => setContactData({...contactData, lastName: e.target.value})}
                                type="text"
                                className="w-full bg-carbon border border-onyx rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Correo electrónico</label>
                            <input
                              required
                              value={contactData.email}
                              onChange={e => setContactData({...contactData, email: e.target.value})}
                              type="email"
                              className="w-full bg-carbon border border-onyx rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Teléfono</label>
                            <input
                              required
                              value={contactData.phone}
                              type="tel"
                              pattern="[0-9]{9}"
                              maxLength={9}
                              onChange={e => setContactData({...contactData, phone: e.target.value.replace(/[^0-9]/g, '')})}
                              className="w-full bg-carbon border border-onyx rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400"
                            />
                          </div>
                          <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                            <button type="button" onClick={prevStep} className="px-5 py-2 text-steel hover:text-bone transition-colors text-sm">Volver</button>
                            <button type="submit" className="px-6 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm active:scale-95">Continuar</button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* STEP 5: FORMA DE PAGO */}
                    {step === 5 && (
                      <div className="space-y-4 text-bone">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-center mb-5">Forma de Pago</h3>
                        <div className="space-y-3">
                          <label className={cn(
                            "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all active:scale-[0.99]",
                            paymentMethod === 'local' ? "border-amber-400 bg-amber-400/10" : "border-onyx hover:border-steel bg-carbon"
                          )}>
                            <input type="radio" name="payment" value="local" checked={paymentMethod === 'local'} onChange={() => setPaymentMethod('local')} className="w-4 h-4 accent-amber-400" />
                            <div className="flex-1">
                              <p className="font-bold text-bone text-sm">Pago en el local</p>
                              <p className="text-xs text-steel">Efectivo o Tarjeta tras el servicio</p>
                            </div>
                          </label>

                          <label className={cn(
                            "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all active:scale-[0.99]",
                            paymentMethod === 'bizum' ? "border-amber-400 bg-amber-400/10" : "border-onyx hover:border-steel bg-carbon"
                          )}>
                            <input type="radio" name="payment" value="bizum" checked={paymentMethod === 'bizum'} onChange={() => setPaymentMethod('bizum')} className="w-4 h-4 accent-amber-400" />
                            <div className="flex-1">
                              <p className="font-bold text-bone text-sm">Bizum</p>
                              <p className="text-xs text-steel">Pago rápido al +34 613 16 90 33</p>
                            </div>
                            <CreditCard className="text-steel w-4 h-4 shrink-0" />
                          </label>

                          <label className="flex items-center gap-4 p-4 border border-onyx/30 rounded-xl cursor-not-allowed bg-[#0a0a0a] opacity-50">
                            <input type="radio" name="payment" value="stripe" disabled className="w-4 h-4" />
                            <div className="flex-1">
                              <p className="font-bold text-bone text-sm flex items-center gap-2">
                                Pago con Tarjeta Online
                                <span className="bg-amber-400 text-void text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Próximamente</span>
                              </p>
                              <p className="text-xs text-steel">Pago 100% seguro con Stripe</p>
                            </div>
                            <CreditCard className="text-steel w-4 h-4 shrink-0" />
                          </label>
                        </div>

                        <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                          <button onClick={prevStep} className="px-5 py-2 text-steel hover:text-bone transition-colors text-sm">Volver</button>
                          <button onClick={nextStep} className="px-6 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm active:scale-95">
                            Continuar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 6: REVISIÓN */}
                    {step === 6 && (
                      <div className="space-y-4 text-bone">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-center mb-5">Revisa tu Cita</h3>

                        <div className="bg-carbon border border-onyx rounded-2xl p-4 md:p-5 space-y-3">
                          {/* Service + price */}
                          <div className="flex items-start justify-between border-b border-white/10 pb-3">
                            <div>
                              <p className="text-[10px] text-amber-400 uppercase tracking-widest mb-0.5">{isKids ? 'Peluquería Infantil' : 'Barbería'}</p>
                              <p className="font-bold text-sm md:text-base">{selectedService?.name}</p>
                              {selectedService?.subtitle && (
                                <p className="text-xs text-ash mt-0.5">{selectedService.subtitle}</p>
                              )}
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <p className="text-[10px] text-steel uppercase tracking-widest mb-0.5">Total</p>
                              <p className="font-bold text-amber-400 text-lg">{selectedService?.price}€</p>
                            </div>
                          </div>

                          {/* Date + time */}
                          <div className="flex items-center gap-3 py-2 border-b border-white/10">
                            <CalendarIcon className="w-4 h-4 text-steel shrink-0" />
                            <div>
                              <p className="text-xs font-bold capitalize">{date && format(date, "EEEE, d 'de' MMMM yyyy", { locale: es })}</p>
                              <p className="text-[10px] text-steel">A las {time}h · {selectedService?.durationLabel ?? `${selectedService?.duration} min`}</p>
                            </div>
                          </div>

                          {/* Contact */}
                          <div className="flex items-center gap-3 py-2 border-b border-white/10">
                            <User className="w-4 h-4 text-steel shrink-0" />
                            <div>
                              <p className="text-xs font-bold">{contactData.name} {contactData.lastName}</p>
                              <p className="text-[10px] text-steel">{contactData.email} · {contactData.phone}</p>
                            </div>
                          </div>

                          {/* Payment */}
                          <div className="flex items-center gap-3 py-2">
                            <CreditCard className="w-4 h-4 text-steel shrink-0" />
                            <div>
                              <p className="text-xs font-bold">Forma de pago</p>
                              <p className="text-[10px] text-steel capitalize">
                                {paymentMethod === 'local' ? 'Pago en el local (Efectivo/Tarjeta)' : paymentMethod}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Legal */}
                        <div className={cn(
                          "p-4 rounded-xl border transition-colors",
                          showTermsError ? "border-red-500/50 bg-red-500/10" : "border-onyx bg-carbon/50"
                        )}>
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={acceptedTerms}
                              onChange={(e) => {
                                setTermsAccepted(e.target.checked);
                                if (e.target.checked) setShowTermsError(false);
                              }}
                              className="mt-0.5 w-4 h-4 accent-amber-400 shrink-0"
                            />
                            <p className="text-xs text-steel group-hover:text-ash transition-colors">
                              He leído y acepto los{' '}
                              <a href="/terminos-reserva" target="_blank" className="text-amber-400 hover:underline">Términos de Reserva</a>
                              {' '}y la{' '}
                              <a href="/politica-privacidad" target="_blank" className="text-amber-400 hover:underline">Política de Privacidad</a>.
                            </p>
                          </label>
                          {showTermsError && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mt-2 text-red-400 text-xs font-bold">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              Debes aceptar los términos para continuar.
                            </motion.div>
                          )}
                        </div>

                        <div className="flex justify-between mt-2">
                          <button onClick={prevStep} className="px-5 py-2 text-steel hover:text-bone transition-colors text-sm">Volver</button>
                          <button
                            onClick={() => {
                              if (!acceptedTerms) { setShowTermsError(true); return; }
                              alert('¡Reserva confirmada con éxito!');
                              resetAndClose();
                            }}
                            className="px-7 py-3 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/20 text-sm"
                          >
                            CONFIRMAR CITA
                          </button>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
