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
  { id: 'b1', name: 'Corte Clásico / Fade', price: 15, duration: 30 },
  { id: 'b2', name: 'Corte + Arreglo de Barba', price: 22, duration: 45 },
  { id: 'b3', name: 'Solo Barba', price: 10, duration: 20 },
];

const INFANTIL_SERVICES = [
  { id: 'k1', name: 'Corte Infantil (hasta 12 años)', price: 12, duration: 30 },
  { id: 'k2', name: 'Primer Corte (Incluye diploma)', price: 15, duration: 40 },
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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#111] border border-onyx rounded-3xl shadow-2xl p-6 md:p-10 pointer-events-auto relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={resetAndClose}
                className="absolute top-4 right-4 p-2 text-steel hover:text-bone bg-carbon rounded-full hover:bg-onyx transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Progress Steps */}
              <div className="flex gap-2 mb-8 shrink-0">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-500", i <= step ? "bg-amber-400" : "bg-carbon")} />
                ))}
              </div>

              {/* Contenido animado (JSX in-line para evitar pérdida de foco al renderizar) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[350px]"
                  >
                    
                    {/* STEP 1: ELECCIÓN SECCIÓN */}
                    {step === 1 && (
                      <div className="space-y-6 text-bone">
                        <h3 className="text-2xl font-display font-bold text-center mb-8">¿Qué necesitas hoy?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={() => {
                              setServiceType('barberia');
                              setSelectedService(null);
                              nextStep();
                            }}
                            className={cn(
                              "p-6 border-2 rounded-2xl flex flex-col items-center gap-4 transition-all duration-300",
                              serviceType === 'barberia' ? "border-amber-400 bg-void text-bone" : "border-carbon hover:border-amber-400/50 hover:bg-carbon text-ash"
                            )}
                          >
                            <Scissors className="w-12 h-12" />
                            <span className="font-display font-bold tracking-wider">LA BARBERÍA</span>
                          </button>
                          <button
                            onClick={() => {
                              setServiceType('infantil');
                              setSelectedService(null);
                              nextStep();
                            }}
                            className={cn(
                              "p-6 border-2 rounded-2xl flex flex-col items-center gap-4 transition-all duration-300",
                              serviceType === 'infantil' ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-carbon hover:border-emerald-400/50 hover:bg-carbon text-ash"
                            )}
                          >
                            <Baby className="w-12 h-12" />
                            <span className="font-display font-bold tracking-wider">PELUQUERÍA INFANTIL</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: SERVICIO */}
                    {step === 2 && (
                      <div className="space-y-6 text-bone">
                        <h3 className="text-2xl font-display font-bold text-center mb-6">Selecciona el servicio</h3>
                        <div className="space-y-3">
                          {services.map(svc => (
                            <button
                              key={svc.id}
                              onClick={() => setSelectedService(svc)}
                              className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 text-left",
                                selectedService?.id === svc.id 
                                  ? (isKids ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-amber-400 bg-carbon text-bone")
                                  : "border-onyx hover:border-steel bg-[#111] text-ash"
                              )}
                            >
                              <div>
                                <p className="font-bold">{svc.name}</p>
                                <p className={cn("text-xs mt-1", selectedService?.id === svc.id ? (isKids ? "text-emerald-700" : "text-amber-400") : "text-steel")}>
                                  {svc.duration} min
                                </p>
                              </div>
                              <div className="font-display font-black text-lg">
                                {svc.price}€
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between mt-8">
                          <button onClick={prevStep} className="px-6 py-2 text-steel hover:text-bone transition-colors cursor-pointer">Volver</button>
                          <button 
                            disabled={!selectedService}
                            onClick={nextStep} 
                            className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 bg-amber-400 text-void font-bold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                          >
                            Continuar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: DÍA Y HORA */}
                    {step === 3 && (
                      <div className="space-y-6 text-bone flex flex-col h-full">
                        <h3 className="text-2xl font-display font-bold text-center mb-2">Elige fecha y hora</h3>
                        
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                          <div className="bg-carbon/50 p-4 rounded-2xl border border-onyx flex justify-center">
                            <style>{`
                              /* Reset default styles */
                              .rdp { --rdp-accent-color: transparent; margin: 0; }
                              .rdp-day, .rdp-cell { border: none !important; background: transparent !important; border-radius: 50% !important; }
                              
                              /* Button base */
                              .rdp-button, .rdp-day_button { 
                                border-radius: 50% !important; 
                                border: none !important; 
                                box-shadow: none !important; 
                                outline: none !important; 
                                background: transparent !important;
                              }
                              
                              /* Hover state */
                              .rdp-button:hover:not([disabled]) { 
                                background-color: #27272a !important; 
                                color: #fbbf24 !important; 
                              }

                              /* Selected state (wrapper & button) */
                              .rdp-selected, .rdp-day_selected { 
                                border: none !important; 
                                background: transparent !important; 
                              }
                              /* The user wants ONLY a yellow ring, no yellow background */
                              .rdp-selected .rdp-button, .rdp-selected .rdp-day_button, button.rdp-selected, button.rdp-day_selected {
                                background-color: transparent !important; 
                                color: #fbbf24 !important; 
                                font-weight: bold !important; 
                                border: 2px solid #fbbf24 !important;
                                box-shadow: none !important;
                              }

                              /* Today state - REMOVE THE SQUARE/BORDER entirely */
                              .rdp-today, .rdp-day_today { 
                                border: none !important; 
                                background: transparent !important;
                              }
                              .rdp-today .rdp-button, .rdp-today .rdp-day_button, button.rdp-today, button.rdp-day_today {
                                border: none !important; 
                                color: #fbbf24 !important;
                                font-weight: bold !important;
                              }

                              /* Nav & icons */
                              .rdp-nav_button, .rdp-nav_icon, .rdp-chevron { 
                                color: #fbbf24 !important; 
                                fill: #fbbf24 !important; 
                                stroke: #fbbf24 !important; 
                              }
                              
                              /* Outside days */
                              .rdp-outside { opacity: 0.3 !important; pointer-events: none; }
                              
                              /* Capitalize month */
                              .rdp-caption_label { text-transform: capitalize; }
                            `}</style>
                            <DayPicker 
                              mode="single"
                              selected={date}
                              onSelect={(d) => { setDate(d); setTime(null); }}
                              locale={es}
                              disabled={[
                                { before: new Date() },
                                { dayOfWeek: [0, 6] } // Sábados y Domingos cerrado
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
                                <div className="flex items-center gap-2 mb-4 text-steel">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm font-bold uppercase tracking-widest">
                                    Horarios para {format(date, "d 'de' MMMM", { locale: es })}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                  {TIME_SLOTS.map((t) => (
                                    <button 
                                      key={t} 
                                      onClick={() => setTime(t)}
                                      className={cn(
                                        "py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
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
                        </div>

                        <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
                          <button onClick={prevStep} className="px-6 py-2 text-steel hover:text-bone transition-colors">Volver</button>
                          <button 
                            disabled={!date || !time}
                            onClick={nextStep} 
                            className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 bg-amber-400 text-void font-bold rounded-lg hover:bg-amber-300 transition-colors"
                          >
                            Continuar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: DATOS DE CONTACTO */}
                    {step === 4 && (
                      <div className="space-y-6 text-bone">
                        <h3 className="text-2xl font-display font-bold text-center mb-6">Tus datos</h3>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs uppercase tracking-wider text-steel mb-2">Nombre</label>
                              <input required value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} type="text" className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400" />
                            </div>
                            <div>
                              <label className="block text-xs uppercase tracking-wider text-steel mb-2">Apellidos</label>
                              <input required value={contactData.lastName} onChange={e => setContactData({...contactData, lastName: e.target.value})} type="text" className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-steel mb-2">Correo electrónico</label>
                            <input required value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} type="email" className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400" />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-steel mb-2">Teléfono</label>
                            <input 
                              required 
                              value={contactData.phone}
                              type="tel" 
                              pattern="[0-9]{9}"
                              maxLength={9}
                              onChange={e => setContactData({...contactData, phone: e.target.value.replace(/[^0-9]/g, '')})}
                              className="w-full bg-carbon border border-onyx rounded-lg px-4 py-3 text-bone focus:outline-none focus:border-amber-400" 
                            />
                          </div>
                          <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
                            <button type="button" onClick={prevStep} className="px-6 py-2 text-steel hover:text-bone transition-colors">Volver</button>
                            <button type="submit" className="px-6 py-2 bg-amber-400 text-void font-bold rounded-lg hover:bg-amber-300 transition-colors">Continuar</button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* STEP 5: FORMA DE PAGO */}
                    {step === 5 && (
                      <div className="space-y-6 text-bone">
                        <h3 className="text-2xl font-display font-bold text-center mb-6">Forma de Pago</h3>
                        <div className="space-y-4">
                          <label className={cn(
                            "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all",
                            paymentMethod === 'local' ? "border-amber-400 bg-amber-400/10" : "border-onyx hover:border-steel bg-carbon"
                          )}>
                            <input type="radio" name="payment" value="local" checked={paymentMethod === 'local'} onChange={() => setPaymentMethod('local')} className="w-5 h-5 accent-amber-400" />
                            <div className="flex-1">
                              <p className="font-bold text-bone">Pago en el local</p>
                              <p className="text-sm text-steel">Efectivo o Tarjeta tras el servicio</p>
                            </div>
                          </label>
                          
                          <label className={cn(
                            "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all",
                            paymentMethod === 'bizum' ? "border-amber-400 bg-amber-400/10" : "border-onyx hover:border-steel bg-carbon"
                          )}>
                            <input type="radio" name="payment" value="bizum" checked={paymentMethod === 'bizum'} onChange={() => setPaymentMethod('bizum')} className="w-5 h-5 accent-amber-400" />
                            <div className="flex-1">
                              <p className="font-bold text-bone">Bizum</p>
                              <p className="text-sm text-steel">Pago rápido al 600 000 000</p>
                            </div>
                            <CreditCard className="text-steel" />
                          </label>

                          <label className="flex items-center gap-4 p-4 border border-onyx/30 rounded-xl cursor-not-allowed bg-[#0a0a0a] opacity-50 relative overflow-hidden">
                            <input type="radio" name="payment" value="stripe" disabled className="w-5 h-5" />
                            <div className="flex-1">
                              <p className="font-bold text-bone flex items-center gap-2">
                                Pago con Tarjeta Online 
                                <span className="bg-amber-400 text-void text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Próximamente</span>
                              </p>
                              <p className="text-sm text-steel">Pago 100% seguro con Stripe</p>
                            </div>
                            <CreditCard className="text-steel" />
                          </label>
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                          <button onClick={prevStep} className="px-6 py-2 text-steel hover:text-bone transition-colors">Volver</button>
                          <button onClick={nextStep} className="px-6 py-2 bg-amber-400 text-void font-bold rounded-lg hover:bg-amber-300 transition-colors">
                            Continuar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 6: REVISIÓN DE LA CITA Y CHECKBOX LEGAL */}
                    {step === 6 && (
                      <div className="space-y-6 text-bone">
                        <h3 className="text-2xl font-display font-bold text-center mb-6">Revisa tu Cita</h3>
                        
                        <div className="bg-carbon border border-onyx rounded-2xl p-6 space-y-4">
                          <div className="flex items-start justify-between border-b border-white/10 pb-4">
                            <div>
                              <p className="text-xs text-amber-400 uppercase tracking-widest mb-1">{isKids ? "Peluquería Infantil" : "Barbería"}</p>
                              <p className="font-bold text-lg">{selectedService?.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-steel uppercase tracking-widest mb-1">Total</p>
                              <p className="font-bold text-amber-400 text-xl">{selectedService?.price}€</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 py-2 border-b border-white/10">
                            <CalendarIcon className="w-5 h-5 text-steel" />
                            <div>
                              <p className="text-sm font-bold capitalize">{date && format(date, "EEEE, d 'de' MMMM yyyy", { locale: es })}</p>
                              <p className="text-xs text-steel">A las {time}h ({selectedService?.duration} min)</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 py-2 border-b border-white/10">
                            <User className="w-5 h-5 text-steel" />
                            <div>
                              <p className="text-sm font-bold">{contactData.name} {contactData.lastName}</p>
                              <p className="text-xs text-steel">{contactData.email} • {contactData.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 py-2">
                            <CreditCard className="w-5 h-5 text-steel" />
                            <div>
                              <p className="text-sm font-bold">Pago seleccionado</p>
                              <p className="text-xs text-steel capitalize">{paymentMethod === 'local' ? 'Pago en el local (Efectivo/Tarjeta)' : paymentMethod}</p>
                            </div>
                          </div>
                        </div>

                        {/* Legal Consent */}
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
                              className="mt-1 w-4 h-4 accent-amber-400 shrink-0" 
                            />
                            <p className="text-xs text-steel group-hover:text-ash transition-colors">
                              He leído y acepto los <a href="/terminos-reserva" target="_blank" className="text-amber-400 hover:underline">Términos de Reserva</a> y la <a href="/politica-privacidad" target="_blank" className="text-amber-400 hover:underline">Política de Privacidad</a>, y consiento el tratamiento de mis datos para gestionar esta cita.
                            </p>
                          </label>
                          {showTermsError && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mt-3 text-red-400 text-xs font-bold">
                              <AlertCircle className="w-4 h-4" />
                              Debes aceptar los términos para poder continuar.
                            </motion.div>
                          )}
                        </div>

                        <div className="flex justify-between mt-8">
                          <button onClick={prevStep} className="px-6 py-2 text-steel hover:text-bone transition-colors">Volver</button>
                          <button onClick={() => {
                            if (!acceptedTerms) {
                              setShowTermsError(true);
                              return;
                            }
                            alert('¡Reserva confirmada con éxito!');
                            resetAndClose();
                          }} className="px-8 py-3 bg-amber-400 text-void font-bold rounded-lg hover:bg-amber-300 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/20">
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
