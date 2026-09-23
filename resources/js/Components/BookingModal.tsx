import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Scissors, Baby, Calendar as CalendarIcon, Clock, AlertCircle, User } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, addMonths } from 'date-fns';
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
    subtitle: 'Corte de pelo, lavado y arreglo de cejas.',
    duration: 30,
    durationLabel: '30 min',
    price: 12,
  },
  {
    id: 'b2',
    name: 'Corte + Barba',
    subtitle: 'Corte completo más arreglo y perfilado de barba con navaja y productos premium.',
    duration: 60,
    durationLabel: '45–60 min',
    price: 15,
  },
  {
    id: 'b3',
    name: 'Solo Barba',
    subtitle: 'Arreglo, perfilado y acabado de barba.',
    duration: 20,
    durationLabel: '15–30 min',
    price: 4,
  },
];

const INFANTIL_SERVICES = [
  {
    id: 'k1',
    name: 'Corte Infantil',
    subtitle: 'Corte profesional para niños, niñas y adolescentes.',
    duration: 45,
    durationLabel: '30 – 60 min',
  },
  {
    id: 'k2',
    name: 'Peinados',
    subtitle: 'Trenzas, coletas, ondas y peinados especiales para niñas.',
    duration: 45,
  },
  {
    id: 'k3',
    name: 'Accesorios',
    subtitle: 'Coletas, lazos, broches y brillos para el look de las pequeñas.',
    duration: 20,
    durationLabel: '15 – 30 min',
  },
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
  const [contactData, setContactData] = useState({ name: '', lastName: '', email: '', phonePrefix: '+34', customPrefix: '', phone: '' });
  const [acceptedTerms, setTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'local' | 'bizum' | 'stripe'>('local');
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  
  const [observations, setObservations] = useState("");
  const [loyaltyData, setLoyaltyData] = useState<{exists: boolean, loyalty_points: number, penalty_flag: boolean} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contactData.email);
  const showEmailErrorRealtime = contactData.email.length > 0 && !isEmailValid;

  React.useEffect(() => {
    if (date && serviceType && selectedService) {
      const fetchSlots = async () => {
        setIsLoadingSlots(true);
        try {
          const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
          const res = await fetch('/api/available-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken || '' },
            body: JSON.stringify({
              date: format(date, 'yyyy-MM-dd'),
              service_type: serviceType,
              duration: selectedService?.duration || 30
            })
          });
          const data = await res.json();
          setAvailableSlots(data.available_slots || []);
        } catch (e) {
          console.error(e);
          setAvailableSlots([]);
        } finally {
          setIsLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [date, serviceType, selectedService]);

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

  // Handle preSelectedService from service cards
  React.useEffect(() => {
    const handleOpen = (e: any) => {
      const { serviceType: sType, preSelectedService } = e.detail || {};
      if (preSelectedService) {
        setServiceType(sType);
        setSelectedService(preSelectedService);
        setDate(undefined);
        setTime(null);
        setContactData({ name: '', lastName: '', email: '', phonePrefix: '+34', phone: '' });
        setTermsAccepted(false);
        setShowTermsError(false);
        setPaymentMethod('local');
        setStep(3); // skip to date/time step
      }
    };
    document.addEventListener('openBookingModal', handleOpen);
    return () => document.removeEventListener('openBookingModal', handleOpen);
  }, []);

  const nextStep = async () => {
    if (step === 4) {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const res = await fetch('/api/check-loyalty', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken || ''
          },
          body: JSON.stringify({ email: contactData.email })
        });
        const data = await res.json();
        setLoyaltyData(data);
      } catch (err) {
        console.error(err);
      }
    }
    setStep((s) => Math.min(s + 1, 6));
  };
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
    setContactData({ name: '', lastName: '', email: '', phonePrefix: '+34', customPrefix: '', phone: '' });
    setTermsAccepted(false);
    setShowTermsError(false);
    setPaymentMethod('local');
    setObservations("");
    setLoyaltyData(null);
    setSubmitStatus('idle');
    setSubmitError("");
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
                              setContactData({ name: '', lastName: '', email: '', phonePrefix: '+34', phone: '' });
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
                              setContactData({ name: '', lastName: '', email: '', phonePrefix: '+34', phone: '' });
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
                            <span className="font-display font-bold tracking-wider text-sm text-center">PELUQUERÍA INFANTIL</span>
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
                                <div className="font-display font-black text-xl md:text-2xl shrink-0 text-amber-400">
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
                            onSelect={(d) => { 
                              setDate(d); 
                              setTime(null); 
                              if (!d) {
                                setAvailableSlots([]);
                              }
                            }}
                            locale={es}
                            disabled={[
                              { before: new Date() },
                              { after: addMonths(new Date(), 6) },
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
                              {isLoadingSlots ? (
                                <div className="flex justify-center items-center py-8">
                                  <span className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                                </div>
                              ) : (
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                  {TIME_SLOTS.map((t) => {
                                    const isAvailable = availableSlots.includes(t);
                                    return (
                                      <button
                                        key={t}
                                        disabled={!isAvailable}
                                        onClick={() => setTime(t)}
                                        className={cn(
                                          "relative flex items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                                          isAvailable ? "active:scale-95 cursor-pointer" : "opacity-40 cursor-not-allowed bg-[#0a0a0a] border-onyx text-steel/50",
                                          time === t
                                            ? "bg-amber-400 text-void border-amber-400"
                                            : (isAvailable ? "bg-[#111] text-ash border-onyx hover:border-steel" : "")
                                        )}
                                      >
                                        <span className={cn(isAvailable ? "" : "line-through")}>{t}</span>
                                        {!isAvailable && (
                                          <X className="w-3.5 h-3.5 absolute right-2 text-steel/40" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
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
                        
                        <div className="bg-blue-950/40 border border-blue-900/50 rounded-xl p-4 mb-6 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-200/90 leading-relaxed space-y-2">
                              <p>
                                <strong className="text-blue-300 font-bold block mb-0.5 text-sm">💈 Sistema de Fidelidad Inteligente</strong>
                                Acumulas 1 punto por cada corte. <strong className="text-amber-400">¡Al llegar a 9 puntos, tu 10º corte es GRATIS!</strong>
                              </p>
                              <div className="space-y-1.5 opacity-90 border-t border-blue-800/50 pt-2 mt-2">
                                <p className="font-bold text-blue-300">¿Qué pasa si me equivoco de datos al reservar?</p>
                                <p>✓ <strong className="text-emerald-400">Si mantienes tu Teléfono O tu Email:</strong> Basta con que UNA sola cosa (teléfono o correo) coincida con CUALQUIERA que hayas usado en el pasado. El sistema te reconocerá al instante y sumará tu corte.</p>
                                <p>✓ <strong className="text-emerald-400">Si cambias ambos (Teléfono y Email):</strong> Nuestro sistema buscará por tu Nombre y Apellidos. Para evitar fraudes, en este caso exigimos una coincidencia ultra estricta del 90%. Escribe tu nombre exactamente igual que en tus citas anteriores para no perder los puntos.</p>
                              </div>
                              <p className="text-[10px] uppercase tracking-wider font-bold text-blue-400 pt-1">
                                ¿Dudas sobre tus puntos? → soporte@lunistyles.com
                              </p>
                            </div>
                          </div>
                        </div>
                        <form className="space-y-3" onSubmit={(e) => { 
                          e.preventDefault(); 
                          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                          if (!emailRegex.test(contactData.email)) {
                            alert("Por favor, introduce un correo electrónico válido, incluyendo el dominio (ej: @gmail.com)");
                            return;
                          }
                          nextStep(); 
                        }}>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Nombre</label>
                              <input
                                required
                                value={contactData.name}
                                onChange={e => setContactData({...contactData, name: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})}
                                type="text"
                                className="w-full bg-carbon border border-amber-400/40 rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Apellidos</label>
                              <input
                                required
                                value={contactData.lastName}
                                onChange={e => setContactData({...contactData, lastName: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})}
                                type="text"
                                className="w-full bg-carbon border border-amber-400/40 rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
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
                              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                              title="Debe ser un correo electrónico válido, ej: nombre@dominio.com"
                              className={cn("w-full bg-carbon border rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none transition-all", showEmailErrorRealtime ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-amber-400/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400")}
                            />
                            {showEmailErrorRealtime && (
                              <div className="mt-2 flex items-start gap-2 text-red-400 bg-red-950/30 p-2.5 rounded-lg border border-red-900/50">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p className="text-xs">Formato no válido. Debe incluir un dominio real (ej: @gmail.com)</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Teléfono</label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setShowPhoneDropdown(!showPhoneDropdown)}
                                className="w-24 md:w-28 bg-carbon border border-amber-400/40 rounded-xl px-2 py-3 text-bone text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 flex items-center justify-center gap-2 shrink-0 transition-all"
                              >
                                {contactData.phonePrefix === 'Otro' ? (
                                  <span>🌍 Otro</span>
                                ) : (
                                  <>
                                    <img src={`https://flagcdn.com/w20/${COUNTRY_CODES.find(c => c.code === contactData.phonePrefix)?.iso}.png`} alt="" className="w-4 h-3 object-cover rounded-sm" />
                                    <span>{contactData.phonePrefix}</span>
                                  </>
                                )}
                              </button>
                              <input
                                required
                                value={contactData.phone}
                                type="tel"
                                pattern={contactData.phonePrefix === 'Otro' ? `[0-9]{8,15}` : `[0-9]{${COUNTRY_CODES.find(c => c.code === contactData.phonePrefix)?.maxLength || 9}}`}
                                maxLength={contactData.phonePrefix === 'Otro' ? 15 : COUNTRY_CODES.find(c => c.code === contactData.phonePrefix)?.maxLength || 9}
                                title={contactData.phonePrefix === 'Otro' ? "El número debe tener entre 8 y 15 dígitos (estándar internacional)" : `El número debe tener ${COUNTRY_CODES.find(c => c.code === contactData.phonePrefix)?.maxLength || 9} dígitos para ${contactData.phonePrefix}`}
                                onChange={e => setContactData({...contactData, phone: e.target.value.replace(/[^0-9]/g, '')})}
                                className="flex-1 min-w-0 bg-carbon border border-amber-400/40 rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                              />
                            </div>
                            {showPhoneDropdown && (
                              <div className="mt-2 w-full max-h-40 overflow-y-auto bg-[#111] border border-onyx rounded-xl p-1.5 grid grid-cols-2 sm:grid-cols-3 gap-1.5 custom-scrollbar">
                                {COUNTRY_CODES.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                      setContactData({...contactData, phonePrefix: c.code, customPrefix: '', phone: ''});
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
                            {contactData.phonePrefix === 'Otro' && (
                              <div className="mt-3">
                                <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Prefijo Manual</label>
                                <input
                                  required
                                  value={contactData.customPrefix}
                                  type="text"
                                  placeholder="+XX"
                                  maxLength={5}
                                  onChange={e => setContactData({...contactData, customPrefix: e.target.value.replace(/[^0-9+]/g, '')})}
                                  className="w-full bg-carbon border border-amber-400/40 rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                            <button type="button" onClick={prevStep} className="px-5 py-2 text-steel hover:text-bone transition-colors text-sm">Volver</button>
                            <button 
                            type="submit" 
                            disabled={showEmailErrorRealtime}
                            className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm active:scale-95"
                          >
                            Continuar
                          </button>
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
                              <p className="font-bold text-bone text-sm">Pago (en el local)</p>
                              <p className="text-xs text-steel">{isKids ? 'Efectivo tras el servicio' : 'Efectivo o Tarjeta tras el servicio'}</p>
                            </div>
                          </label>

                          <label className={cn(
                            "flex items-center gap-4 p-4 border rounded-xl transition-all",
                            isKids ? "border-onyx/30 bg-[#0a0a0a] opacity-50 cursor-not-allowed" : (paymentMethod === 'bizum' ? "border-amber-400 bg-amber-400/10 cursor-pointer active:scale-[0.99]" : "border-onyx hover:border-steel bg-carbon cursor-pointer active:scale-[0.99]")
                          )}>
                            <input type="radio" name="payment" value="bizum" checked={paymentMethod === 'bizum'} onChange={() => setPaymentMethod('bizum')} disabled={isKids} className={cn("w-4 h-4", !isKids && "accent-amber-400")} />
                            <div className="flex-1">
                              <p className="font-bold text-bone text-sm flex items-center gap-2">
                                Bizum (en el local)
                                {isKids && <span className="bg-amber-400 text-void text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Próximamente</span>}
                              </p>
                              {isKids ? (
                                <p className="text-xs text-steel">Pelu. Infantil: +34 675 37 28 13</p>
                              ) : (
                                <p className="text-xs text-steel">Barbería: +34 623 59 98 90</p>
                              )}
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
                            {!isKids && selectedService?.price != null && (
                              <div className="text-right shrink-0 ml-3">
                                <p className="text-[10px] text-steel uppercase tracking-widest mb-0.5">Total</p>
                                {loyaltyData?.loyalty_points && loyaltyData.loyalty_points >= 9 ? (
                                  <p className="font-bold text-emerald-400 text-lg">Gratis</p>
                                ) : (
                                  <p className="font-bold text-amber-400 text-lg">{selectedService.price}€</p>
                                )}
                              </div>
                            )}
                            {isKids && (
                              <div className="text-right shrink-0 ml-3">
                                <p className="text-[10px] text-amber-400 uppercase tracking-widest mb-0.5">Consultar precio</p>
                                <a href="tel:+34675372813" className="font-bold text-emerald-400 text-sm hover:text-emerald-300 transition-colors">+34 675 37 28 13</a>
                              </div>
                            )}
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
                              <p className="text-[10px] text-steel">{contactData.email} · {contactData.phonePrefix === 'Otro' ? contactData.customPrefix : contactData.phonePrefix} {contactData.phone}</p>
                            </div>
                          </div>

                          {/* Payment */}
                          <div className="flex items-center gap-3 py-2">
                            <CreditCard className="w-4 h-4 text-steel shrink-0" />
                            <div>
                              <p className="text-xs font-bold">Forma de pago</p>
                              <p className="text-[10px] text-steel capitalize">
                                {paymentMethod === 'local' ? (isKids ? 'Pago (en el local - Efectivo)' : 'Pago (en el local - Efectivo/Tarjeta)') : (paymentMethod === 'bizum' ? 'Bizum (en el local)' : paymentMethod)}
                              </p>
                            </div>
                          </div>
                        </div>

                          {/* Loyalty Banner */}
                          {loyaltyData?.exists && !isKids && (
                            <div className={cn(
                              "p-4 rounded-xl border",
                              loyaltyData.loyalty_points >= 9 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                : "bg-amber-400/10 border-amber-400/30 text-amber-400"
                            )}>
                              <div className="flex items-start gap-3">
                                <Scissors className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-sm">
                                    {loyaltyData.loyalty_points >= 9 
                                      ? "🎉 ¡Enhorabuena! Este es tu 10º corte." 
                                      : `💈 ¡Llevas ${loyaltyData.loyalty_points} cortes acumulados!`}
                                  </p>
                                  <p className="text-xs opacity-90 mt-1">
                                    {loyaltyData.loyalty_points >= 9
                                      ? "Al ir al local, el corte te saldrá totalmente GRATIS."
                                      : `Te faltan ${9 - loyaltyData.loyalty_points} para tu corte gratis.`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Observations */}
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-steel mb-1.5">Observaciones (Opcional)</label>
                            <textarea
                              value={observations}
                              onChange={(e) => setObservations(e.target.value)}
                              placeholder="Ej: Prefiero corte a tijera, o cualquier otra indicación..."
                              className="w-full bg-carbon border border-onyx rounded-xl px-3.5 py-3 text-bone text-sm focus:outline-none focus:border-amber-400 transition-all resize-none h-20 custom-scrollbar"
                            />
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
                          <button onClick={prevStep} disabled={isSubmitting} className="disabled:opacity-50 px-5 py-2 text-steel hover:text-bone transition-colors text-sm">Volver</button>
                          <button
                            disabled={isSubmitting}
                            onClick={async () => {
                              if (!acceptedTerms) { setShowTermsError(true); return; }
                              setIsSubmitting(true);
                              setSubmitError("");
                              
                              try {
                                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                                const res = await fetch('/api/booking', {
                                  method: 'POST',
                                  headers: { 
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': csrfToken || ''
                                  },
                                  body: JSON.stringify({
                                    nombre: contactData.name,
                                    apellidos: contactData.lastName,
                                    email: contactData.email,
                                    telefono: (contactData.phonePrefix === 'Otro' ? contactData.customPrefix : contactData.phonePrefix) + ' ' + contactData.phone,
                                    fecha: date ? format(date, 'yyyy-MM-dd') : '',
                                    hora: time,
                                    servicio: selectedService?.name,
                                    tipo_servicio: serviceType,
                                    precio: (loyaltyData?.loyalty_points && loyaltyData.loyalty_points >= 9) ? 'Gratis' : (selectedService?.price?.toString() || 'Variable'),
                                    observaciones: observations
                                  })
                                });

                                const data = await res.json();
                                if (res.ok && data.success) {
                                  setSubmitStatus('success');
                                } else {
                                  setSubmitStatus('error');
                                  setSubmitError(data.message || 'Error al procesar la reserva.');
                                }
                              } catch (err) {
                                setSubmitStatus('error');
                                setSubmitError('Fallo de conexión. Inténtalo de nuevo.');
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                            className="disabled:opacity-50 disabled:cursor-not-allowed px-7 py-3 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/20 text-sm flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                                PROCESANDO...
                              </>
                            ) : (
                              'CONFIRMAR CITA'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* STEP 7: RESULTADO DE LA CITA */}
                    {submitStatus !== 'idle' && step === 6 && (
                      <div className="absolute inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center justify-center p-6 text-center rounded-3xl">
                        {submitStatus === 'success' ? (
                          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-void">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-bone mb-2">¡Cita confirmada!</h3>
                            <p className="text-steel mb-8">Te esperamos el {date && format(date, "d 'de' MMMM", { locale: es })} a las {time}h.</p>
                            <button onClick={resetAndClose} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                              Cerrar
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                              <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white">
                                <X className="w-8 h-8" strokeWidth={3} />
                              </div>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-bone mb-2">Error al reservar</h3>
                            <p className="text-red-400 mb-8">{submitError}</p>
                            <div className="flex gap-4">
                              <button onClick={() => setSubmitStatus('idle')} className="px-6 py-3 border border-onyx text-bone font-bold rounded-xl hover:bg-white/5 transition-colors">
                                Intentar de nuevo
                              </button>
                              <button onClick={resetAndClose} className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                Cerrar
                              </button>
                            </div>
                          </motion.div>
                        )}
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
