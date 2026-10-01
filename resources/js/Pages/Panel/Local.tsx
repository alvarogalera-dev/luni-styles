import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PanelLayout from './Layout';
import { Plus, Trash2, MapPin, Video, X, Upload, Edit2, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MediaCard({ media, onDelete, onEdit }: any) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden group aspect-square"
        >
            {media.media_type === 'video' ? (
                <video src={media.url.startsWith('http') || media.url.startsWith('/') ? media.url : `/storage/${media.url}`} className="w-full h-full object-cover" muted playsInline />
            ) : (
                <img src={media.url.startsWith('http') || media.url.startsWith('/') ? media.url : `/storage/${media.url}`} alt={media.caption || ''} className="w-full h-full object-cover" loading="lazy" />
            )}
            {media.media_type === 'video' && (
                <>
                    <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 z-10">
                        <Video className="w-3 h-3 text-white" />
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">Vídeo</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 border border-white/20"><Video className="w-8 h-8 text-white" /></div>
                    </div>
                </>
            )}
            {media.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 border-t border-white/10 z-10">
                    <p className="text-slate-900 text-xs font-bold truncate text-center">{media.caption}</p>
                </div>
            )}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
                <button onClick={() => onEdit(media)} className="p-2 rounded-lg bg-blue-500/90 text-white shadow-lg backdrop-blur-sm hover:bg-blue-400 transition-all">
                    <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(media.id)} className="p-2 rounded-lg bg-red-500/90 text-white shadow-lg backdrop-blur-sm hover:bg-red-400 transition-all">
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
    const [mediaUrl, setMediaUrl] = useState('');
    const [inputMode, setInputMode] = useState<'file' | 'url'>('file');
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editMediaId, setEditMediaId] = useState<number | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [saveConfirm, setSaveConfirm] = useState(false);

    const openNew = () => {
        setEditMediaId(null);
        setMediaFile(null);
        setMediaPreview(null);
        setMediaCaption('');
        setMediaUrl('');
        setInputMode('file');
        setMediaModal(true);
    };

    const openEdit = (media: any) => {
        setEditMediaId(media.id);
        setMediaType(media.media_type);
        setMediaCaption(media.caption || '');
        setMediaUrl(media.url || '');
        setInputMode('url');
        setMediaFile(null);
        setMediaPreview(media.url.startsWith('http') || media.url.startsWith('/') ? media.url : `/storage/${media.url}`);
        setMediaModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setMediaFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setMediaPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const saveMedia = () => {
        if (!mediaCaption.trim()) return alert('El pie de foto es obligatorio');
        if (inputMode === 'file' && !mediaFile && !editMediaId) return alert('Sube un archivo o pega una URL');
        if (inputMode === 'url' && !mediaUrl) return alert('Sube un archivo o pega una URL');

        setIsSubmitting(true);
        const fd = new FormData();
        if (inputMode === 'file' && mediaFile) {
            fd.append('media', mediaFile);
        } else if (inputMode === 'url' && mediaUrl) {
            fd.append('url', mediaUrl);
        }
        fd.append('media_type', mediaType);
        fd.append('caption', mediaCaption);
        if (editMediaId) fd.append('id', editMediaId.toString());

        const query = shopType ? `?shop=${shopType}` : '';
        const targetUrl = editMediaId ? `/panel/tienda/local/${editMediaId}${query}` : `/panel/tienda/local${query}`;

        router.post(targetUrl, fd as any, {
            onSuccess: () => setMediaModal(false),
            onFinish: () => setIsSubmitting(false),
        });
    };

    const deleteMedia = () => {
        if (deleteConfirmId) {
            const query = shopType ? `?shop=${shopType}` : '';
            router.delete(`/panel/tienda/local/${deleteConfirmId}${query}`, {
                onSuccess: () => setDeleteConfirmId(null)
            });
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
                    <p className="text-steel text-sm">
                        {(() => {
                            const pCount = localMedia.filter((m: any) => m.media_type === 'photo' || !m.media_type).length;
                            const vCount = localMedia.filter((m: any) => m.media_type === 'video').length;
                            const parts = [];
                            if (pCount > 0) parts.push(`${pCount} foto${pCount !== 1 ? 's' : ''}`);
                            if (vCount > 0) parts.push(`${vCount} vídeo${vCount !== 1 ? 's' : ''}`);
                            return parts.length > 0 ? parts.join(' y ') : '0 archivos';
                        })()}
                    </p>
                    <button onClick={openNew}
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
                            <MediaCard key={m.id} media={m} onDelete={setDeleteConfirmId} onEdit={openEdit} />
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
                                <h3 className="font-display font-black text-white text-lg">{editMediaId ? 'Editar Archivo' : 'Subir Archivo'}</h3>
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

                                <div className="flex bg-carbon border border-white/5 rounded-xl p-1 mb-4">
                                    <button onClick={() => setInputMode('file')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${inputMode === 'file' ? 'bg-white/10 text-white' : 'text-steel hover:text-white'}`}>Subir Archivo</button>
                                    <button onClick={() => setInputMode('url')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${inputMode === 'url' ? 'bg-white/10 text-white' : 'text-steel hover:text-white'}`}>Pegar URL</button>
                                </div>

                                {inputMode === 'url' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1 block flex items-center gap-1"><LinkIcon className="w-3 h-3"/> URL del {mediaType}</label>
                                            <input type="text" placeholder="https://..." value={mediaUrl} onChange={e => { setMediaUrl(e.target.value); setMediaPreview(e.target.value); }}
                                                className="w-full bg-carbon border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400" />
                                        </div>
                                        {mediaPreview && (
                                            <div className="relative">
                                                {mediaType === 'video' ? (
                                                    <video src={mediaPreview} className="w-full h-40 object-cover rounded-xl border border-white/10" muted playsInline autoPlay loop />
                                                ) : (
                                                    <img src={mediaPreview} className="w-full h-40 object-cover rounded-xl border border-white/10" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    mediaPreview ? (
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
                                    )
                                )}

                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1 block">Pie de foto (Obligatorio)</label>
                                    <input type="text" placeholder="Ej: Nueva fachada..." value={mediaCaption} onChange={e => setMediaCaption(e.target.value)}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400" />
                                </div>

                                <button disabled={isSubmitting || (!mediaFile && !mediaUrl && !editMediaId) || !mediaCaption.trim() || (inputMode === 'file' && !mediaPreview)} onClick={() => setSaveConfirm(true)}
                                    className="w-full bg-amber-400 text-void font-bold py-3.5 rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50">
                                    {isSubmitting ? 'Guardando...' : (editMediaId ? 'Actualizar' : 'Subir')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Confirmar Borrado */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl text-center">
                            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar archivo?</h3>
                            <p className="text-steel text-sm mb-6">Esta acción no se puede deshacer.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 bg-carbon text-white rounded-xl font-bold hover:bg-white/10 transition-colors">Cancelar</button>
                                <button onClick={deleteMedia} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-400 transition-colors">Eliminar</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Confirmar Guardado */}
            <AnimatePresence>
                {saveConfirm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSaveConfirm(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl text-center">
                            <Upload className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">¿Confirmar cambios?</h3>
                            <p className="text-steel text-sm mb-6">Se {editMediaId ? 'actualizará' : 'subirá'} el archivo en el carrusel del local.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setSaveConfirm(false)} className="flex-1 py-3 bg-carbon text-white rounded-xl font-bold hover:bg-white/10 transition-colors">Revisar</button>
                                <button onClick={() => { setSaveConfirm(false); saveMedia(); }} className="flex-1 py-3 bg-amber-400 text-void rounded-xl font-bold hover:bg-amber-300 transition-colors">Confirmar</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PanelLayout>
    );
}
