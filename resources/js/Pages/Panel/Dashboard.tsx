import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import PanelLayout from './Layout';
import { Plus, Search, X, Calendar as CalIcon, Clock, User, Phone, Mail, Edit2, Trash2, CheckCircle2, XCircle, Save, AlertTriangle, ChevronLeft, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const BARBERIA_SERVICES = [
  { id: 'b1', name: 'Corte Normal', duration: 30, price: '12' },
  { id: 'b2', name: 'Corte + Barba', duration: 60, price: '15' },
  { id: 'b3', name: 'Solo Barba', duration: 30, price: '4' },
];
const INFANTIL_SERVICES = [
  { id: 'k1', name: 'Corte Infantil', duration: 45, price: 'Consultar' },
  { id: 'k2', name: 'Peinados', duration: 45, price: 'Consultar' },
  { id: 'k3', name: 'Accesorios', duration: 30, price: 'Consultar' },
];
const TIME_SLOTS = [
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

interface Filters {
  search: string;
  date: string;
  employee_id: number;
  status: string;
  service_type: string;
}

export default function Dashboard({ appointments, total, page, perPage, filters, user }: any) {
    const [selectedAppt, setSelectedAppt] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, action: string, id: number | null, title: string, text: string, color: string} | null>(null);
    
    // Local filter state (synced with URL params on submit)
    const [localFilters, setLocalFilters] = useState<Filters>({
        search: filters?.search || '',
        date: filters?.date || format(new Date(), 'yyyy-MM-dd'),
        employee_id: filters?.employee_id || 0,
        status: filters?.status || '',
        service_type: filters?.service_type || '',
    });

    const [formData, setFormData] = useState({
        nombre: '', apellidos: '', telefono: '', email: '',
        fecha: undefined as Date | undefined, hora: null as string | null,
        servicio: '', tipo_servicio: 'barberia', empleado_id: 1, precio: '', observaciones: ''
    });

    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const totalPages = Math.ceil(total / perPage);

    // Apply filters → reload page via Inertia
    const applyFilters = (newFilters: Partial<Filters>, newPage = 1) => {
        const merged = { ...localFilters, ...newFilters };
        setLocalFilters(merged);
        router.get('/panel/citas', {
            ...merged,
            page: newPage,
        }, { preserveState: true, replace: true });
    };

    const changePage = (p: number) => {
        router.get('/panel/citas', { ...localFilters, page: p }, { preserveState: true, replace: true });
    };

    // Auto-fetch slots
    useEffect(() => {
        if (formData.fecha && formData.servicio) {
            const fetchSlots = async () => {
                setIsLoadingSlots(true);
                try {
                    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                    const currentServices = formData.tipo_servicio === 'barberia' ? BARBERIA_SERVICES : INFANTIL_SERVICES;
                    const found = currentServices.find(s => s.name === formData.servicio);
                    const duration = found ? found.duration : 30;
                    const res = await fetch('/api/available-slots', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken || '' },
                        body: JSON.stringify({
                            date: format(formData.fecha, 'yyyy-MM-dd'),
                            service_type: formData.tipo_servicio,
                            duration,
                        })
                    });
                    const data = await res.json();
                    let slots = data.available_slots || [];
                    if (isEditMode && selectedAppt && format(formData.fecha, 'yyyy-MM-dd') === selectedAppt.fecha) {
                        if (!slots.includes(selectedAppt.hora)) slots.push(selectedAppt.hora);
                        slots.sort();
                    }
                    setAvailableSlots(slots);
                } catch {
                    setAvailableSlots([]);
                } finally {
                    setIsLoadingSlots(false);
                }
            };
            fetchSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [formData.fecha, formData.servicio, formData.tipo_servicio]);

    // Auto-price
    useEffect(() => {
        const currentServices = formData.tipo_servicio === 'barberia' ? BARBERIA_SERVICES : INFANTIL_SERVICES;
        const found = currentServices.find(s => s.name === formData.servicio);
        if (found) setFormData(prev => ({ ...prev, precio: found.price }));
    }, [formData.servicio, formData.tipo_servicio]);

    const handleOpenDetails = (appt: any) => {
        setSelectedAppt(appt);
        setIsEditMode(false);
    };

    const startEditMode = () => {
        setFormData({
            nombre: selectedAppt.nombre,
            apellidos: selectedAppt.apellidos || '',
            telefono: selectedAppt.telefono || '',
            email: selectedAppt.email || '',
            fecha: selectedAppt.fecha ? new Date(selectedAppt.fecha) : undefined,
            hora: selectedAppt.hora,
            servicio: selectedAppt.servicio,
            tipo_servicio: selectedAppt.tipo_servicio,
            empleado_id: selectedAppt.empleado_id,
            precio: selectedAppt.precio,
            observaciones: selectedAppt.observaciones || ''
        });
        setIsEditMode(true);
    };

    const openNewModal = () => {
        setFormData({
            nombre: '', apellidos: '', telefono: '', email: '',
            fecha: undefined, hora: null,
            servicio: '', tipo_servicio: user.role === 'hairdresser' ? 'peluqueria_infantil' : 'barberia',
            empleado_id: user.role === 'hairdresser' ? 3 : 1,
            precio: '', observaciones: ''
        });
        setShowNewModal(true);
    };

    const confirmAction = (action: string, id: number, title: string, text: string, color: string) => {
        setConfirmModal({ isOpen: true, action, id, title, text, color });
    };

    const executeAction = () => {
        if (!confirmModal) return;
        const { action, id } = confirmModal;
        setConfirmModal(null);
        if (action === 'delete') {
            router.delete(`/panel/citas/${id}`, { preserveScroll: true, onSuccess: () => setSelectedAppt(null) });
        } else if (action === 'completed' || action === 'no-show') {
            router.put(`/panel/citas/${id}/status`, { status: action }, { preserveScroll: true, onSuccess: () => setSelectedAppt(null) });
        }
    };

    const handleSaveEdit = () => {
        if (!formData.fecha || !formData.hora || !formData.servicio) return;
        router.put(`/panel/citas/${selectedAppt.id}`, {
            ...formData,
            fecha: format(formData.fecha, 'yyyy-MM-dd')
        }, {
            preserveScroll: true,
            onSuccess: () => { setIsEditMode(false); setSelectedAppt(null); }
        });
    };

    const handleSaveNew = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fecha || !formData.hora || !formData.servicio) return;
        router.post('/api/booking', {
            ...formData,
            fecha: format(formData.fecha, 'yyyy-MM-dd')
        }, {
            preserveScroll: true,
            onSuccess: () => { setShowNewModal(false); router.reload(); }
        });
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending':   return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">Pendiente</span>;
            case 'completed': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Terminada</span>;
            case 'no-show':   return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">No Presentado</span>;
            default: return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">{status}</span>;
        }
    };

    const renderDynamicForm = () => {
        const currentServices = formData.tipo_servicio === 'barberia' ? BARBERIA_SERVICES : INFANTIL_SERVICES;
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs uppercase text-steel mb-1 block">Nombre</label><input required type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white text-sm" value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} /></div>
                    <div><label className="text-xs uppercase text-steel mb-1 block">Apellidos</label><input required type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white text-sm" value={formData.apellidos} onChange={e=>setFormData({...formData, apellidos: e.target.value})} /></div>
                    <div><label className="text-xs uppercase text-steel mb-1 block">Teléfono</label><input required type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white text-sm" value={formData.telefono} onChange={e=>setFormData({...formData, telefono: e.target.value})} /></div>
                    <div><label className="text-xs uppercase text-steel mb-1 block">Email</label><input required type="email" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white text-sm" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /></div>
                    
                    <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs uppercase text-steel mb-1 block">Tipo Local</label>
                        <select className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white text-sm" value={formData.tipo_servicio} onChange={e=>setFormData({...formData, tipo_servicio: e.target.value, servicio: '', precio: '', empleado_id: e.target.value === 'peluqueria_infantil' ? 3 : 1})}>
                            <option value="barberia">Barbería</option>
                            <option value="peluqueria_infantil">Peluquería Infantil</option>
                        </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs uppercase text-steel mb-1 block">Servicio</label>
                        <select required className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white text-sm" value={formData.servicio} onChange={e=>setFormData({...formData, servicio: e.target.value})}>
                            <option value="" disabled>Selecciona un servicio</option>
                            {currentServices.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    
                    <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs uppercase text-steel mb-1 block">Empleado</label>
                        <select className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white text-sm" value={formData.empleado_id} onChange={e=>setFormData({...formData, empleado_id: Number(e.target.value)})}>
                            {formData.tipo_servicio === 'barberia' ? (
                                <><option value={1}>Luis (Barbero)</option><option value={2}>Carlos (Barbero)</option></>
                            ) : <option value={3}>Mariely (Infantil)</option>}
                        </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs uppercase text-steel mb-1 block">Precio (Auto)</label>
                        <input type="text" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-steel text-sm cursor-not-allowed" value={formData.precio ? formData.precio + (formData.precio !== 'Consultar' ? '€' : '') : '—'} readOnly />
                    </div>
                </div>

                {/* Calendario + slots */}
                <div className="border-t border-white/10 pt-4 mt-2">
                    <p className="text-xs uppercase text-steel font-bold mb-3">Selecciona Fecha</p>
                    <div className="bg-carbon/50 p-3 rounded-2xl border border-onyx flex justify-center mb-4 overflow-hidden">
                        <style>{`.rdp{margin:0}.rdp-button,.rdp-day_button{border-radius:50%!important;border:none!important;background:transparent!important;color:#fff}.rdp-button:hover:not([disabled]){background-color:#27272a!important;color:#fbbf24!important}.rdp-selected .rdp-button,.rdp-selected .rdp-day_button,button.rdp-selected,button.rdp-day_selected{background-color:transparent!important;color:#fbbf24!important;font-weight:700!important;border:2px solid #fbbf24!important}.rdp-today .rdp-button,.rdp-today .rdp-day_button{color:#fbbf24!important;font-weight:700!important}.rdp-nav_button,.rdp-chevron{color:#fbbf24!important;fill:#fbbf24!important}.rdp-outside{opacity:.3!important;pointer-events:none}`}</style>
                        <DayPicker
                            mode="single"
                            selected={formData.fecha}
                            onSelect={(d) => setFormData(prev => ({...prev, fecha: d, hora: null}))}
                            locale={es}
                            disabled={[{ before: new Date() }, { dayOfWeek: [0, 6] }]}
                            className="text-sm font-medium"
                        />
                    </div>

                    <AnimatePresence>
                        {formData.fecha && formData.servicio && (
                            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="bg-carbon/50 p-4 rounded-2xl border border-onyx">
                                <p className="text-xs uppercase text-steel font-bold mb-3">Hora Disponible</p>
                                {isLoadingSlots ? (
                                    <div className="flex justify-center py-4"><span className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /></div>
                                ) : (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                        {TIME_SLOTS.map((t) => {
                                            const isAvailable = availableSlots.includes(t);
                                            return (
                                                <button type="button" key={t} disabled={!isAvailable} onClick={() => setFormData(prev => ({...prev, hora: t}))}
                                                    className={cn("relative flex items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all border",
                                                        isAvailable ? "cursor-pointer" : "opacity-40 cursor-not-allowed bg-[#0a0a0a] border-onyx text-steel/50",
                                                        formData.hora === t ? "bg-amber-400 text-void border-amber-400 font-bold" : (isAvailable ? "bg-[#111] text-ash border-onyx hover:border-steel" : "")
                                                    )}>
                                                    <span className={cn(isAvailable ? "" : "line-through")}>{t}</span>
                                                    {!isAvailable && <X className="w-3 h-3 absolute right-1 text-steel/40" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <label className="text-xs uppercase text-steel mb-1 block">Observaciones</label>
                    <textarea className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white h-20 text-sm" value={formData.observaciones} onChange={e=>setFormData({...formData, observaciones: e.target.value})}></textarea>
                </div>
            </div>
        );
    };

    return (
        <PanelLayout title="Citas" user={user}>
            <div className="p-4 lg:p-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="font-display font-black text-2xl lg:text-3xl text-white">Gestión de Citas</h1>
                        <p className="text-steel text-xs mt-1">{total} cita{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={openNewModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 text-sm">
                        <Plus className="w-4 h-4" />
                        Nueva Cita
                    </button>
                </div>

                {/* FILTROS */}
                <div className="bg-[#111] border border-white/5 rounded-2xl mb-4 overflow-hidden">
                    {/* Búsqueda + toggle filtros */}
                    <div className="p-3 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel/50" />
                            <input type="text" placeholder="Buscar por nombre, email, teléfono, servicio..."
                                value={localFilters.search}
                                onChange={(e) => setLocalFilters(f => ({...f, search: e.target.value}))}
                                onKeyDown={(e) => { if (e.key === 'Enter') applyFilters({}); }}
                                className="w-full pl-9 pr-4 py-2.5 bg-carbon border border-white/10 rounded-xl text-white placeholder-steel/50 focus:outline-none focus:border-amber-400 transition-all text-sm" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => applyFilters({})}
                                className="px-4 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm whitespace-nowrap">
                                Buscar
                            </button>
                            <button onClick={() => setShowFilters(f => !f)}
                                className={cn("px-3 py-2.5 rounded-xl border transition-colors text-sm flex items-center gap-2",
                                    showFilters ? "bg-white/10 border-white/20 text-white" : "border-white/10 text-steel hover:text-white hover:bg-white/5")}>
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="hidden sm:inline">Filtros</span>
                            </button>
                        </div>
                    </div>

                    {/* Panel de filtros avanzados */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                                <div className="p-3 pt-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 border-t border-white/5">
                                    <div>
                                        <label className="text-[10px] uppercase text-steel font-bold mb-1 block">Fecha</label>
                                        <input type="date" value={localFilters.date}
                                            onChange={(e) => setLocalFilters(f => ({...f, date: e.target.value}))}
                                            className="w-full bg-carbon border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-400" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase text-steel font-bold mb-1 block">Estado</label>
                                        <select value={localFilters.status} onChange={(e) => setLocalFilters(f => ({...f, status: e.target.value}))}
                                            className="w-full bg-carbon border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-400">
                                            <option value="">Todos</option>
                                            <option value="pending">Pendiente</option>
                                            <option value="completed">Terminada</option>
                                            <option value="no-show">No Presentado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase text-steel font-bold mb-1 block">Empleado</label>
                                        <select value={localFilters.employee_id} onChange={(e) => setLocalFilters(f => ({...f, employee_id: Number(e.target.value)}))}
                                            className="w-full bg-carbon border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-400">
                                            <option value={0}>Todos</option>
                                            <option value={1}>Luis (Barbero)</option>
                                            <option value={2}>Carlos (Barbero)</option>
                                            <option value={3}>Mariely (Infantil)</option>
                                        </select>
                                    </div>
                                    {user.role === 'superadmin' && (
                                        <div>
                                            <label className="text-[10px] uppercase text-steel font-bold mb-1 block">Local</label>
                                            <select value={localFilters.service_type} onChange={(e) => setLocalFilters(f => ({...f, service_type: e.target.value}))}
                                                className="w-full bg-carbon border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-400">
                                                <option value="">Todos</option>
                                                <option value="barberia">Barbería</option>
                                                <option value="peluqueria_infantil">Infantil</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="flex items-end gap-2">
                                        <button onClick={() => applyFilters({})} className="flex-1 bg-amber-400 text-void font-bold py-2 rounded-lg text-xs hover:bg-amber-300 transition-colors">Aplicar</button>
                                        <button onClick={() => {
                                            const reset: Filters = { search: '', date: format(new Date(), 'yyyy-MM-dd'), employee_id: 0, status: '', service_type: '' };
                                            setLocalFilters(reset);
                                            router.get('/panel/citas', reset, { preserveState: true, replace: true });
                                        }} className="px-3 bg-carbon text-steel font-bold py-2 rounded-lg text-xs hover:text-white hover:bg-white/5 border border-white/10 transition-colors">Reset</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* TABLA */}
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#0a0a0a] text-steel text-xs uppercase tracking-wider border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3 font-bold">Cliente</th>
                                    <th className="px-4 py-3 font-bold hidden sm:table-cell">Fecha / Hora</th>
                                    <th className="px-4 py-3 font-bold hidden md:table-cell">Servicio</th>
                                    <th className="px-4 py-3 font-bold">Estado</th>
                                    <th className="px-4 py-3 text-right font-bold">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-bone">
                                {appointments.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-steel">No se encontraron citas con los filtros aplicados.</td></tr>
                                ) : appointments.map((appt: any) => (
                                    <tr key={appt.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => handleOpenDetails(appt)}>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-white text-sm">{appt.nombre} {appt.apellidos}</div>
                                            <div className="text-steel text-xs mt-0.5">{appt.telefono}</div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <div className="text-white text-sm flex items-center gap-1.5"><CalIcon className="w-3.5 h-3.5 text-steel shrink-0" /> {appt.fecha}</div>
                                            <div className="text-steel text-xs mt-0.5 flex items-center gap-1.5"><Clock className="w-3 h-3 shrink-0" /> {appt.hora}</div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div className="text-white text-sm">{appt.servicio}</div>
                                            <div className="text-steel text-xs">Emp. {appt.empleado_id}</div>
                                        </td>
                                        <td className="px-4 py-3">{getStatusBadge(appt.estado)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={(e) => { e.stopPropagation(); handleOpenDetails(appt); }} className="p-2 text-steel hover:text-amber-400 transition-colors rounded-lg hover:bg-amber-400/10">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINACIÓN */}
                    {totalPages > 1 && (
                        <div className="p-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
                            <p className="text-steel text-xs">Página {page} de {totalPages} · {total} resultados</p>
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => changePage(Math.max(1, page - 1))} disabled={page <= 1}
                                    className="p-2 rounded-lg border border-white/10 text-steel hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                    return p <= totalPages ? (
                                        <button key={p} onClick={() => changePage(p)}
                                            className={cn("w-8 h-8 rounded-lg text-xs font-bold transition-colors", p === page ? "bg-amber-400 text-void" : "border border-white/10 text-steel hover:text-white hover:bg-white/5")}>
                                            {p}
                                        </button>
                                    ) : null;
                                })}
                                <button onClick={() => changePage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                                    className="p-2 rounded-lg border border-white/10 text-steel hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DETALLE / EDITAR */}
            <AnimatePresence>
                {selectedAppt && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAppt(null)} />
                        <motion.div initial={{opacity:0, y: 50}} animate={{opacity:1, y: 0}} exit={{opacity:0, y: 50}}
                            className="bg-[#111] border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto relative z-10 shadow-2xl">
                            
                            {/* Drag handle móvil */}
                            <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />

                            <div className="sticky top-0 bg-[#111]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-20">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-display font-black text-lg text-white">Cita #{selectedAppt.id}</h3>
                                    {getStatusBadge(selectedAppt.estado)}
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isEditMode && selectedAppt.estado === 'pending' && (
                                        <button onClick={startEditMode} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => setSelectedAppt(null)} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                {isEditMode ? (
                                    <div>
                                        {renderDynamicForm()}
                                        <div className="flex gap-3 pt-4 mt-4 border-t border-white/10">
                                            <button onClick={handleSaveEdit} disabled={!formData.hora}
                                                className="flex-1 bg-amber-400 text-void font-bold py-3 rounded-xl hover:bg-amber-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                                                <Save className="w-4 h-4" /> Guardar Cambios
                                            </button>
                                            <button onClick={() => setIsEditMode(false)} className="px-5 bg-carbon text-white font-bold rounded-xl border border-white/10 hover:bg-white/5 text-sm">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-carbon/50 p-4 rounded-2xl border border-white/5">
                                            <div>
                                                <p className="text-steel text-xs uppercase tracking-wider mb-1">Cliente</p>
                                                <p className="font-bold text-white">{selectedAppt.nombre} {selectedAppt.apellidos}</p>
                                                <div className="flex items-center gap-2 mt-2 text-steel text-sm"><Phone className="w-3.5 h-3.5"/> {selectedAppt.telefono}</div>
                                                <div className="flex items-center gap-2 mt-1 text-steel text-sm break-all"><Mail className="w-3.5 h-3.5 shrink-0"/> {selectedAppt.email}</div>
                                            </div>
                                            <div>
                                                <p className="text-steel text-xs uppercase tracking-wider mb-1">Cita</p>
                                                <p className="font-bold text-white">{selectedAppt.servicio}</p>
                                                <div className="flex items-center gap-2 mt-2 text-steel text-sm"><CalIcon className="w-3.5 h-3.5"/> {selectedAppt.fecha}</div>
                                                <div className="flex items-center gap-2 mt-1 text-steel text-sm"><Clock className="w-3.5 h-3.5"/> {selectedAppt.hora}</div>
                                                <div className="flex items-center gap-2 mt-1 text-steel text-sm"><User className="w-3.5 h-3.5"/> Emp. {selectedAppt.empleado_id}</div>
                                            </div>
                                        </div>

                                        {selectedAppt.observaciones && (
                                            <div>
                                                <p className="text-steel text-xs uppercase tracking-wider mb-2">Observaciones</p>
                                                <div className="bg-carbon p-3 rounded-xl text-bone text-sm border border-white/5">{selectedAppt.observaciones}</div>
                                            </div>
                                        )}

                                        {selectedAppt.estado === 'pending' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                                <button onClick={() => confirmAction('completed', selectedAppt.id, '¿Marcar como Terminada?', 'Se sumará 1 punto de fidelidad al cliente y contará en estadísticas de ingresos.', 'emerald')}
                                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white transition-colors text-sm">
                                                    <CheckCircle2 className="w-5 h-5" /> Terminada
                                                </button>
                                                <button onClick={() => confirmAction('no-show', selectedAppt.id, '¿Marcar como No Presentado?', 'El cliente recibirá penalización y perderá sus puntos de fidelidad.', 'amber')}
                                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 text-amber-400 font-bold hover:bg-amber-500 hover:text-void transition-colors text-sm">
                                                    <XCircle className="w-5 h-5" /> No Presentado
                                                </button>
                                            </div>
                                        )}

                                        <div className="pt-3 flex justify-end border-t border-white/5">
                                            <button onClick={() => confirmAction('delete', selectedAppt.id, '¿Eliminar esta cita?', 'Se borrará permanentemente de la base de datos.', 'red')}
                                                className="flex items-center gap-2 text-red-500/70 hover:text-red-400 text-sm font-bold transition-colors">
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

            {/* MODAL NUEVA CITA */}
            <AnimatePresence>
                {showNewModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNewModal(false)} />
                        <motion.div initial={{opacity:0, y: 50}} animate={{opacity:1, y: 0}} exit={{opacity:0, y: 50}}
                            className="bg-[#111] border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto relative z-10 shadow-2xl p-4">
                            <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-display font-black text-xl text-white">Nueva Cita Manual</h3>
                                <button onClick={() => setShowNewModal(false)} className="p-2 text-steel hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSaveNew}>
                                {renderDynamicForm()}
                                <button type="submit" disabled={!formData.hora}
                                    className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-400 mt-5 shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                    Crear y Guardar Reserva
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL CONFIRMACIÓN */}
            <AnimatePresence>
                {confirmModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
                        <motion.div initial={{opacity:0, scale:0.9, y: 20}} animate={{opacity:1, scale:1, y: 0}} exit={{opacity:0, scale:0.9, y: 20}}
                            className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-sm relative z-10 shadow-2xl overflow-hidden">
                            <div className={`h-1.5 w-full ${confirmModal.color === 'emerald' ? 'bg-emerald-500' : confirmModal.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} />
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-full ${confirmModal.color === 'emerald' ? 'bg-emerald-500/10' : confirmModal.color === 'amber' ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                                        <AlertTriangle className={`w-5 h-5 ${confirmModal.color === 'emerald' ? 'text-emerald-400' : confirmModal.color === 'amber' ? 'text-amber-400' : 'text-red-400'}`} />
                                    </div>
                                    <h3 className="font-display font-bold text-base text-white">{confirmModal.title}</h3>
                                </div>
                                <p className="text-steel text-sm leading-relaxed mb-5">{confirmModal.text}</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setConfirmModal(null)} className="flex-1 bg-carbon text-white font-bold py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm">Cancelar</button>
                                    <button onClick={executeAction}
                                        className={`flex-1 font-bold py-2.5 rounded-xl text-white text-sm ${confirmModal.color === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-400' : confirmModal.color === 'amber' ? 'bg-amber-500 hover:bg-amber-400 text-void' : 'bg-red-500 hover:bg-red-400'}`}>
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PanelLayout>
    );
}
