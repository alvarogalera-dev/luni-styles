import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PanelLayout from './Layout';
import { Plus, Trash2, MapPin, Video, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MediaCard({ media, onDelete }: any) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden group aspect-square"
        >
            {media.media_type === 'video' ? (
                <video src={media.url} className="w-full h-full object-cover" muted playsInline />
            ) : (
                <img src={media.url} alt={media.caption || ''} className="w-full h-full object-cover" loading="lazy" />
            )}
            {media.media_type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-2"><Video className="w-6 h-6 text-white" /></div>
                </div>
            )}
            {media.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-xs truncate">{media.caption}</p>
                </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => onDelete(media.id)}
                    className="p-2.5 rounded-xl bg-red-500 text-white hover:bg-red-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

export default function Local({ localMedia, user }: any) {
    const [mediaModal, setMediaModal] = useState(false);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaCaption, setMediaCaption] = useState('');
    const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setMediaFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setMediaPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const saveMedia = () => {
        if (!mediaFile) return;
        setIsSubmitting(true);
        const fd = new FormData();
        fd.append('file', mediaFile);
        fd.append('media_type', mediaType);
        fd.append('caption', mediaCaption);

        router.post('/panel/tienda/local', fd as any, {
            onSuccess: () => setMediaModal(false),
            onFinish: () => setIsSubmitting(false),
        });
    };

    const deleteMedia = (id: number) => {
        if (confirm('¿Eliminar este archivo?')) {
            router.delete(`/panel/tienda/local/${id}`);
        }
    };

    return (
        <PanelLayout title="Local" user={user}>
            <Head title="Local · Panel" />
            <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="font-display font-black text-2xl lg:text-3xl text-white">Nuestro Local</h1>
                    <p className="text-steel text-xs mt-1">Gestiona las fotos y vídeos del carrusel del local</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <p className="text-steel text-sm">{localMedia.length} archivo{localMedia.length !== 1 ? 's' : ''}</p>
                    <button onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaCaption(''); setMediaModal(true); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-void font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors">
                        <Plus className="w-4 h-4" /> Subir Archivo
                    </button>
                </div>

                {localMedia.length === 0 ? (
                    <div className="text-center py-20 text-steel">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">Sin fotos/vídeos del local</p>
                        <p className="text-xs mt-1">Sube fotos y videos que aparecerán en el carrusel del sitio web</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {localMedia.map((m: any) => (
                            <MediaCard key={m.id} media={m} onDelete={deleteMedia} />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {mediaModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMediaModal(false)} />
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-display font-black text-white text-lg">Subir Archivo</h3>
                                <button onClick={() => setMediaModal(false)} className="text-steel hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex bg-carbon border border-white/5 rounded-xl p-1">
                                    <button onClick={() => setMediaType('photo')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mediaType === 'photo' ? 'bg-amber-400 text-void' : 'text-steel hover:text-white'}`}>Foto</button>
                                    <button onClick={() => setMediaType('video')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mediaType === 'video' ? 'bg-amber-400 text-void' : 'text-steel hover:text-white'}`}>Vídeo</button>
                                </div>

                                {mediaPreview ? (
                                    <div className="relative">
                                        {mediaType === 'video' ? (
                                            <video src={mediaPreview} className="w-full h-40 object-cover rounded-xl border border-white/10" muted playsInline autoPlay loop />
                                        ) : (
                                            <img src={mediaPreview} className="w-full h-40 object-cover rounded-xl border border-white/10" />
                                        )}
                                        <button onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                                            className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:text-red-400">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center py-10 bg-carbon border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-amber-400 transition-colors">
                                        <Upload className="w-8 h-8 text-steel mb-2" />
                                        <span className="text-steel font-bold text-sm">Seleccionar {mediaType === 'photo' ? 'Imagen' : 'Vídeo'}</span>
                                        <input type="file" accept={mediaType === 'photo' ? 'image/*' : 'video/*'} className="hidden"
                                            onChange={handleFileChange} />
                                    </label>
                                )}

                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1 block">Pie de foto (opcional)</label>
                                    <input type="text" placeholder="Ej: Nueva fachada..." value={mediaCaption} onChange={e => setMediaCaption(e.target.value)}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400" />
                                </div>

                                <button disabled={isSubmitting || !mediaFile} onClick={saveMedia}
                                    className="w-full bg-amber-400 text-void font-bold py-3.5 rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50">
                                    {isSubmitting ? 'Guardando...' : 'Subir'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PanelLayout>
    );
}
