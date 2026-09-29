import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import PanelLayout from './Layout';
import { Plus, Edit2, Trash2, X, Save, Image, Upload, ShoppingBag, Scissors, MapPin, Camera, Video, Eye, EyeOff, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// ── ServiceCard ──────────────────────────────────────────────────────────────
function ServiceCard({ service, onEdit, onDelete, isBarber }: any) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col"
        >
            {service.photo_url ? (
                <img
                    src={service.photo_url}
                    alt={service.name}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-40 bg-carbon/50 flex items-center justify-center border-b border-white/5">
                    <Scissors className="w-8 h-8 text-steel/30" />
                </div>
            )}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white text-sm">{service.name}</h3>
                    {service.price != null && (
                        <div className="text-right shrink-0 ml-2">
                            {service.promo_price && service.promo_price !== service.price ? (
                                <>
                                    <span className="text-steel/50 line-through text-xs block">{service.price}€</span>
                                    <span className="text-amber-400 font-black text-base">{service.promo_price}€</span>
                                </>
                            ) : (
                                <span className="text-amber-400 font-black text-base">{service.price}€</span>
                            )}
                        </div>
                    )}
                </div>
                {service.description && (
                    <p className="text-steel text-xs mb-2 leading-relaxed line-clamp-2">{service.description}</p>
                )}
                <p className="text-steel text-xs mb-3">⏱ {service.duration_label || `${service.duration_minutes} min`}</p>
                <div className="flex gap-2 mt-auto">
                    <button onClick={() => onEdit(service)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-400/10 text-amber-400 text-xs font-bold hover:bg-amber-400 hover:text-void transition-all">
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button onClick={() => onDelete(service.id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product, onEdit, onDelete }: any) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col"
        >
            {product.photo_url ? (
                <img src={product.photo_url} alt={product.name} className="w-full h-40 object-cover" loading="lazy" />
            ) : (
                <div className="w-full h-40 bg-carbon/50 flex items-center justify-center border-b border-white/5">
                    <ShoppingBag className="w-8 h-8 text-steel/30" />
                </div>
            )}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white text-sm">{product.name}</h3>
                    {product.price != null && (
                        <span className="text-amber-400 font-black text-base ml-2 shrink-0">{product.price}€</span>
                    )}
                </div>
                {product.description && (
                    <p className="text-steel text-xs mb-3 leading-relaxed line-clamp-2">{product.description}</p>
                )}
                <div className="flex gap-2 mt-auto">
                    <button onClick={() => onEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-400/10 text-amber-400 text-xs font-bold hover:bg-amber-400 hover:text-void transition-all">
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button onClick={() => onDelete(product.id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ── MediaCard ────────────────────────────────────────────────────────────────
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

// ── FORM MODAL ────────────────────────────────────────────────────────────────
function FormModal({ title, fields, values, onChange, onSave, onClose, isSubmitting }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-[#111] border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
            >
                <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />
                <div className="sticky top-0 bg-[#111]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
                    <h3 className="font-display font-black text-white text-lg">{title}</h3>
                    <button onClick={onClose} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    {fields}
                    <button
                        disabled={isSubmitting}
                        onClick={onSave}
                        className="w-full bg-amber-400 text-void font-bold py-3.5 rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                        ) : (
                            <><Save className="w-4 h-4" /> Guardar</>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Shop({ services, products, localMedia, catalogPhotos, shopType, user }: any) {
    const [activeTab, setActiveTab] = useState<'services' | 'products' | 'local' | 'catalog'>('services');

    // Service form state
    const [serviceModal, setServiceModal] = useState<{ mode: 'create' | 'edit'; item?: any } | null>(null);
    const [serviceForm, setServiceForm] = useState<any>({});
    const [servicePhoto, setServicePhoto] = useState<File | null>(null);
    const [servicePhotoPreview, setServicePhotoPreview] = useState<string | null>(null);

    // Product form state
    const [productModal, setProductModal] = useState<{ mode: 'create' | 'edit'; item?: any } | null>(null);
    const [productForm, setProductForm] = useState<any>({});
    const [productPhoto, setProductPhoto] = useState<File | null>(null);
    const [productPhotoPreview, setProductPhotoPreview] = useState<string | null>(null);

    // Media state
    const [mediaModal, setMediaModal] = useState(false);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaCaption, setMediaCaption] = useState('');
    const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const isBarber = shopType === 'barberia';
    const isHairdresser = shopType === 'peluqueria_infantil';

    // ── Services ──────────────────────────────────────────────────────────────

    const openCreateService = () => {
        setServiceForm({ name: '', description: '', duration_minutes: 30, duration_label: '', price: '', promo_price: '' });
        setServicePhoto(null);
        setServicePhotoPreview(null);
        setServiceModal({ mode: 'create' });
    };

    const openEditService = (item: any) => {
        setServiceForm({
            name: item.name || '',
            description: item.description || '',
            duration_minutes: item.duration_minutes || 30,
            duration_label: item.duration_label || '',
            price: item.price?.toString() || '',
            promo_price: item.promo_price?.toString() || '',
        });
        setServicePhoto(null);
        setServicePhotoPreview(item.photo_url || null);
        setServiceModal({ mode: 'edit', item });
    };

    const saveService = () => {
        setIsSubmitting(true);
        const fd = new FormData();
        Object.entries(serviceForm).forEach(([k, v]) => { if (v !== '') fd.append(k, String(v)); });
        if (servicePhoto) fd.append('photo', servicePhoto);

        const url = serviceModal?.mode === 'edit'
            ? `/panel/tienda/servicios/${serviceModal.item.id}`
            : '/panel/tienda/servicios';

        router.post(url, fd as any, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => { setServiceModal(null); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false),
        });
    };

    const deleteService = (id: number) => {
        if (!confirm('¿Eliminar este servicio?')) return;
        router.delete(`/panel/tienda/servicios/${id}`, { preserveScroll: true });
    };

    // ── Products ──────────────────────────────────────────────────────────────

    const openCreateProduct = () => {
        setProductForm({ name: '', description: '', price: '' });
        setProductPhoto(null);
        setProductPhotoPreview(null);
        setProductModal({ mode: 'create' });
    };

    const openEditProduct = (item: any) => {
        setProductForm({
            name: item.name || '',
            description: item.description || '',
            price: item.price?.toString() || '',
        });
        setProductPhoto(null);
        setProductPhotoPreview(item.photo_url || null);
        setProductModal({ mode: 'edit', item });
    };

    const saveProduct = () => {
        setIsSubmitting(true);
        const fd = new FormData();
        Object.entries(productForm).forEach(([k, v]) => { if (v !== '') fd.append(k, String(v)); });
        if (productPhoto) fd.append('photo', productPhoto);

        const url = productModal?.mode === 'edit'
            ? `/panel/tienda/productos/${productModal.item.id}`
            : '/panel/tienda/productos';

        router.post(url, fd as any, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => { setProductModal(null); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false),
        });
    };

    const deleteProduct = (id: number) => {
        if (!confirm('¿Eliminar este producto?')) return;
        router.delete(`/panel/tienda/productos/${id}`, { preserveScroll: true });
    };

    // ── Local Media ───────────────────────────────────────────────────────────

    const saveMedia = () => {
        setIsSubmitting(true);
        const fd = new FormData();
        fd.append('media_type', mediaType);
        if (mediaCaption) fd.append('caption', mediaCaption);
        if (mediaFile) fd.append('media', mediaFile);

        router.post('/panel/tienda/local', fd as any, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setMediaModal(false);
                setMediaFile(null);
                setMediaPreview(null);
                setMediaCaption('');
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false),
        });
    };

    const deleteMedia = (id: number) => {
        if (!confirm('¿Eliminar este archivo?')) return;
        router.delete(`/panel/tienda/local/${id}`, { preserveScroll: true });
    };

    // ── Helper: File Input ────────────────────────────────────────────────────

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any, previewSetter: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setter(file);
        const reader = new FileReader();
        reader.onloadend = () => previewSetter(reader.result as string);
        reader.readAsDataURL(file);
    };

    const tabs = [
        { id: 'services', label: 'Servicios', icon: Scissors },
        { id: 'products', label: 'Productos', icon: ShoppingBag },
        { id: 'local', label: 'Local', icon: MapPin },
        ...(isHairdresser ? [{ id: 'catalog', label: 'Catálogo', icon: Camera }] : []),
    ];

    return (
        <PanelLayout title="Productos y Servicios" user={user}>
            <Head title="Tienda · Panel" />
            <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="font-display font-black text-2xl lg:text-3xl text-white">Productos y Servicios</h1>
                    <p className="text-steel text-xs mt-1">Gestiona el catálogo de tu local</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-[#0a0a0a] rounded-2xl mb-6 border border-white/5 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all',
                                activeTab === tab.id
                                    ? 'bg-amber-400 text-void shadow-lg shadow-amber-400/20'
                                    : 'text-steel hover:text-white hover:bg-white/5'
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── TAB: Servicios ── */}
                <AnimatePresence mode="wait">
                    {activeTab === 'services' && (
                        <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-steel text-sm">{services.length} servicio{services.length !== 1 ? 's' : ''}</p>
                                <button onClick={openCreateService}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-void font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors">
                                    <Plus className="w-4 h-4" /> Nuevo Servicio
                                </button>
                            </div>
                            {services.length === 0 ? (
                                <div className="text-center py-20 text-steel">
                                    <Scissors className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">Sin servicios aún</p>
                                    <p className="text-xs mt-1">Crea tu primer servicio con el botón de arriba</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {services.map((s: any) => (
                                        <ServiceCard key={s.id} service={s} onEdit={openEditService} onDelete={deleteService} isBarber={isBarber} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── TAB: Productos ── */}
                    {activeTab === 'products' && (
                        <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-steel text-sm">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
                                <button onClick={openCreateProduct}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-void font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors">
                                    <Plus className="w-4 h-4" /> Nuevo Producto
                                </button>
                            </div>
                            {products.length === 0 ? (
                                <div className="text-center py-20 text-steel">
                                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">Sin productos aún</p>
                                    <p className="text-xs mt-1">Añade productos de venta</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products.map((p: any) => (
                                        <ProductCard key={p.id} product={p} onEdit={openEditProduct} onDelete={deleteProduct} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── TAB: Local ── */}
                    {activeTab === 'local' && (
                        <motion.div key="local" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {localMedia.map((m: any) => (
                                        <MediaCard key={m.id} media={m} onDelete={deleteMedia} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── TAB: Catálogo (solo peluquería) ── */}
                    {activeTab === 'catalog' && isHairdresser && (
                        <motion.div key="catalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-steel text-sm">{catalogPhotos.length} foto{catalogPhotos.length !== 1 ? 's' : ''}</p>
                                <button onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaCaption(''); setMediaModal(true); }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-void font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors">
                                    <Plus className="w-4 h-4" /> Añadir Foto
                                </button>
                            </div>
                            {catalogPhotos.length === 0 ? (
                                <div className="text-center py-20 text-steel">
                                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">Sin fotos del catálogo</p>
                                    <p className="text-xs mt-1">Añade fotos de cortes para el catálogo de la web</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {catalogPhotos.map((p: any) => (
                                        <MediaCard key={p.id} media={{ ...p, media_type: 'photo' }} onDelete={(id: number) => {
                                            if (!confirm('¿Eliminar esta foto?')) return;
                                            router.delete(`/panel/tienda/catalogo/${id}`, { preserveScroll: true });
                                        }} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* ── MODAL: SERVICIO ── */}
            <AnimatePresence>
                {serviceModal && (
                    <FormModal
                        title={serviceModal.mode === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'}
                        onClose={() => setServiceModal(null)}
                        onSave={saveService}
                        isSubmitting={isSubmitting}
                        fields={
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Nombre *</label>
                                    <input type="text" value={serviceForm.name} onChange={e => setServiceForm((p: any) => ({...p, name: e.target.value}))}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Descripción</label>
                                    <textarea value={serviceForm.description} onChange={e => setServiceForm((p: any) => ({...p, description: e.target.value}))}
                                        rows={3}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all resize-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Duración (min) *</label>
                                        <input type="number" min={5} max={480} value={serviceForm.duration_minutes}
                                            onChange={e => setServiceForm((p: any) => ({...p, duration_minutes: e.target.value}))}
                                            className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Etiqueta duración</label>
                                        <input type="text" placeholder="ej: 30-45 min" value={serviceForm.duration_label}
                                            onChange={e => setServiceForm((p: any) => ({...p, duration_label: e.target.value}))}
                                            className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                    </div>
                                </div>
                                {isBarber && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Precio normal (€)</label>
                                            <input type="number" min={0} step={0.5} value={serviceForm.price}
                                                onChange={e => setServiceForm((p: any) => ({...p, price: e.target.value}))}
                                                className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Precio promo (€)</label>
                                            <input type="number" min={0} step={0.5} value={serviceForm.promo_price}
                                                onChange={e => setServiceForm((p: any) => ({...p, promo_price: e.target.value}))}
                                                className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Foto</label>
                                    {servicePhotoPreview && (
                                        <div className="mb-3 relative">
                                            <img src={servicePhotoPreview} alt="preview" className="w-full h-40 object-cover rounded-xl border border-white/10" />
                                            <button onClick={() => { setServicePhoto(null); setServicePhotoPreview(null); }}
                                                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:text-red-400">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex items-center gap-3 p-3 bg-carbon border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-amber-400 transition-colors">
                                        <Upload className="w-4 h-4 text-steel" />
                                        <span className="text-steel text-sm">{servicePhoto ? servicePhoto.name : 'Elegir imagen...'}</span>
                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={e => handleFileChange(e, setServicePhoto, setServicePhotoPreview)} />
                                    </label>
                                </div>
                            </div>
                        }
                    />
                )}
            </AnimatePresence>

            {/* ── MODAL: PRODUCTO ── */}
            <AnimatePresence>
                {productModal && (
                    <FormModal
                        title={productModal.mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
                        onClose={() => setProductModal(null)}
                        onSave={saveProduct}
                        isSubmitting={isSubmitting}
                        fields={
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Nombre *</label>
                                    <input type="text" value={productForm.name} onChange={e => setProductForm((p: any) => ({...p, name: e.target.value}))}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Descripción</label>
                                    <textarea value={productForm.description} onChange={e => setProductForm((p: any) => ({...p, description: e.target.value}))}
                                        rows={3}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all resize-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Precio (€)</label>
                                    <input type="number" min={0} step={0.5} value={productForm.price}
                                        onChange={e => setProductForm((p: any) => ({...p, price: e.target.value}))}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Foto</label>
                                    {productPhotoPreview && (
                                        <div className="mb-3 relative">
                                            <img src={productPhotoPreview} alt="preview" className="w-full h-40 object-cover rounded-xl border border-white/10" />
                                            <button onClick={() => { setProductPhoto(null); setProductPhotoPreview(null); }}
                                                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:text-red-400">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex items-center gap-3 p-3 bg-carbon border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-amber-400 transition-colors">
                                        <Upload className="w-4 h-4 text-steel" />
                                        <span className="text-steel text-sm">{productPhoto ? productPhoto.name : 'Elegir imagen...'}</span>
                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={e => handleFileChange(e, setProductPhoto, setProductPhotoPreview)} />
                                    </label>
                                </div>
                            </div>
                        }
                    />
                )}
            </AnimatePresence>

            {/* ── MODAL: LOCAL MEDIA ── */}
            <AnimatePresence>
                {mediaModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMediaModal(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-[#111] border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
                        >
                            <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />
                            <div className="sticky top-0 bg-[#111]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
                                <h3 className="font-display font-black text-white text-lg">Subir al Local</h3>
                                <button onClick={() => setMediaModal(false)} className="p-2 text-steel hover:text-white bg-carbon rounded-full border border-white/5 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                {/* Tipo */}
                                <div className="grid grid-cols-2 gap-2">
                                    {(['photo', 'video'] as const).map(t => (
                                        <button key={t} type="button" onClick={() => setMediaType(t)}
                                            className={cn('flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all',
                                                mediaType === t ? 'bg-amber-400 text-void border-amber-400' : 'bg-carbon text-steel border-white/10 hover:border-white/30')}>
                                            {t === 'photo' ? <Camera className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                            {t === 'photo' ? 'Foto' : 'Vídeo'}
                                        </button>
                                    ))}
                                </div>
                                {/* Preview */}
                                {mediaPreview && (
                                    <div className="relative">
                                        {mediaType === 'video' ? (
                                            <video src={mediaPreview} className="w-full h-48 object-cover rounded-xl border border-white/10" muted />
                                        ) : (
                                            <img src={mediaPreview} alt="preview" className="w-full h-48 object-cover rounded-xl border border-white/10" />
                                        )}
                                        <button onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:text-red-400 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {/* File input */}
                                <label className="flex items-center gap-3 p-4 bg-carbon border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-amber-400 transition-colors">
                                    <Upload className="w-5 h-5 text-steel" />
                                    <div>
                                        <p className="text-white text-sm font-bold">{mediaFile ? mediaFile.name : 'Seleccionar archivo'}</p>
                                        <p className="text-steel text-xs">{mediaType === 'video' ? 'MP4, MOV, AVI (max 50MB)' : 'JPG, PNG, WebP (max 5MB)'}</p>
                                    </div>
                                    <input type="file"
                                        accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                                        className="hidden"
                                        onChange={e => handleFileChange(e, setMediaFile, setMediaPreview)} />
                                </label>
                                {/* Caption */}
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Descripción (opcional)</label>
                                    <input type="text" value={mediaCaption} onChange={e => setMediaCaption(e.target.value)} placeholder="ej: Ambiente del local..."
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                                <button disabled={!mediaFile || isSubmitting} onClick={saveMedia}
                                    className="w-full bg-amber-400 text-void font-bold py-3.5 rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" /> : <><Upload className="w-4 h-4" /> Subir</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PanelLayout>
    );
}
