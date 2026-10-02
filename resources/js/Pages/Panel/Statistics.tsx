import { useState } from 'react';
import PanelLayout from './Layout';
import { BarChart3, TrendingUp, Users, AlertTriangle, Scissors, ChevronDown, X, Calendar, Clock, Phone, Mail, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head } from '@inertiajs/react';

// Helper: card de stat
function StatCard({ title, value, sub, icon: Icon, color = 'amber', onClick }: any) {
    const colors: any = {
        amber:   'bg-amber-400/10 text-amber-400 border-amber-400/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        red:     'bg-red-500/10 text-red-400 border-red-500/20',
        purple:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
        steel:   'bg-white/5 text-steel border-white/10',
    };
    return (
        <motion.div
            whileHover={onClick ? { scale: 1.02 } : {}}
            whileTap={onClick ? { scale: 0.98 } : {}}
            onClick={onClick}
            className={`bg-[#111] border border-white/5 rounded-2xl p-5 ${onClick ? 'cursor-pointer hover:border-amber-400/30' : ''}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {onClick && <ChevronRight className="w-4 h-4 text-steel/40 mt-1" />}
            </div>
            <p className="text-steel text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <p className="font-display font-black text-2xl text-white">{value}</p>
            {sub && <p className="text-steel text-xs mt-1">{sub}</p>}
        </motion.div>
    );
}

// Modal de penalizados
function PenalizadosModal({ type, onClose }: { type: string; onClose: () => void }) {
    const [penalizados, setPenalizados] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useState(() => {
        const fetchPenalizados = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/panel/api/stats/penalizados?type=${type}`);
                const data = await res.json();
                setPenalizados(data.penalizados || []);
            } catch {
                setPenalizados([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPenalizados();
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative z-10 shadow-2xl"
            >
                <div className="sticky top-0 bg-[#111]/95 backdrop-blur-md border-b border-white/5 p-5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="font-display font-black text-white text-lg">Clientes Penalizados</h3>
                            <p className="text-steel text-xs">{type === 'barberia' ? 'Barbería' : 'Peluquería Infantil'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <span className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                        </div>
                    ) : penalizados?.length === 0 ? (
                        <div className="text-center py-16 text-steel">
                            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-emerald-400 opacity-50" />
                            <p className="font-bold text-emerald-400">¡Sin penalizados!</p>
                            <p className="text-xs mt-1">No hay clientes penalizados actualmente.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {penalizados?.map((c) => (
                                <div key={c.id} className="bg-carbon/50 p-4 rounded-2xl border border-red-500/10">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-white">{c.nombre}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="flex items-center gap-1 text-xs text-steel">
                                                    <Phone className="w-3 h-3" /> {c.telefono || '—'}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-steel">
                                                    <Mail className="w-3 h-3" /> {c.email || '—'}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-red-500/20">
                                            ⚠️ Penalizado
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-carbon p-2 rounded-xl text-center">
                                            <p className="text-white font-bold text-lg">{c.citas_no_show}</p>
                                            <p className="text-[10px] text-red-400 font-bold">No-shows</p>
                                        </div>
                                        <div className="bg-carbon p-2 rounded-xl text-center">
                                            <p className="text-white font-bold text-lg">{c.citas_completadas}</p>
                                            <p className="text-[10px] text-emerald-400 font-bold">Completadas</p>
                                        </div>
                                        <div className="bg-carbon p-2 rounded-xl text-center">
                                            <p className="text-white font-bold text-lg">{c.total_citas}</p>
                                            <p className="text-[10px] text-steel font-bold">Total</p>
                                        </div>
                                    </div>
                                    {c.consecutive_misses > 0 && (
                                        <p className="text-[10px] text-red-400/70 mt-2">
                                            {c.consecutive_misses} falta(s) consecutiva(s) sin recuperarse
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// Modal de drill-down (lista de citas de un período)
function DrillDownModal({ type, period, filter, status, title, onClose }: any) {
    const [appointments, setAppointments] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useState(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ type, period, filter: filter || '', status: status || 'completed' });
                const res = await fetch(`/panel/api/stats/drill?${params.toString()}`);
                const data = await res.json();
                setAppointments(data.appointments || []);
            } catch {
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative z-10 shadow-2xl"
            >
                <div className="sticky top-0 bg-[#111]/95 backdrop-blur-md border-b border-white/5 p-5 flex items-center justify-between z-20">
                    <div>
                        <h3 className="font-display font-black text-white text-lg">{title}</h3>
                        <p className="text-steel text-xs">{appointments?.length ?? '—'} citas encontradas</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <span className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                        </div>
                    ) : appointments?.length === 0 ? (
                        <div className="text-center py-16 text-steel">
                            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p>No hay citas en este período.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {appointments?.map((a) => (
                                <div key={a.id} className="bg-carbon/50 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-white text-sm">{a.nombre}</p>
                                        <p className="text-steel text-xs">{a.servicio}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-amber-400 text-sm font-bold">{a.fecha}</p>
                                        <p className="text-steel text-xs">{a.hora}h</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function Statistics({ stats, user }: any) {
    const [showPenalizados, setShowPenalizados] = useState(false);
    const [drillDown, setDrillDown] = useState<any>(null);

    const openDrill = (period: string, filter: string, title: string, status = 'completed') => {
        setDrillDown({ period, filter, title, status });
    };

    const isBarber = stats?.type === 'barberia';
    const accentColor = isBarber ? 'amber' : 'emerald';

    return (
        <PanelLayout title="Estadísticas" user={user}>
            <Head title="Estadísticas · Panel" />
            <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="font-display font-black text-2xl lg:text-3xl text-white">
                        Estadísticas
                    </h1>
                    <p className="text-steel text-xs mt-1">
                        {stats?.type === 'barberia' ? 'Barbería · Luis & Carlos' : 'Peluquería Infantil · Mariely'}
                    </p>
                </div>

                {/* ── CORTES ── */}
                <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-steel/60 font-bold mb-3 flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5" /> Cortes Completados
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard
                            title="Hoy"
                            value={stats?.cortes?.hoy ?? 0}
                            icon={Calendar}
                            color={accentColor}
                            onClick={() => openDrill('day', new Date().toISOString().split('T')[0], `Cortes Hoy · ${new Date().toLocaleDateString('es-ES')}`)}
                        />
                        <StatCard
                            title="Esta semana"
                            value={stats?.cortes?.semana ?? 0}
                            icon={Calendar}
                            color={accentColor}
                            onClick={() => openDrill('week', '', 'Cortes Esta Semana')}
                        />
                        <StatCard
                            title="Este mes"
                            value={stats?.cortes?.mes ?? 0}
                            icon={Calendar}
                            color={accentColor}
                            onClick={() => {
                                const now = new Date();
                                openDrill('month', `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`, `Cortes ${now.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}`);
                            }}
                        />
                        <StatCard
                            title="Este año"
                            value={stats?.cortes?.ano ?? 0}
                            sub={`Total histórico: ${stats?.cortes?.total ?? 0}`}
                            icon={BarChart3}
                            color={accentColor}
                            onClick={() => openDrill('year', `${new Date().getFullYear()}`, `Cortes ${new Date().getFullYear()}`)}
                        />
                    </div>
                </div>

                {/* ── COMPLETADAS / NO-SHOWS ── */}
                <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-steel/60 font-bold mb-3 flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5" /> Asistencia (Todos los tiempos)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <StatCard
                            title="Completadas"
                            value={stats?.citasCompletadas ?? 0}
                            icon={BarChart3}
                            color="emerald"
                            onClick={() => openDrill('year', `${new Date().getFullYear()}`, 'Todas las citas completadas')}
                        />
                        <StatCard
                            title="No presentados"
                            value={stats?.citasNoShow ?? 0}
                            icon={AlertTriangle}
                            color="red"
                            onClick={() => openDrill('year', `${new Date().getFullYear()}`, 'No presentados', 'no-show')}
                        />
                        <StatCard
                            title="Tasa de asistencia"
                            value={`${stats?.tasaAsistencia ?? 0}%`}
                            sub="De todos los tiempos"
                            icon={TrendingUp}
                            color="emerald"
                        />
                    </div>
                </div>

                {/* ── INGRESOS ── */}
                <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-steel/60 font-bold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5" /> Ingresos (€)
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard title="Hoy" value={`${stats?.ingresos?.hoy ?? 0}€`} icon={TrendingUp} color={accentColor} />
                        <StatCard title="Esta semana" value={`${stats?.ingresos?.semana ?? 0}€`} icon={TrendingUp} color={accentColor} />
                        <StatCard title="Este mes" value={`${stats?.ingresos?.mes ?? 0}€`} icon={TrendingUp} color={accentColor} />
                        <StatCard title="Este año" value={`${stats?.ingresos?.ano ?? 0}€`} icon={TrendingUp} color={accentColor} />
                    </div>
                </div>

                {/* ── PENALIZADOS ── */}
                <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-steel/60 font-bold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5" /> Penalizados
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPenalizados(true)}
                        className="w-full bg-[#111] border border-red-500/20 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-red-500/40 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-steel text-xs font-bold uppercase tracking-wider">Clientes penalizados actualmente</p>
                                <p className="font-display font-black text-3xl text-white mt-0.5">{stats?.clientesPenalizados ?? 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                            Ver detalle <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.button>
                </div>

                {/* ── SERVICIOS Y EMPLEADOS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Servicios */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
                        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-steel" /> Servicios más demandados
                        </h2>
                        {stats?.servicios?.length === 0 ? (
                            <p className="text-steel text-sm">Sin datos aún.</p>
                        ) : (
                            <div className="space-y-3">
                                {stats?.servicios?.slice(0, 8).map((s: any, i: number) => (
                                    <div key={s.service_name || i} className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{s.service_name}</p>
                                            <div className="w-full bg-white/5 rounded-full h-1 mt-1">
                                                <div
                                                    className="bg-amber-400 h-1 rounded-full"
                                                    style={{ width: `${Math.min(100, (s.total / (stats?.servicios?.[0]?.total || 1)) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-steel text-xs font-bold">{s.total}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Empleados */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
                        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-steel" /> Rendimiento por empleado
                        </h2>
                        {stats?.empleados?.length === 0 ? (
                            <p className="text-steel text-sm">Sin datos aún.</p>
                        ) : (
                            <div className="space-y-3">
                                {stats?.empleados?.map((e: any, i: number) => (
                                    <div key={e.id || i} className="bg-carbon/50 p-3 rounded-xl border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-white text-sm">{e.name}</p>
                                            <span className="text-amber-400 font-black text-lg">{e.total_cortes}</span>
                                        </div>
                                        <p className="text-steel text-xs">Top servicio: <span className="text-bone/70">{e.top_service}</span></p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── ANÁLISIS TEMPORAL ── */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-5 mb-6">
                    <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-steel" /> Análisis Temporal (Todos los tiempos)
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-carbon/50 p-4 rounded-xl border border-white/5 text-center">
                            <p className="text-steel text-xs font-bold uppercase tracking-wider mb-2">Hora Punta</p>
                            <p className="font-display font-black text-2xl text-amber-400">{stats?.horaPunta ?? '—'}</p>
                        </div>
                        <div className="bg-carbon/50 p-4 rounded-xl border border-white/5 text-center">
                            <p className="text-steel text-xs font-bold uppercase tracking-wider mb-2">Día Punta</p>
                            <p className="font-display font-black text-2xl text-amber-400">{stats?.diaPunta ?? '—'}</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modals */}
            <AnimatePresence>
                {showPenalizados && (
                    <PenalizadosModal
                        type={stats?.type}
                        onClose={() => setShowPenalizados(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {drillDown && (
                    <DrillDownModal
                        type={stats?.type}
                        period={drillDown.period}
                        filter={drillDown.filter}
                        status={drillDown.status}
                        title={drillDown.title}
                        onClose={() => setDrillDown(null)}
                    />
                )}
            </AnimatePresence>
        </PanelLayout>
    );
}
