import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import PanelLayout from './Layout';
import { Plus, Search, MoreVertical, X, Calendar as CalIcon, Clock, User, Phone, Mail, Edit2, Trash2, CheckCircle2, XCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ appointments, user }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAppt, setSelectedAppt] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    
    // Edit / New form state
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        fecha: '',
        hora: '',
        servicio: '',
        tipo_servicio: 'barberia',
        empleado_id: 1,
        precio: '',
        observaciones: ''
    });

    const filteredAppts = appointments.filter((appt: any) => 
        appt.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.telefono.includes(searchTerm) ||
        appt.servicio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDetails = (appt: any) => {
        setSelectedAppt(appt);
        setIsEditMode(false);
        setFormData({
            nombre: appt.nombre,
            apellidos: appt.apellidos || '',
            telefono: appt.telefono || '',
            email: appt.email || '',
            fecha: appt.fecha,
            hora: appt.hora,
            servicio: appt.servicio,
            tipo_servicio: appt.tipo_servicio,
            empleado_id: appt.empleado_id,
            precio: appt.precio,
            observaciones: appt.observaciones || ''
        });
    };

    const handleUpdateStatus = (id: number, status: string) => {
        if(confirm(`¿Estás seguro de marcar esta cita como ${status === 'completed' ? 'TERMINADA' : 'NO PRESENTADO'}?`)) {
            router.put(`/panel/citas/${id}/status`, { status }, {
                preserveScroll: true,
                onSuccess: () => setSelectedAppt(null)
            });
        }
    };

    const handleDelete = (id: number) => {
        if(confirm('¿Eliminar esta cita definitivamente?')) {
            router.delete(`/panel/citas/${id}`, {
                preserveScroll: true,
                onSuccess: () => setSelectedAppt(null)
            });
        }
    };

    const handleSaveEdit = () => {
        router.put(`/panel/citas/${selectedAppt.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditMode(false);
                setSelectedAppt(null);
            }
        });
    };

    const handleSaveNew = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/api/booking', formData, { // Reusing frontend endpoint or a new one
            preserveScroll: true,
            onSuccess: () => {
                setShowNewModal(false);
                router.reload();
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">Pendiente</span>;
            case 'completed': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Terminada</span>;
            case 'no-show': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">No Presentado</span>;
            default: return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">{status}</span>;
        }
    };

    return (
        <PanelLayout title="Citas" user={user}>
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-display font-black text-3xl text-white">Gestión de Citas</h1>
                        <p className="text-steel text-sm mt-1">Administra las reservas de los clientes</p>
                    </div>
                    <button 
                        onClick={() => setShowNewModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 text-void font-bold rounded-xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Cita
                    </button>
                </div>

                <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-white/5 bg-[#161616]">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel/50" />
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre, teléfono o servicio..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-carbon border border-white/10 rounded-xl text-white placeholder-steel/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#0a0a0a] text-steel text-xs uppercase tracking-wider border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Cliente</th>
                                    <th className="px-6 py-4 font-bold">Fecha y Hora</th>
                                    <th className="px-6 py-4 font-bold">Servicio</th>
                                    <th className="px-6 py-4 font-bold">Estado</th>
                                    <th className="px-6 py-4 text-right font-bold">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-bone">
                                {filteredAppts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-steel">No se encontraron citas.</td>
                                    </tr>
                                ) : filteredAppts.map((appt: any) => (
                                    <tr key={appt.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => handleOpenDetails(appt)}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{appt.nombre} {appt.apellidos}</div>
                                            <div className="text-steel text-xs mt-0.5">{appt.telefono}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white flex items-center gap-1.5"><CalIcon className="w-3.5 h-3.5 text-steel" /> {appt.fecha}</div>
                                            <div className="text-steel text-xs mt-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {appt.hora}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white">{appt.servicio}</div>
                                            <div className="text-steel text-xs mt-0.5">Emp: {appt.empleado_id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(appt.estado)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-steel hover:text-amber-400 transition-colors rounded-lg hover:bg-amber-400/10">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Detalle/Editar */}
            <AnimatePresence>
                {selectedAppt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAppt(null)} />
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl">
                            
                            <div className="sticky top-0 bg-[#111]/90 backdrop-blur-md border-b border-white/5 p-4 sm:p-6 flex items-center justify-between z-20">
                                <div>
                                    <h3 className="font-display font-black text-xl text-white">Detalles de Cita #{selectedAppt.id}</h3>
                                    {getStatusBadge(selectedAppt.estado)}
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isEditMode && selectedAppt.estado === 'pending' && (
                                        <button onClick={() => setIsEditMode(true)} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => setSelectedAppt(null)} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                {isEditMode ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs uppercase text-steel mb-1 block">Nombre</label>
                                                <input type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-steel mb-1 block">Apellidos</label>
                                                <input type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.apellidos} onChange={e=>setFormData({...formData, apellidos: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-steel mb-1 block">Teléfono</label>
                                                <input type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.telefono} onChange={e=>setFormData({...formData, telefono: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-steel mb-1 block">Email</label>
                                                <input type="email" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-steel mb-1 block">Fecha</label>
                                                <input type="date" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.fecha} onChange={e=>setFormData({...formData, fecha: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-steel mb-1 block">Hora</label>
                                                <input type="time" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.hora} onChange={e=>setFormData({...formData, hora: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-steel mb-1 block">Servicio</label>
                                                <input type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.servicio} onChange={e=>setFormData({...formData, servicio: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-steel mb-1 block">Empleado Asignado (ID)</label>
                                                <select className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.empleado_id} onChange={e=>setFormData({...formData, empleado_id: Number(e.target.value)})}>
                                                    <option value={1}>Luis (1)</option>
                                                    <option value={2}>Carlos (2)</option>
                                                    <option value={3}>Mariely (3)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase text-steel mb-1 block">Observaciones</label>
                                            <textarea className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white h-24" value={formData.observaciones} onChange={e=>setFormData({...formData, observaciones: e.target.value})}></textarea>
                                        </div>
                                        
                                        <div className="flex gap-3 pt-4">
                                            <button onClick={handleSaveEdit} className="flex-1 bg-amber-400 text-void font-bold py-3 rounded-xl hover:bg-amber-300 flex items-center justify-center gap-2">
                                                <Save className="w-4 h-4" /> Guardar Cambios
                                            </button>
                                            <button onClick={() => setIsEditMode(false)} className="px-6 bg-carbon text-white font-bold rounded-xl border border-white/10 hover:bg-white/5">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-carbon/50 p-4 rounded-2xl border border-white/5">
                                            <div>
                                                <p className="text-steel text-xs uppercase tracking-wider mb-1">Cliente</p>
                                                <p className="font-bold text-white text-lg">{selectedAppt.nombre} {selectedAppt.apellidos}</p>
                                                <div className="flex items-center gap-2 mt-2 text-steel text-sm"><Phone className="w-4 h-4"/> {selectedAppt.telefono}</div>
                                                <div className="flex items-center gap-2 mt-1 text-steel text-sm"><Mail className="w-4 h-4"/> {selectedAppt.email}</div>
                                            </div>
                                            <div>
                                                <p className="text-steel text-xs uppercase tracking-wider mb-1">Cita</p>
                                                <p className="font-bold text-white text-lg">{selectedAppt.servicio}</p>
                                                <div className="flex items-center gap-2 mt-2 text-steel text-sm"><CalIcon className="w-4 h-4"/> {selectedAppt.fecha}</div>
                                                <div className="flex items-center gap-2 mt-1 text-steel text-sm"><Clock className="w-4 h-4"/> {selectedAppt.hora}</div>
                                                <div className="flex items-center gap-2 mt-1 text-steel text-sm"><User className="w-4 h-4"/> Asignado a: Emp. {selectedAppt.empleado_id}</div>
                                            </div>
                                        </div>

                                        {selectedAppt.observaciones && (
                                            <div>
                                                <p className="text-steel text-xs uppercase tracking-wider mb-2">Observaciones</p>
                                                <div className="bg-carbon p-4 rounded-xl text-bone text-sm border border-white/5">
                                                    {selectedAppt.observaciones}
                                                </div>
                                            </div>
                                        )}

                                        {selectedAppt.estado === 'pending' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-white/5">
                                                <button onClick={() => handleUpdateStatus(selectedAppt.id, 'completed')} className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white transition-colors">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Marcar como Terminada
                                                </button>
                                                <button onClick={() => handleUpdateStatus(selectedAppt.id, 'no-show')} className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-colors">
                                                    <XCircle className="w-5 h-5" />
                                                    No Presentado
                                                </button>
                                            </div>
                                        )}

                                        <div className="pt-4 flex justify-end">
                                            <button onClick={() => handleDelete(selectedAppt.id)} className="flex items-center gap-2 text-red-500/70 hover:text-red-400 text-sm font-bold transition-colors">
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

            {/* Modal Nueva Cita (muy básico para que la appunte) */}
            <AnimatePresence>
                {showNewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNewModal(false)} />
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-display font-black text-2xl text-white">Nueva Cita Manual</h3>
                                <button onClick={() => setShowNewModal(false)} className="p-2 text-steel hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            
                            <form onSubmit={handleSaveNew} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs uppercase text-steel mb-1 block">Nombre</label><input required type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} /></div>
                                    <div><label className="text-xs uppercase text-steel mb-1 block">Apellidos</label><input required type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.apellidos} onChange={e=>setFormData({...formData, apellidos: e.target.value})} /></div>
                                    <div><label className="text-xs uppercase text-steel mb-1 block">Teléfono</label><input required type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.telefono} onChange={e=>setFormData({...formData, telefono: e.target.value})} /></div>
                                    <div><label className="text-xs uppercase text-steel mb-1 block">Email</label><input required type="email" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /></div>
                                    <div><label className="text-xs uppercase text-steel mb-1 block">Fecha</label><input required type="date" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.fecha} onChange={e=>setFormData({...formData, fecha: e.target.value})} /></div>
                                    <div><label className="text-xs uppercase text-steel mb-1 block">Hora</label><input required type="time" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.hora} onChange={e=>setFormData({...formData, hora: e.target.value})} /></div>
                                    <div>
                                        <label className="text-xs uppercase text-steel mb-1 block">Tipo Local</label>
                                        <select className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.tipo_servicio} onChange={e=>setFormData({...formData, tipo_servicio: e.target.value})}>
                                            <option value="barberia">Barbería</option>
                                            <option value="peluqueria_infantil">Peluquería Infantil</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase text-steel mb-1 block">Servicio Exacto</label>
                                        <input required placeholder="Ej: Corte + Barba" type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.servicio} onChange={e=>setFormData({...formData, servicio: e.target.value})} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs uppercase text-steel mb-1 block">Precio Aproximado</label>
                                        <input required placeholder="Ej: 15€" type="text" className="w-full bg-carbon border border-white/10 rounded-lg p-2.5 text-white" value={formData.precio} onChange={e=>setFormData({...formData, precio: e.target.value})} />
                                    </div>
                                </div>
                                
                                <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-400 mt-6 shadow-xl shadow-emerald-500/20">
                                    Añadir a la Base de Datos
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </PanelLayout>
    );
}
