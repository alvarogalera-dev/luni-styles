import { ReactNode, useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Calendar, BarChart3, LogOut, Menu, X, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    children: ReactNode;
    title: string;
    user: {
        name: string;
        role: string;
    };
}

export default function PanelLayout({ children, title, user }: Props) {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.post('/panel/logout');
    };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isSidebarOpen]);

    const getRoleLabel = (role: string) => {
        if (role === 'superadmin') return 'MIXTO';
        if (role === 'barber') return 'BARBERÍA';
        if (role === 'hairdresser') return 'PELUQUERÍA INFANTIL';
        return 'PERSONAL';
    };

    const getRoleColor = (role: string) => {
        if (role === 'superadmin') return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
        if (role === 'barber') return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
        if (role === 'hairdresser') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
        return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    };

    const NavLinks = () => (
        <>
            <Link
                href="/panel/citas"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    url === '/panel/citas'
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-steel hover:text-white hover:bg-white/5'
                }`}
            >
                <Calendar className="w-5 h-5" />
                <span>Citas</span>
            </Link>
            
            {user.role === 'superadmin' ? (
                <>
                    <Link
                        href="/panel/estadisticas/barberia"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            url.includes('barberia')
                                ? 'bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20'
                                : 'text-steel hover:text-amber-400 hover:bg-amber-400/5'
                        }`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-sm">Estadísticas (Barbería)</span>
                    </Link>
                    <Link
                        href="/panel/estadisticas/peluqueria_infantil"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            url.includes('peluqueria_infantil')
                                ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20'
                                : 'text-steel hover:text-emerald-400 hover:bg-emerald-500/5'
                        }`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-sm">Estadísticas (Infantil)</span>
                    </Link>
                </>
            ) : (
                <Link
                    href="/panel/estadisticas"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        url.startsWith('/panel/estadisticas')
                            ? 'bg-white/10 text-white font-bold'
                            : 'text-steel hover:text-white hover:bg-white/5'
                    }`}
                >
                    <BarChart3 className="w-5 h-5" />
                    <span>Estadísticas</span>
                </Link>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-bone font-sans flex">
            <Head title={`${title} - Panel Luni Styles`} />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111] border-b border-white/5 z-40 flex items-center justify-between px-4">
                <span className="font-display font-black text-xl text-white tracking-tighter">LuniStyles<span className="text-amber-400">.</span></span>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-steel hover:text-white transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Close button mobile */}
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 text-steel hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6 h-16 lg:h-24 flex items-center border-b border-white/5 shrink-0">
                    <span className="font-display font-black text-2xl lg:text-3xl text-white tracking-tighter">LuniStyles<span className="text-amber-400">.</span></span>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <NavLinks />
                </nav>

                <div className="p-4 border-t border-white/5 shrink-0">
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-carbon flex items-center justify-center shrink-0 border border-white/10">
                                <UserIcon className="w-5 h-5 text-steel" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-white truncate">{user.name}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest border ${getRoleColor(user.role)}`}>
                                    {getRoleLabel(user.role)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold uppercase tracking-wider"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 w-full min-w-0 pt-16 lg:pt-0">
                <div className="h-full overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
