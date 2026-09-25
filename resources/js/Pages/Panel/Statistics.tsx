import { Head } from '@inertiajs/react';
import PanelLayout from './Layout';
import { TrendingUp, Users, CalendarDays, DollarSign, Activity, Star, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Statistics({ stats, user }: any) {
    const { cortes, ingresosHoy, servicios, empleados } = stats;

    return (
        <PanelLayout title="Estadísticas" user={user}>
            <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="font-display font-black text-3xl text-white">Estadísticas y Rendimiento</h1>
                    <p className="text-steel text-sm mt-1">Análisis detallado en tiempo real</p>
                </div>

                {/* 1. KPIs principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#111] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-steel font-bold uppercase tracking-wider text-xs">Cortes Hoy</h3>
                            <div className="w-8 h-8 rounded-full bg-carbon border border-white/10 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-amber-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-display font-black text-white relative z-10">{cortes.hoy}</p>
                    </div>

                    <div className="bg-[#111] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-steel font-bold uppercase tracking-wider text-xs">Cortes Esta Semana</h3>
                            <div className="w-8 h-8 rounded-full bg-carbon border border-white/10 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-display font-black text-white relative z-10">{cortes.semana}</p>
                        <p className="text-xs text-steel mt-2">Media de {(cortes.semana / 7).toFixed(1)} al día</p>
                    </div>

                    <div className="bg-[#111] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-steel font-bold uppercase tracking-wider text-xs">Cortes Este Mes</h3>
                            <div className="w-8 h-8 rounded-full bg-carbon border border-white/10 flex items-center justify-center">
                                <CalendarDays className="w-4 h-4 text-blue-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-display font-black text-white relative z-10">{cortes.mes}</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-3xl relative overflow-hidden shadow-xl shadow-amber-500/20">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-amber-900 font-bold uppercase tracking-wider text-xs">Ingresos Hoy</h3>
                            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-void" />
                            </div>
                        </div>
                        <p className="text-4xl font-display font-black text-void relative z-10">{ingresosHoy.toFixed(2)}€</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 2. Empleados y su rendimiento */}
                    <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-[#161616]">
                            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-amber-400" /> Rendimiento por Empleado
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {empleados.map((emp: any) => (
                                <div key={emp.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-carbon rounded-2xl border border-white/5 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0">
                                            <span className="font-display font-black text-amber-400 text-lg">{emp.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">{emp.name}</p>
                                            <p className="text-steel text-sm flex items-center gap-1 mt-1">
                                                <Star className="w-3.5 h-3.5 text-amber-400" /> Servicio Top: {emp.top_service}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-display font-black text-white">{emp.total_cortes}</p>
                                        <p className="text-steel text-xs uppercase tracking-widest font-bold">Cortes Totales</p>
                                    </div>
                                </div>
                            ))}
                            {empleados.length === 0 && <p className="text-steel text-center py-4">No hay datos suficientes.</p>}
                        </div>
                    </div>

                    {/* 3. Servicios más demandados */}
                    <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-[#161616]">
                            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                                <Scissors className="w-5 h-5 text-emerald-400" /> Servicios Más Demandados
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {servicios.map((srv: any, index: number) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${index === 0 ? 'bg-amber-400 text-void' : index === 1 ? 'bg-slate-300 text-slate-800' : index === 2 ? 'bg-amber-700 text-amber-100' : 'bg-carbon text-steel border border-white/10'}`}>
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-white text-sm">{srv.service_name}</span>
                                            <span className="text-steel font-bold text-sm">{srv.total} reservas</span>
                                        </div>
                                        <div className="w-full bg-carbon rounded-full h-2">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(srv.total / (servicios[0]?.total || 1)) * 100}%` }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                className={`h-2 rounded-full ${index === 0 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {servicios.length === 0 && <p className="text-steel text-center py-4">No hay servicios registrados.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
}
