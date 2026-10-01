import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import PanelLayout from './Layout';
import {
    Plus, Search, X, Calendar as CalIcon, Clock, User,
    Phone, Mail, Edit2, Trash2, CheckCircle2, XCircle,
    Save, AlertTriangle, ChevronLeft, ChevronRight,
    SlidersHorizontal, Tag, MapPin, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// CSS para colorear de amarillo el calendario del panel
const panelCalendarCss = `
  /* Default / Barberia */
  .rdp { --rdp-accent-color: transparent; margin: 0; }
  .rdp-day, .rdp-cell { border: none !important; background: transparent !important; border-radius: 50% !important; }
  .rdp-button, .rdp-day_button {
    border-radius: 50% !important; border: none !important; box-shadow: none !important; outline: none !important;
    background: transparent !important; width: 40px !important; height: 40px !important;
  }
  .rdp-button:hover:not([disabled]) { background-color: #27272a !important; color: #fbbf24 !important; }
  .rdp-selected, .rdp-day_selected, .rdp-day_selected:hover, .rdp-day_selected:focus {
    background-color: transparent !important; border: none !important; outline: none !important; box-shadow: none !important; --tw-ring-shadow: none !important;
  }
  .rdp-selected .rdp-button, .rdp-selected .rdp-day_button, button.rdp-selected, button.rdp-day_selected {
    background-color: transparent !important; color: #ffffff !important; font-weight: bold !important; border: 2px solid #fbbf24 !important;
    box-shadow: none !important; outline: none !important; --tw-ring-shadow: none !important;
  }
  .rdp-today:not(.rdp-selected) .rdp-button, .rdp-today:not(.rdp-selected) .rdp-day_button, button.rdp-today:not(.rdp-day_selected), button.rdp-day_today:not(.rdp-day_selected) {
    border: none !important; color: #fbbf24 !important; font-weight: bold !important; background: transparent !important;
  }
  .rdp-nav_button, .rdp-nav_icon, .rdp-chevron { color: #fbbf24 !important; fill: #fbbf24 !important; stroke: #fbbf24 !important; }
  .rdp-outside { opacity: 0.3 !important; pointer-events: none; }
  .rdp-caption_label { text-transform: capitalize; }
  @media (max-width: 400px) { .rdp { transform: scale(0.88); transform-origin: top center; } }
  .rdp-dropdown { background-color: transparent !important; color: white !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 6px !important; padding: 2px 6px !important; font-size: 14px !important; }
  .rdp-dropdown option { background-color: #161616 !important; color: white !important; }
  .rdp-caption_dropdowns { display: flex; gap: 8px; justify-content: center; }
  .rdp-vhidden { display: none !important; }

  /* PELUQUERIA OVERRIDES */
  .rdp-panel-peluqueria .rdp-button:hover:not([disabled]) { background-color: #f3f4f6 !important; color: #10b981 !important; }
  .rdp-panel-peluqueria .rdp-selected, .rdp-panel-peluqueria .rdp-day_selected, .rdp-panel-peluqueria .rdp-day_selected:hover, .rdp-panel-peluqueria .rdp-day_selected:focus {
      background-color: transparent !important;
  }
  .rdp-panel-peluqueria button.rdp-day_selected, .rdp-panel-peluqueria button.rdp-selected, .rdp-panel-peluqueria .rdp-selected .rdp-button, .rdp-panel-peluqueria .rdp-selected .rdp-day_button { 
      color: #000000 !important; font-weight: bold !important; border: 2px solid #10b981 !important; 
  }
  .rdp-panel-peluqueria button.rdp-day_today:not(.rdp-day_selected), .rdp-panel-peluqueria button.rdp-today:not(.rdp-day_selected), .rdp-panel-peluqueria .rdp-today:not(.rdp-selected) .rdp-button, .rdp-panel-peluqueria .rdp-today:not(.rdp-selected) .rdp-day_button { 
      color: #10b981 !important; font-weight: bold !important; 
  }
  .rdp-panel-peluqueria .rdp-nav_button, .rdp-panel-peluqueria .rdp-nav_icon, .rdp-panel-peluqueria .rdp-chevron,
  .rdp-panel-peluqueria svg.rdp-nav_icon { color: #10b981 !important; fill: #10b981 !important; stroke: #10b981 !important; }
  .rdp-panel-peluqueria .rdp-dropdown { background-color: transparent !important; color: #000 !important; border: 1px solid rgba(0,0,0,0.1) !important; }
  .rdp-panel-peluqueria .rdp-dropdown option { background-color: #fff !important; color: #000 !important; }
  .rdp-panel-peluqueria .rdp-head_cell { color: #10b981 !important; }
  .rdp-panel-peluqueria .rdp-day:not(.rdp-day_disabled) { color: #000000 !important; }
  .rdp-panel-peluqueria .rdp-day_disabled { color: #a1a1aa !important; }
`;

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const esCapitalized = {
    ...es,
    localize: {
        ...es.localize,
        month: (n: any, opts: any) => {
            const m = es.localize?.month(n, opts) || '';
            return m.charAt(0).toUpperCase() + m.slice(1);
        }
    }
};

// Servicies are now dynamic from DB
const TIME_SLOTS = [
    '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30'
];
const EMPLOYEE_NAMES: Record<number, string> = {
    1: 'Luis (Barbero)', 2: 'Carlos (Barbero)', 3: 'Mariely (Infantil)'
};

interface Filters {
    search: string;
    date: string;
    employee_id: number;
    status: string;
    service_type: string;
}

// ─── HELPER: calendario picado de slots ───
function SlotPicker({ fecha, servicio, tipo_servicio, value, onChange, existingHora, dbServices = [] }: any) {
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!fecha || !servicio) { setSlots([]); return; }
        const currentServices = dbServices.filter((s: any) => s.shop_type === tipo_servicio);
        const found = currentServices.find((s: any) => s.name === servicio);
        const duration = (found && found.duration) ? found.duration : 30;
        setLoading(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
        fetch('/api/available-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify({ date: format(fecha, 'yyyy-MM-dd'), service_type: tipo_servicio, duration }),
        })
        .then(async (r) => {
            if (!r.ok) {
                const text = await r.text();
                throw new Error(`Status: ${r.status}, Body: ${text}`);
            }
            return r.json();
        })
        .then(data => {
            let available: string[] = data.available_slots || [];
            // Re-incluir hora existente si es edición del mismo día
            if (existingHora && !available.includes(existingHora)) {
                available.push(existingHora);
                available.sort();
            }
            setSlots(available);
        })
        .catch((e) => {
            console.error("Error fetching slots:", e);
            alert("Error fetching available slots: " + e.message);
            setSlots([]);
        })
        .finally(() => setLoading(false));
    }, [fecha, servicio, tipo_servicio]);

    if (!fecha || !servicio) return null;

    return (
        <div className="bg-carbon/50 p-4 rounded-2xl border border-white/10">
            <p className="text-xs uppercase text-steel font-bold mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Hora Disponible
            </p>
            {loading ? (
                <div className="flex justify-center py-4">
                    <span className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map((t) => {
                        const isAvailable = slots.includes(t);
                        return (
                            <button type="button" key={t}
                                disabled={!isAvailable}
                                onClick={() => onChange(t)}
                                className={cn(
                                    'relative flex items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all border',
                                    !isAvailable ? 'opacity-40 cursor-not-allowed bg-[#0a0a0a] border-white/5 text-steel/50' : '',
                                    value === t ? 'bg-amber-400 text-void border-amber-400 font-bold shadow-lg' :
                                        isAvailable ? 'bg-[#111] text-ash border-white/10 hover:border-amber-400/50 hover:text-white' : ''
                                )}>
                                <span className={!isAvailable ? 'line-through' : ''}>{t}</span>
                                {!isAvailable && <X className="w-2.5 h-2.5 absolute right-1 top-1 text-steel/40" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── HELPER: Selector de barbero en tiempo real ───
function BarberPicker({ fecha, hora, duration, value, onChange, appointment_id, user }: any) {
    const [barbers, setBarbers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!fecha || !hora) { setBarbers([]); return; }
        setLoading(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
        fetch('/api/barbers-availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify({
                date: format(fecha, 'yyyy-MM-dd'),
                time: hora,
                duration: duration || 30,
                appointment_id: appointment_id
            }),
        })
        .then(async (r) => {
            if (!r.ok) {
                const text = await r.text();
                throw new Error(`Status: ${r.status}, Body: ${text}`);
            }
            return r.json();
        })
        .then(data => {
            const list = data.barbers || [];
            setBarbers(list);
            // Auto-select si solo hay 1
            if (list.length > 0) {
                const available = list.filter((b: any) => b.available);
                if (available.length === 1 && !value) {
                    onChange(available[0].id);
                } else if (!available.some((b: any) => b.id === value)) {
                    onChange(null); // Reset if selected barber is no longer available
                }
            }
        })
        .catch((e) => {
            console.error("Error fetching barbers:", e);
            alert("Error fetching barbers: " + e.message);
            setBarbers([]);
        })
        .finally(() => setLoading(false));
    }, [fecha, hora, duration]);

    if (!fecha || !hora) return null;

    return (
        <div className="bg-carbon/50 p-4 rounded-2xl border border-white/10 mt-3">
            <p className="text-xs uppercase text-steel font-bold mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Elige tu barbero
            </p>
            {loading ? (
                <div className="flex justify-center py-3">
                    <span className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    {barbers.map((b) => {
                        const isDisabled = !b.available;
                        return (
                            <button
                                key={b.id} type="button" disabled={isDisabled}
                                onClick={() => onChange(b.id)}
                                className={cn(
                                    'relative flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all border',
                                    isDisabled ? 'opacity-40 cursor-not-allowed bg-[#0a0a0a] border-white/5 text-steel/50' :
                                    value === b.id ? 'bg-amber-400 text-void border-amber-400 shadow-lg' :
                                    'bg-[#111] text-ash border-white/10 hover:border-amber-400/50 hover:text-white'
                                )}>
                                <span className={isDisabled ? 'line-through' : ''}>{b.name}</span>
                                {!b.available && <X className="w-3 h-3 absolute right-2 top-2 text-steel/40" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

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

// ─── FORM COMPARTIDO para crear/editar ───
function AppointmentForm({ formData, setFormData, user, dbServices = [], appointment_id, selectedAppt }: any) {
    const currentServices = dbServices.filter((s: any) => s.shop_type === formData.tipo_servicio);
    const [loyaltyData, setLoyaltyData] = useState<{exists: boolean, loyalty_points: number, penalty_flag: boolean} | null>(null);
    const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);

    useEffect(() => {
        if (formData.tipo_servicio === 'barberia' && (
            (formData.telefono && formData.telefono.replace(/\D/g, '').length >= 8) || 
            (formData.email && formData.email.includes('@')) || 
            (formData.nombre && formData.nombre.trim() !== '')
        )) {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            fetch('/api/client-loyalty-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken || '' },
                body: JSON.stringify({
                    phone: formData.telefono ? formData.telefono.replace(/\D/g, '') : '',
                    email: formData.email || '',
                    nombre: formData.nombre || '',
                    apellidos: formData.apellidos || ''
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.exists) {
                    setLoyaltyData(data);
                } else {
                    setLoyaltyData(null);
                }
            }).catch(() => setLoyaltyData(null));
        } else {
            setLoyaltyData(null);
        }
    }, [formData.telefono, formData.email, formData.nombre, formData.apellidos, formData.tipo_servicio]);

    // Auto-precio cuando cambia servicio
    useEffect(() => {
        const found = currentServices.find(s => s.name === formData.servicio);
        if (found) {
            if (loyaltyData?.loyalty_points && loyaltyData.loyalty_points >= 9 && formData.tipo_servicio === 'barberia') {
                setFormData((p: any) => ({ ...p, precio: 'Gratis' }));
            } else {
                setFormData((p: any) => ({ ...p, precio: found.price }));
            }
        }
    }, [formData.servicio, formData.tipo_servicio, loyaltyData]);

    return (
        <div className="space-y-5">
            {/* Datos cliente */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] uppercase text-steel font-bold tracking-widest">Datos del Cliente</p>
                    {loyaltyData && formData.tipo_servicio === 'barberia' && (
                        <div className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded-md border",
                            loyaltyData.loyalty_points >= 9 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-400/10 border-amber-400/30"
                        )}>
                            <svg className={cn("w-3.5 h-3.5", loyaltyData.loyalty_points >= 9 ? "text-emerald-400 fill-emerald-400" : "text-amber-400 fill-amber-400")} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", loyaltyData.loyalty_points >= 9 ? "text-emerald-400" : "text-amber-400")}>
                                {loyaltyData.loyalty_points >= 9 ? "¡CORTE GRATIS! (10º CORTE)" : `Cortes acumulados: ${loyaltyData.loyalty_points}`}
                            </span>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-steel/70 mb-1 block">Nombre *</label>
                        <input required type="text" maxLength={100}
                            className="w-full bg-carbon border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            value={formData.nombre}
                            onChange={e => setFormData((p: any) => ({...p, nombre: e.target.value}))} />
                    </div>
                    <div>
                        <label className="text-xs text-steel/70 mb-1 block">Apellidos <span className="text-steel/40">(opcional)</span></label>
                        <input type="text" maxLength={100}
                            className="w-full bg-carbon border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            value={formData.apellidos}
                            onChange={e => setFormData((p: any) => ({...p, apellidos: e.target.value}))} />
                    </div>
                    <div>
                        <label className="text-xs text-steel/70 mb-1 block">Teléfono *</label>
                        <div className="flex gap-2 relative">
                            <button
                                type="button"
                                onClick={() => setShowPhoneDropdown(!showPhoneDropdown)}
                                className="w-[100px] bg-carbon border border-white/10 rounded-xl px-2 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors flex items-center justify-center gap-1.5"
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
                            <input required type="tel" 
                                pattern={formData.phonePrefix === 'Otro' ? `[0-9]{8,15}` : `[0-9]{${COUNTRY_CODES.find(c => c.code === formData.phonePrefix)?.maxLength || 9}}`}
                                maxLength={formData.phonePrefix === 'Otro' ? 15 : COUNTRY_CODES.find(c => c.code === formData.phonePrefix)?.maxLength || 9}
                                className="flex-1 bg-carbon border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                                value={formData.telefono}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData((p: any) => ({...p, telefono: val}));
                                }} />
                        </div>
                        {showPhoneDropdown && (
                            <div className="absolute z-[100] mt-1 w-[300px] max-h-40 overflow-y-auto bg-[#111] border border-white/10 rounded-xl p-1.5 grid grid-cols-2 gap-1 custom-scrollbar shadow-2xl">
                                {COUNTRY_CODES.map((c) => (
                                    <button
                                        key={c.code}
                                        type="button"
                                        onClick={() => {
                                            setFormData((p: any) => ({...p, phonePrefix: c.code, customPrefix: '', telefono: ''}));
                                            setShowPhoneDropdown(false);
                                        }}
                                        className="flex items-center gap-2 px-2.5 py-2 text-xs text-bone hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
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
                            <div className="mt-2">
                                <label className="text-[10px] uppercase text-steel/70 mb-1 block">Prefijo Manual</label>
                                <input
                                    required
                                    value={formData.customPrefix}
                                    type="text"
                                    placeholder="+XX"
                                    maxLength={5}
                                    onChange={e => setFormData((p: any) => ({...p, customPrefix: e.target.value.replace(/[^0-9+]/g, '')}))}
                                    className="w-full bg-carbon border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-steel/70 mb-1 block">Email <span className="text-steel/40">(opcional)</span></label>
                        <input type="email" maxLength={255}
                            className="w-full bg-carbon border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            value={formData.email}
                            onChange={e => setFormData((p: any) => ({...p, email: e.target.value}))} />
                    </div>
                </div>
                {loyaltyData && formData.tipo_servicio === 'barberia' && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 mt-3 flex items-start gap-3"
                    >
                        <div className="p-1.5 bg-amber-400/20 text-amber-400 rounded-lg shrink-0">
                            <Star className="w-4 h-4 fill-amber-400" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-white leading-tight mb-0.5">
                                {loyaltyData.penalty_flag 
                                    ? 'Cuenta penalizada'
                                    : `Cortes acumulados: ${loyaltyData.loyalty_points}/9`}
                            </p>
                            <p className="text-[12px] text-steel leading-tight">
                                {loyaltyData.penalty_flag 
                                    ? 'No se acumulan puntos por inasistencia reciente.' 
                                    : 'El 10º corte será gratis automáticamente.'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Servicio y empleado */}
            <div>
                <p className="text-[10px] uppercase text-steel font-bold tracking-widest mb-3">Servicio</p>
                <div className="grid grid-cols-2 gap-3">
                    {user.role === 'superadmin' && (
                        <div className="col-span-2">
                            <label className="text-xs text-steel/70 mb-1 block">Local</label>
                            <select
                                className="w-full bg-carbon border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-400"
                                value={formData.tipo_servicio}
                                onChange={e => setFormData((p: any) => ({
                                    ...p,
                                    tipo_servicio: e.target.value,
                                    servicio: '',
                                    precio: '',
                                    empleado_id: e.target.value === 'peluqueria_infantil' ? 3 : 1,
                                    hora: null,
                                }))}>
                                <option value="barberia">Barbería — Glow Barber</option>
                                <option value="peluqueria_infantil">Peluquería Infantil — Luni Styles</option>
                            </select>
                        </div>
                    )}
                    <div className={formData.tipo_servicio === 'barberia' ? "col-span-2" : ""}>
                        <div className="flex justify-between items-end mb-1">
                            <label className="text-xs text-steel/70 block">Servicio *</label>
                            {formData.tipo_servicio === 'peluqueria_infantil' && (
                                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-400/10 px-1.5 py-0.5 rounded">Consultar precio por tfno.</span>
                            )}
                        </div>
                        <select required
                            className="w-full bg-carbon border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-400"
                            value={formData.servicio}
                            onChange={e => setFormData((p: any) => ({...p, servicio: e.target.value, hora: null, empleado_id: formData.tipo_servicio === 'peluqueria_infantil' ? 3 : null}))}>
                            <option value="" disabled>Selecciona...</option>
                            {currentServices.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    {formData.tipo_servicio === 'peluqueria_infantil' && (
                        <div>
                            <label className="text-xs text-steel/70 mb-1 block">Empleado</label>
                            <select
                                className="w-full bg-carbon border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-400"
                                value={formData.empleado_id || 3}
                                onChange={e => setFormData((p: any) => ({...p, empleado_id: Number(e.target.value)}))}>
                                <option value={3}>Mariely (Infantil)</option>
                            </select>
                        </div>
                    )}
                    <div className="col-span-2">
                        <label className="text-xs text-steel/70 mb-1 block">Precio (automático)</label>
                        <input type="text" readOnly
                            className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3 text-steel text-sm cursor-not-allowed"
                            value={formData.precio ? formData.precio + '€' : '—'} />
                    </div>
                </div>
            </div>

            <div>
                <p className="text-[10px] uppercase text-steel font-bold tracking-widest mb-3">Fecha y Hora</p>
                <div className={cn(
                    "p-3 rounded-2xl border flex justify-center mb-3 overflow-hidden transition-colors duration-300",
                    formData.tipo_servicio === 'peluqueria_infantil' 
                        ? "bg-white border-emerald-100 rdp-panel-peluqueria" 
                        : "bg-carbon/50 border-white/10 rdp-panel-barberia"
                )}>
                    <DayPicker
                        mode="single"
                        selected={formData.fecha}
                        onSelect={(d) => setFormData((p: any) => ({...p, fecha: d, hora: null}))}
                        locale={esCapitalized}
                        captionLayout="dropdown-buttons"
                        fromYear={2026}
                        toYear={2035}
                        disabled={[{ before: new Date() }, { dayOfWeek: [0, 6] }]}
                        className={cn("text-sm font-medium", formData.tipo_servicio === 'peluqueria_infantil' ? "text-black" : "")}
                    />
                </div>
                <SlotPicker
                    fecha={formData.fecha}
                    servicio={formData.servicio}
                    tipo_servicio={formData.tipo_servicio}
                    value={formData.hora}
                    onChange={(t: string) => setFormData((p: any) => ({...p, hora: t, empleado_id: null}))}
                    existingHora={appointment_id && selectedAppt && format(new Date(selectedAppt.fecha), 'yyyy-MM-dd') === format(formData.fecha, 'yyyy-MM-dd') ? selectedAppt.hora : null}
                    dbServices={dbServices}
                />
                {formData.tipo_servicio === 'barberia' && (
                    <BarberPicker
                        fecha={formData.fecha}
                        hora={formData.hora}
                        duration={(currentServices.find((s: any) => s.name === formData.servicio)?.duration) || 30}
                        value={formData.empleado_id}
                        onChange={(id: number | null) => setFormData((p: any) => ({...p, empleado_id: id}))}
                        appointment_id={appointment_id}
                        user={user}
                    />
                )}
            </div>

            {/* Observaciones */}
            <div>
                <label className="text-xs text-steel/70 mb-1 block">Observaciones</label>
                <textarea maxLength={500}
                    className="w-full bg-carbon border border-white/10 rounded-xl p-3 text-white h-20 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    value={formData.observaciones}
                    onChange={e => setFormData((p: any) => ({...p, observaciones: e.target.value}))} />
            </div>
        </div>
    );
}

// ─── ESTADO BADGE ───
function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'pending':   return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 whitespace-nowrap">Pendiente</span>;
        case 'completed': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">Terminada</span>;
        case 'no-show':   return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap">No Presentado</span>;
        default:          return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 whitespace-nowrap">{status}</span>;
    }
}

// ─── CONFIRM MINI-MODAL ───
function ConfirmModal({ data, onCancel, onConfirm }: any) {
    if (!data) return null;
    const colors: Record<string, string> = {
        emerald: 'bg-emerald-500', amber: 'bg-amber-400', red: 'bg-red-500'
    };
    const btnColors: Record<string, string> = {
        emerald: 'bg-emerald-500 hover:bg-emerald-400 text-white',
        amber:   'bg-amber-400 hover:bg-amber-300 text-void',
        red:     'bg-red-500 hover:bg-red-400 text-white',
    };
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
            <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:20}}
                className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-sm relative z-10 shadow-2xl overflow-hidden">
                <div className={`h-1.5 w-full ${colors[data.color] || 'bg-steel'}`} />
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${data.color === 'red' ? 'bg-red-500/10' : data.color === 'emerald' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                            <AlertTriangle className={`w-5 h-5 ${data.color === 'red' ? 'text-red-400' : data.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`} />
                        </div>
                        <h3 className="font-display font-bold text-base text-white">{data.title}</h3>
                    </div>
                    <p className="text-steel text-sm leading-relaxed mb-5">{data.text}</p>
                    <div className="flex gap-3">
                        <button onClick={onCancel} className="flex-1 bg-carbon text-white font-bold py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm">
                            Cancelar
                        </button>
                        <button onClick={onConfirm} className={`flex-1 font-bold py-2.5 rounded-xl text-sm ${btnColors[data.color] || 'bg-steel text-white'}`}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ───
export default function Dashboard({ appointments, total, page, perPage, filters, user, dbServices = [] }: any) {
    const [selectedAppt, setSelectedAppt] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [confirmModal, setConfirmModal] = useState<any>(null);

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const [localFilters, setLocalFilters] = useState<Filters>({
        search:       filters?.search       || '',
        date:         filters?.date         || todayStr,
        employee_id:  filters?.employee_id  || 0,
        status:       filters?.status       || '',
        service_type: filters?.service_type || '',
    });

    const emptyForm = {
        nombre: '', apellidos: '', telefono: '', phonePrefix: '+34', customPrefix: '', email: '',
        fecha: undefined as Date | undefined,
        hora: null as string | null,
        servicio: '',
        tipo_servicio: user.role === 'hairdresser' ? 'peluqueria_infantil' : 'barberia',
        empleado_id: user.role === 'hairdresser' ? 3 : 1,
        precio: '',
        observaciones: '',
    };
    const [formData, setFormData] = useState(emptyForm);

    const totalPages = Math.ceil(total / perPage);

    const navigate = (newFilters: Partial<Filters>, newPage = 1) => {
        const merged = { ...localFilters, ...newFilters };
        setLocalFilters(merged);
        router.get('/panel/citas', { ...merged, page: newPage }, { preserveState: true, replace: true });
    };

    const clearDateFilter = () => navigate({ date: '' });

    const handleOpenDetails = (appt: any) => {
        setSelectedAppt(appt);
        setIsEditMode(false);
    };

    const startEdit = () => {
        let prefix = '+34';
        let customPref = '';
        let phoneNum = selectedAppt.telefono || '';
        
        if (phoneNum.includes(' ')) {
            const parts = phoneNum.split(' ');
            const pfx = parts[0];
            phoneNum = parts.slice(1).join('').replace(/\D/g, '');
            if (COUNTRY_CODES.find(c => c.code === pfx)) {
                prefix = pfx;
            } else {
                prefix = 'Otro';
                customPref = pfx;
            }
        } else {
            phoneNum = phoneNum.replace(/\D/g, '');
        }

        setFormData({
            nombre:        selectedAppt.nombre,
            apellidos:     selectedAppt.apellidos || '',
            telefono:      phoneNum,
            phonePrefix:   prefix,
            customPrefix:  customPref,
            email:         selectedAppt.email     || '',
            fecha:         selectedAppt.fecha ? new Date(selectedAppt.fecha) : undefined,
            hora:          selectedAppt.hora,
            servicio:      selectedAppt.servicio,
            tipo_servicio: selectedAppt.tipo_servicio === 'infantil' ? 'peluqueria_infantil' : selectedAppt.tipo_servicio,
            empleado_id:   selectedAppt.empleado_id,
            precio:        selectedAppt.precio,
            observaciones: selectedAppt.observaciones || '',
        });
        setIsEditMode(true);
    };

    const saveEdit = () => {
        if (!formData.fecha || !formData.hora || !formData.servicio) return;
        router.put(`/panel/citas/${selectedAppt.id}`, {
            ...formData,
            telefono: (formData.phonePrefix === 'Otro' ? formData.customPrefix : formData.phonePrefix) + ' ' + formData.telefono,
            fecha: format(formData.fecha, 'yyyy-MM-dd'),
            precio: formData.precio !== null && formData.precio !== undefined ? String(formData.precio) : null,
        }, {
            preserveScroll: true,
            onSuccess: () => { setIsEditMode(false); setSelectedAppt(null); },
            onError: (errors) => {
                console.error("Validation errors:", errors);
                alert("Validation errors: " + JSON.stringify(errors));
            }
        });
    };

    const createAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fecha || !formData.hora || !formData.servicio) return;
        router.post('/panel/citas', {
            ...formData,
            telefono: (formData.phonePrefix === 'Otro' ? formData.customPrefix : formData.phonePrefix) + ' ' + formData.telefono,
            fecha: format(formData.fecha, 'yyyy-MM-dd'),
            precio: formData.precio !== null && formData.precio !== undefined ? String(formData.precio) : null,
        }, {
            preserveScroll: true,
            onSuccess: () => { setShowNewModal(false); setFormData(emptyForm); },
            onError: (errors) => {
                console.error('Error al crear cita:', errors);
                alert("Validation errors: " + JSON.stringify(errors));
            },
        });
    };

    const doConfirm = (action: string, id: number, title: string, text: string, color: string) => {
        setConfirmModal({ action, id, title, text, color });
    };

    const executeConfirm = () => {
        if (!confirmModal) return;
        const { action, id } = confirmModal;
        setConfirmModal(null);
        if (action === 'delete') {
            router.delete(`/panel/citas/${id}`, {
                preserveScroll: true,
                onSuccess: () => setSelectedAppt(null),
            });
        } else if (action === 'completed' || action === 'no-show') {
            router.put(`/panel/citas/${id}/status`, { status: action }, {
                preserveScroll: true,
                onSuccess: () => setSelectedAppt(null),
            });
        }
    };

    return (
        <PanelLayout title="Citas" user={user}>
            <style>{panelCalendarCss}</style>
            <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                        <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white">Gestión de Citas</h1>
                        <p className="text-steel text-xs mt-0.5">
                            <span className="text-amber-400 font-bold">{total}</span> cita{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
                            {localFilters.date ? ` · ${localFilters.date}` : ' · todos los días'}
                        </p>
                    </div>
                    <button onClick={() => { setFormData(emptyForm); setShowNewModal(true); }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 text-sm w-full sm:w-auto">
                        <Plus className="w-4 h-4" /> Nueva Cita
                    </button>
                </div>

                {/* Búsqueda + filtros */}
                <div className="bg-[#111] border border-white/5 rounded-2xl mb-4">
                    <div className="p-3 flex flex-col sm:flex-row gap-2.5">
                        {/* Búsqueda */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel/50" />
                            <input type="text"
                                placeholder="Buscar por nombre, email, teléfono, servicio..."
                                value={localFilters.search}
                                onChange={e => setLocalFilters(f => ({...f, search: e.target.value}))}
                                onKeyDown={e => { if (e.key === 'Enter') navigate({}); }}
                                className="w-full pl-9 pr-4 py-2.5 bg-carbon border border-white/10 rounded-xl text-white placeholder-steel/40 focus:outline-none focus:border-amber-400 transition-all text-sm" />
                        </div>

                        {/* Filtro fecha rápido con calendario pro */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className="pl-8 pr-8 py-2.5 bg-carbon border border-white/10 rounded-xl text-white text-sm hover:border-amber-400 transition-all w-44 text-left flex items-center justify-between"
                                >
                                    <CalIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-steel/50 pointer-events-none" />
                                    {localFilters.date ? format(new Date(localFilters.date), 'dd/MM/yyyy') : 'Todas las fechas'}
                                </button>

                                {localFilters.date && (
                                    <button onClick={clearDateFilter} title="Quitar filtro de fecha"
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-steel hover:text-red-400 transition-colors bg-carbon pl-1">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}

                                <AnimatePresence>
                                    {showDatePicker && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className={cn(
                                                    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:absolute sm:top-full sm:left-0 sm:right-auto sm:translate-x-0 sm:translate-y-0 sm:mt-2 border border-white/10 rounded-2xl p-3 z-50 shadow-2xl",
                                                    localFilters.service_type === 'peluqueria_infantil' ? "bg-white border-emerald-100 rdp-panel-peluqueria" : "bg-[#161616] rdp-panel-barberia"
                                                )}
                                            >
                                                <DayPicker
                                                    mode="single"
                                                    selected={localFilters.date ? new Date(localFilters.date) : undefined}
                                                    onSelect={(d) => {
                                                        setLocalFilters(f => ({ ...f, date: d ? format(d, 'yyyy-MM-dd') : '' }));
                                                        setShowDatePicker(false);
                                                    }}
                                                    locale={esCapitalized}
                                                    captionLayout="dropdown-buttons"
                                                    fromYear={2026}
                                                    toYear={2035}
                                                    className={cn(
                                                        "text-sm font-medium",
                                                        localFilters.service_type === 'peluqueria_infantil' ? "text-black" : "text-bone"
                                                    )}
                                                />
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button onClick={() => navigate({})}
                                className="px-4 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm whitespace-nowrap">
                                Buscar
                            </button>
                            <button onClick={() => setShowFilters(f => !f)} title="Más filtros"
                                className={cn("p-2.5 rounded-xl border transition-colors",
                                    showFilters ? "bg-white/10 border-white/20 text-white" : "border-white/10 text-steel hover:text-white hover:bg-white/5")}>
                                <SlidersHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Panel filtros avanzados */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                                <div className="p-3 pt-0 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div>
                                        <label className="text-[10px] uppercase text-steel font-bold mb-1 block">Estado</label>
                                        <select value={localFilters.status}
                                            onChange={e => setLocalFilters(f => ({...f, status: e.target.value}))}
                                            className="w-full bg-carbon border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-400">
                                            <option value="">Todos</option>
                                            <option value="pending">Pendiente</option>
                                            <option value="completed">Terminada</option>
                                            <option value="no-show">No Presentado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase text-steel font-bold mb-1 block">Empleado</label>
                                        <select value={localFilters.employee_id}
                                            onChange={e => setLocalFilters(f => ({...f, employee_id: Number(e.target.value)}))}
                                            className="w-full bg-carbon border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-400">
                                            <option value={0}>Todos</option>
                                            {user.role !== 'hairdresser' && (
                                                <>
                                                    <option value={1}>Luis (Barbero)</option>
                                                    <option value={2}>Carlos (Barbero)</option>
                                                </>
                                            )}
                                            {user.role !== 'barber' && (
                                                <option value={3}>Mariely (Infantil)</option>
                                            )}
                                        </select>
                                    </div>
                                    {user.role === 'superadmin' && (
                                        <div>
                                            <label className="text-[10px] uppercase text-steel font-bold mb-1 block">Local</label>
                                            <select value={localFilters.service_type}
                                                onChange={e => setLocalFilters(f => ({...f, service_type: e.target.value}))}
                                                className="w-full bg-carbon border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-400">
                                                <option value="">Todos</option>
                                                <option value="barberia">Barbería</option>
                                                <option value="peluqueria_infantil">Infantil</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="flex items-end gap-2">
                                        <button onClick={() => navigate({})}
                                            className="flex-1 bg-amber-400 text-void font-bold py-2 rounded-lg text-xs hover:bg-amber-300 transition-colors">
                                            Aplicar
                                        </button>
                                        <button onClick={() => {
                                            const reset: Filters = { search: '', date: todayStr, employee_id: 0, status: '', service_type: '' };
                                            setLocalFilters(reset);
                                            router.get('/panel/citas', reset, { preserveState: true, replace: true });
                                        }} className="px-3 bg-carbon text-steel font-bold py-2 rounded-lg text-xs border border-white/10 hover:text-white transition-colors">
                                            Restablecer
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* TABLA / LISTA */}
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Desktop: tabla */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#0a0a0a] text-steel text-[10px] uppercase tracking-wider border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3 font-bold">Cliente</th>
                                    <th className="px-4 py-3 font-bold">Contacto</th>
                                    <th className="px-4 py-3 font-bold">Fecha / Hora</th>
                                    <th className="px-4 py-3 font-bold hidden lg:table-cell">Servicio</th>
                                    <th className="px-4 py-3 font-bold">Estado</th>
                                    <th className="px-4 py-3 text-right font-bold">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-bone">
                                {appointments.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-16 text-center text-steel">
                                        <CalIcon className="w-8 h-8 text-steel/30 mx-auto mb-2" />
                                        No hay citas con los filtros aplicados.
                                    </td></tr>
                                ) : appointments.map((appt: any) => (
                                    <tr key={appt.id}
                                        className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        onClick={() => handleOpenDetails(appt)}>
                                        <td className="px-4 py-3.5">
                                            <div className="font-bold text-white text-sm">{appt.nombre} {appt.apellidos}</div>
                                            <div className="text-steel text-xs mt-0.5 flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/50 shrink-0" />
                                                ID #{appt.id}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="text-steel text-xs flex items-center gap-1.5 mb-0.5">
                                                <Phone className="w-3 h-3 shrink-0 text-steel/50" />
                                                <span className="text-bone/80">{appt.telefono}</span>
                                            </div>
                                            <div className="text-steel text-xs flex items-center gap-1.5">
                                                <Mail className="w-3 h-3 shrink-0 text-steel/50" />
                                                <span className="text-bone/60 truncate max-w-[140px]">{appt.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="text-white text-sm flex items-center gap-1.5">
                                                <CalIcon className="w-3.5 h-3.5 text-steel/50 shrink-0" /> {appt.fecha}
                                            </div>
                                            <div className="text-steel text-xs mt-0.5 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 shrink-0" /> {appt.hora}
                                                {appt.empleado_id && <span className="ml-1 text-steel/40">· {EMPLOYEE_NAMES[appt.empleado_id] ?? `Emp.${appt.empleado_id}`}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 hidden lg:table-cell">
                                            <div className="text-white text-sm">{appt.servicio}</div>
                                            <div className="text-amber-400/60 text-xs mt-0.5 font-bold">{appt.precio && appt.precio !== 'Consultar' ? appt.precio + '€' : appt.precio}</div>
                                        </td>
                                        <td className="px-4 py-3.5"><StatusBadge status={appt.estado} /></td>
                                        <td className="px-4 py-3.5 text-right">
                                            <button onClick={(e) => { e.stopPropagation(); handleOpenDetails(appt); }}
                                                className="p-2 text-steel hover:text-amber-400 transition-colors rounded-lg hover:bg-amber-400/10">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile: cards */}
                    <div className="sm:hidden divide-y divide-white/5">
                        {appointments.length === 0 ? (
                            <div className="px-4 py-12 text-center text-steel">
                                <CalIcon className="w-8 h-8 text-steel/30 mx-auto mb-2" />
                                <p>No hay citas con los filtros aplicados.</p>
                            </div>
                        ) : appointments.map((appt: any) => (
                            <button key={appt.id}
                                className="w-full text-left p-4 hover:bg-white/[0.03] transition-colors active:bg-white/5"
                                onClick={() => handleOpenDetails(appt)}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        {/* Nombre + badge */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white text-sm">{appt.nombre} {appt.apellidos}</span>
                                            <StatusBadge status={appt.estado} />
                                        </div>
                                        {/* Contacto */}
                                        <div className="flex items-center gap-1 text-steel text-xs mb-0.5">
                                            <Phone className="w-3 h-3 shrink-0" /> {appt.telefono}
                                        </div>
                                        <div className="flex items-center gap-1 text-steel text-xs mb-1.5 truncate">
                                            <Mail className="w-3 h-3 shrink-0" /> <span className="truncate">{appt.email}</span>
                                        </div>
                                        {/* Fecha + servicio */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="flex items-center gap-1 text-xs text-amber-400/80">
                                                <CalIcon className="w-3 h-3" /> {appt.fecha}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-steel">
                                                <Clock className="w-3 h-3" /> {appt.hora}
                                            </span>
                                            <span className="text-xs text-bone/70">{appt.servicio}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <ChevronRight className="w-4 h-4 text-steel/40" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* PAGINACIÓN */}
                    {totalPages > 1 && (
                        <div className="p-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
                            <p className="text-steel text-xs">Página <span className="text-white font-bold">{page}</span> de {totalPages} · {total} resultados</p>
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => navigate({}, Math.max(1, page - 1))} disabled={page <= 1}
                                    className="p-2 rounded-lg border border-white/10 text-steel hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                    return p <= totalPages ? (
                                        <button key={p} onClick={() => navigate({}, p)}
                                            className={cn("w-8 h-8 rounded-lg text-xs font-bold transition-colors",
                                                p === page ? "bg-amber-400 text-void" : "border border-white/10 text-steel hover:text-white hover:bg-white/5")}>
                                            {p}
                                        </button>
                                    ) : null;
                                })}
                                <button onClick={() => navigate({}, Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                                    className="p-2 rounded-lg border border-white/10 text-steel hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MODAL DETALLE / EDITAR ── */}
            <AnimatePresence>
                {selectedAppt && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => { setSelectedAppt(null); setIsEditMode(false); }} />
                        <motion.div
                            initial={{opacity:0, y:60}} animate={{opacity:1, y:0}} exit={{opacity:0, y:60}}
                            transition={{type:'spring', stiffness:300, damping:30}}
                            className="bg-[#111] border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto relative z-10 shadow-2xl">

                            {/* Handle móvil */}
                            <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />

                            {/* Header sticky */}
                            <div className="sticky top-0 bg-[#111]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-20">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <h3 className="font-display font-black text-lg text-white shrink-0">#{selectedAppt.id}</h3>
                                    <StatusBadge status={selectedAppt.estado} />
                                    {selectedAppt.tipo_servicio === 'barberia' ? (
                                        <span className="hidden sm:inline-block text-[10px] text-amber-400/50 font-bold uppercase tracking-wider">Barbería</span>
                                    ) : (
                                        <span className="hidden sm:inline-block text-[10px] text-emerald-400/50 font-bold uppercase tracking-wider">Infantil</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {!isEditMode && selectedAppt.estado === 'pending' && (
                                        <button onClick={startEdit}
                                            className="p-2 text-steel hover:text-amber-400 bg-carbon rounded-full border border-white/5 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => { setSelectedAppt(null); setIsEditMode(false); }}
                                        className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                {isEditMode ? (
                                    <div>
                                        <AppointmentForm formData={formData} setFormData={setFormData} user={user} dbServices={dbServices} appointment_id={selectedAppt.id} selectedAppt={selectedAppt} />
                                        <div className="flex gap-3 pt-4 mt-4 border-t border-white/10">
                                            <button onClick={saveEdit}
                                                disabled={!formData.hora || !formData.fecha || !formData.servicio || !formData.empleado_id}
                                                className="flex-1 bg-amber-400 text-void font-bold py-3 rounded-xl hover:bg-amber-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors">
                                                <Save className="w-4 h-4" /> Guardar Cambios
                                            </button>
                                            <button onClick={() => setIsEditMode(false)}
                                                className="px-5 bg-carbon text-white font-bold rounded-xl border border-white/10 hover:bg-white/5 text-sm transition-colors">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Datos cliente */}
                                        <div className="bg-carbon/50 p-4 rounded-2xl border border-white/5 space-y-3">
                                            <p className="text-steel text-[10px] uppercase tracking-wider font-bold">Cliente</p>
                                            <p className="font-bold text-white text-lg leading-tight">{selectedAppt.nombre} {selectedAppt.apellidos}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <a href={`tel:${selectedAppt.telefono}`}
                                                    className="flex items-center gap-2 text-sm text-bone/70 hover:text-amber-400 transition-colors">
                                                    <Phone className="w-3.5 h-3.5 text-steel/50 shrink-0" /> {selectedAppt.telefono}
                                                </a>
                                                <a href={`mailto:${selectedAppt.email}`}
                                                    className="flex items-center gap-2 text-sm text-bone/70 hover:text-amber-400 transition-colors break-all">
                                                    <Mail className="w-3.5 h-3.5 text-steel/50 shrink-0" /> {selectedAppt.email}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Datos cita */}
                                        <div className="bg-carbon/50 p-4 rounded-2xl border border-white/5 space-y-3">
                                            <p className="text-steel text-[10px] uppercase tracking-wider font-bold">Cita</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-steel text-xs mb-0.5">Fecha</p>
                                                    <div className="flex items-center gap-1.5 text-white text-sm font-medium">
                                                        <CalIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {selectedAppt.fecha}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-steel text-xs mb-0.5">Hora</p>
                                                    <div className="flex items-center gap-1.5 text-white text-sm font-medium">
                                                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {selectedAppt.hora}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-steel text-xs mb-0.5">Servicio</p>
                                                    <p className="text-white text-sm font-medium">{selectedAppt.servicio}</p>
                                                </div>
                                                <div>
                                                    <p className="text-steel text-xs mb-0.5">Precio</p>
                                                    <p className="text-amber-400 text-sm font-bold">
                                                        {selectedAppt.precio && selectedAppt.precio !== 'Consultar' ? selectedAppt.precio + '€' : selectedAppt.precio || '—'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-steel text-xs mb-0.5">Empleado</p>
                                                    <div className="flex items-center gap-1.5 text-white text-sm">
                                                        <User className="w-3.5 h-3.5 text-steel/50" />
                                                        {EMPLOYEE_NAMES[selectedAppt.empleado_id] ?? `Empleado ${selectedAppt.empleado_id}`}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-steel text-xs mb-0.5">Local</p>
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${selectedAppt.tipo_servicio === 'barberia' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                        {selectedAppt.tipo_servicio === 'barberia' ? 'Barbería' : 'Peluquería Infantil'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedAppt.observaciones && (
                                            <div>
                                                <p className="text-steel text-[10px] uppercase tracking-wider font-bold mb-2">Observaciones</p>
                                                <div className="bg-carbon p-3 rounded-xl text-bone/80 text-sm border border-white/5 leading-relaxed">
                                                    {selectedAppt.observaciones}
                                                </div>
                                            </div>
                                        )}

                                        {/* Acciones — solo si está pendiente */}
                                        {selectedAppt.estado === 'pending' && (
                                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                                                <button
                                                    onClick={() => doConfirm('completed', selectedAppt.id, '¿Marcar como Terminada?', 'Se actualizará el estado y se sumará al historial del cliente.', 'emerald')}
                                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white transition-all text-sm">
                                                    <CheckCircle2 className="w-5 h-5" /> Terminada
                                                </button>
                                                <button
                                                    onClick={() => doConfirm('no-show', selectedAppt.id, '¿Marcar No Presentado?', 'El cliente recibirá una penalización y perderá sus puntos de fidelidad.', 'amber')}
                                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 text-amber-400 font-bold hover:bg-amber-500 hover:text-void transition-all text-sm">
                                                    <XCircle className="w-5 h-5" /> No Presentado
                                                </button>
                                            </div>
                                        )}

                                        <div className="pt-2 flex justify-end border-t border-white/5">
                                            <button
                                                onClick={() => doConfirm('delete', selectedAppt.id, '¿Eliminar esta cita?', 'Esta acción es irreversible. La cita se borrará permanentemente.', 'red')}
                                                className="flex items-center gap-2 text-red-500/60 hover:text-red-400 text-sm font-bold transition-colors py-1.5">
                                                <Trash2 className="w-4 h-4" /> Eliminar Cita
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL NUEVA CITA ── */}
            <AnimatePresence>
                {showNewModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowNewModal(false)} />
                        <motion.div
                            initial={{opacity:0, y:60}} animate={{opacity:1, y:0}} exit={{opacity:0, y:60}}
                            transition={{type:'spring', stiffness:300, damping:30}}
                            className="bg-[#111] border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto relative z-10 shadow-2xl">
                            <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />
                            <div className="sticky top-0 bg-[#111]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-20">
                                <div>
                                    <h3 className="font-display font-black text-lg text-white">Nueva Cita Manual</h3>
                                    <p className="text-steel text-xs">Crea una reserva directamente desde el panel</p>
                                </div>
                                <button onClick={() => setShowNewModal(false)} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={createAppointment} className="p-4">
                                <AppointmentForm formData={formData} setFormData={setFormData} user={user} dbServices={dbServices} appointment_id={null} selectedAppt={null} />
                                <button type="submit"
                                    disabled={!formData.hora || !formData.fecha || !formData.servicio || !formData.empleado_id}
                                    className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-400 mt-5 shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Crear Reserva
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── CONFIRM MODAL ── */}
            <AnimatePresence>
                {confirmModal && (
                    <ConfirmModal
                        data={confirmModal}
                        onCancel={() => setConfirmModal(null)}
                        onConfirm={executeConfirm}
                    />
                )}
            </AnimatePresence>
        </PanelLayout>
    );
}
