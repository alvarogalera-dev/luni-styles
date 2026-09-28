import { Head } from '@inertiajs/react';
import PanelLayout from './Layout';
import { TrendingUp, Users, CalendarDays, DollarSign, Activity, Star, Scissors, AlertOctagon, CheckCircle2, Clock, BarChart3, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

function StatCard({ icon: Icon, label, value, sub, color = 'amber', glow = false }: any) {
    const colors: Record<string, string> = {
        amber:   'text-amber-400 bg-amber-400/10',
        emerald: 'text-emerald-400 bg-emerald-400/10',
        blue:    'text-blue-400 bg-blue-400/10',
        rose:    'text-rose-400 bg-rose-400/10',
        purple:  'text-purple-400 bg-purple-400/10',
        cyan:    'text-cyan-400 bg-cyan-400/10',
    };
    const glowColors: Record<string, string> = {
        amber:   'from-amber-400 to-amber-600 shadow-amber-500/30',
        emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20',
        blue:    'from-blue-400 to-blue-600 shadow-blue-500/20',
    };

    if (glow) {
        return (
            <div className={`bg-gradient-to-br ${glowColors[color]} p-5 rounded-2xl relative overflow-hidden shadow-xl`}>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3 relative z-10">
                    <h3 className="text-black/60 font-bold uppercase tracking-wider text-xs">{label}</h3>
                    <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                </div>
                <p className="text-4xl font-display font-black text-white relative z-10">{value}</p>
                {sub && <p className="text-xs text-white/70 mt-1 relative z-10">{sub}</p>}
            </div>
        );
    }

    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${colors[color].split(' ')[0].replace('text-', 'bg-').replace('-400', '-500')}/10 rounded-full blur-2xl pointer-events-none`} />
            <div className="flex items-center justify-between mb-3 relative z-10">
                <h3 className="text-steel font-bold uppercase tracking-wider text-xs">{label}</h3>
                <div className={`w-8 h-8 rounded-full bg-carbon border border-white/10 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${colors[color].split(' ')[0]}`} />
                </div>
            </div>
            <p className="text-4xl font-display font-black text-white relative z-10">{value}</p>
            {sub && <p className="text-xs text-steel mt-1 relative z-10">{sub}</p>}
        </div>
    );
}

export default function Statistics({ stats, user }: any) {
    const { cortes, ingresos, servicios, empleados, clientesPenalizados, tasaAsistencia, horaPunta, diaPunta } = stats;

    const typeLabel = stats.type === 'barberia' ? '— Barbería' : stats.type === 'peluqueria_infantil' ? '— Peluquería Infantil' : '';

    return (
        <PanelLayout title="Estadísticas" user={user}>
            <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="font-display font-black text-2xl lg:text-3xl text-white">
                        Estadísticas y Rendimiento <span className="text-steel font-medium text-lg">{typeLabel}</span>
                    </h1>
                    <p className="text-steel text-sm mt-1">Análisis detallado en tiempo real · Solo citas completadas</p>
                </div>

                {/* ── ROW 1: KPIs Cortes ── */}
                <div>
                    <h2 className="text-xs uppercase text-steel font-bold tracking-widest mb-3">Cortes / Servicios</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                        <StatCard icon={Activity}     label="Hoy"          value={cortes.hoy}    color="amber" />
                        <StatCard icon={TrendingUp}   label="Esta Semana"  value={cortes.semana} color="emerald" sub={`~${(cortes.semana / 5).toFixed(1)}/día`} />
                        <StatCard icon={CalendarDays} label="Este Mes"     value={cortes.mes}    color="blue" />
                        <StatCard icon={Calendar}     label="Este Año"     value={cortes.ano}    color="purple" />
                        <StatCard icon={Scissors}     label="Histórico"    value={cortes.total}  color="cyan" />
                    </div>
                </div>

                {/* ── ROW 2: Ingresos ── */}
                {stats.type !== 'peluqueria_infantil' && (
                    <div>
                        <h2 className="text-xs uppercase text-steel font-bold tracking-widest mb-3">Ingresos (€)</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <StatCard icon={DollarSign} label="Hoy"         value={`${(ingresos?.hoy ?? 0).toFixed(2)}€`}    color="amber" glow />
                            <StatCard icon={DollarSign} label="Esta Semana" value={`${(ingresos?.semana ?? 0).toFixed(2)}€`} color="amber" glow />
                            <StatCard icon={DollarSign} label="Este Mes"    value={`${(ingresos?.mes ?? 0).toFixed(2)}€`}   color="emerald" glow />
                            <StatCard icon={DollarSign} label="Este Año"    value={`${(ingresos?.ano ?? 0).toFixed(2)}€`}   color="blue" glow />
                        </div>
                    </div>
                )}

                {/* ── ROW 3: KPIs Avanzados ── */}
                <div>
                    <h2 className="text-xs uppercase text-steel font-bold tracking-widest mb-3">Análisis Avanzado</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard icon={CheckCircle2}  label="Tasa Asistencia" value={`${tasaAsistencia}%`}       color="emerald" sub="Citas completadas / totales" />
                        <StatCard icon={AlertOctagon}  label="Clientes Penalizados" value={clientesPenalizados}   color="rose"    sub="Con penalización activa" />
                        <StatCard icon={Clock}         label="Hora Punta"      value={horaPunta}                  color="cyan"    sub="La más demandada" />
                        <StatCard icon={BarChart3}     label="Día Punta"       value={diaPunta}                   color="purple"  sub="Más citas por día" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 4. Empleados */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/5 bg-[#161616] flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-400" />
                            <h2 className="font-display font-bold text-lg text-white">Rendimiento por Empleado</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            {empleados.map((emp: any, i: number) => (
                                <div key={emp.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-carbon rounded-2xl border border-white/5 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0">
                                            <span className="font-display font-black text-amber-400 text-base">{emp.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{emp.name}</p>
                                            <p className="text-steel text-xs flex items-center gap-1 mt-0.5">
                                                <Star className="w-3 h-3 text-amber-400" /> {emp.top_service}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-display font-black text-white">{emp.total_cortes}</p>
                                        <p className="text-steel text-[10px] uppercase tracking-widest font-bold">Completados</p>
                                    </div>
                                </div>
                            ))}
                            {empleados.length === 0 && <p className="text-steel text-center py-6 text-sm">No hay datos aún. Las estadísticas se generan con citas completadas.</p>}
                        </div>
                    </div>

                    {/* 5. Servicios */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/5 bg-[#161616] flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-emerald-400" />
                            <h2 className="font-display font-bold text-lg text-white">Servicios Más Demandados</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            {servicios.map((srv: any, index: number) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 
                                        ${index === 0 ? 'bg-amber-400 text-void' : index === 1 ? 'bg-slate-300 text-slate-800' : index === 2 ? 'bg-amber-700 text-amber-100' : 'bg-carbon text-steel border border-white/10'}`}>
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-white text-sm truncate">{srv.service_name}</span>
                                            <span className="text-steel font-bold text-sm ml-2 shrink-0">{srv.total}</span>
                                        </div>
                                        <div className="w-full bg-carbon rounded-full h-1.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(srv.total / (servicios[0]?.total || 1)) * 100}%` }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                className={`h-1.5 rounded-full ${index === 0 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {servicios.length === 0 && <p className="text-steel text-center py-6 text-sm">No hay servicios completados aún.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
}
