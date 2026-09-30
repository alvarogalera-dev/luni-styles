import { useState, useRef, useEffect } from 'react';
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
                    src={service.photo_url.startsWith('http') || service.photo_url.startsWith('/') ? service.photo_url : `/storage/${service.photo_url}`}
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
                    {service.price != null && isBarber && (
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
                <img src={product.photo_url.startsWith('http') || product.photo_url.startsWith('/') ? product.photo_url : `/storage/${product.photo_url}`} alt={product.name} className="w-full h-40 object-cover" loading="lazy" />
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
export default function Shop({ services, products, catalogPhotos, shopType, user }: any) {
    const [activeTab, setActiveTab] = useState<'services' | 'products' | 'catalog'>('services');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (['services', 'products', 'catalog'].includes(hash)) {
                setActiveTab(hash as any);
            } else {
                setActiveTab('services');
            }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

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

    // Catalog state
    const [catalogModal, setCatalogModal] = useState<{ mode: 'create' | 'edit'; item?: any } | null>(null);
    const [catalogCaption, setCatalogCaption] = useState('');
    const [catalogFile, setCatalogFile] = useState<File | null>(null);
    const [catalogPhotoUrl, setCatalogPhotoUrl] = useState('');
    const [catalogPreview, setCatalogPreview] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const isBarber = shopType === 'barberia';
    const isHairdresser = shopType === 'peluqueria_infantil';

    // ── Services ──────────────────────────────────────────────────────────────

    const openCreateService = () => {
        setServiceForm({ 
            name: '', description: '', duration_minutes: 30, duration_label: '', 
            price: '', promo_price: '', photo_url: '', 
            etiqueta: isHairdresser ? 'CONSULTAR PRECIO POR TELÉFONO' : '' 
        });
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
            photo_url: item.photo_url || '',
            etiqueta: item.etiqueta || '',
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
        setProductForm({ name: '', tag: '', description: '', price: '', photo_url: '' });
        setProductPhoto(null);
        setProductPhotoPreview(null);
        setProductModal({ mode: 'create' });
    };

    const openEditProduct = (item: any) => {
        setProductForm({
            name: item.name || '',
            tag: item.tag || '',
            description: item.description || '',
            price: item.price?.toString() || '',
            photo_url: item.photo_url || '',
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

    // ── Catalog ──────────────────────────────────────────────────────────────
    const openCreateCatalog = () => {
        setCatalogCaption('');
        setCatalogFile(null);
        setCatalogPhotoUrl('');
        setCatalogPreview(null);
        setCatalogModal({ mode: 'create' });
    };

    const openEditCatalog = (item: any) => {
        setCatalogCaption(item.caption || '');
        setCatalogFile(null);
        setCatalogPhotoUrl(item.url || '');
        setCatalogPreview(item.url);
        setCatalogModal({ mode: 'edit', item });
    };

    const saveCatalog = () => {
        if (!catalogCaption.trim()) return alert('El pie de foto es obligatorio para el catálogo.');
        setIsSubmitting(true);
        const fd = new FormData();
        fd.append('caption', catalogCaption);
        if (catalogPhotoUrl) fd.append('photo_url', catalogPhotoUrl);
        if (catalogFile) fd.append('photo', catalogFile);

        const url = catalogModal?.mode === 'edit' ? `/panel/tienda/catalogo/${catalogModal.item.id}` : '/panel/tienda/catalogo';
        router.post(url, fd as any, {
            onSuccess: () => setCatalogModal(null),
            onFinish: () => setIsSubmitting(false),
        });
    };

    const deleteCatalog = (id: number) => {
        if (confirm('¿Eliminar foto del catálogo?')) router.delete(`/panel/tienda/catalogo/${id}`);
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
        ...(isBarber ? [{ id: 'products', label: 'Productos', icon: ShoppingBag }] : []),
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

                    {/* ── TAB: Catálogo (solo peluquería) ── */}
                    {activeTab === 'catalog' && isHairdresser && (
                        <motion.div key="catalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-steel text-sm">{catalogPhotos.length} foto{catalogPhotos.length !== 1 ? 's' : ''}</p>
                                <button onClick={openCreateCatalog}
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {catalogPhotos.map((c: any) => {
                                        const cUrl = c.url.startsWith('http') || c.url.startsWith('/') ? c.url : (c.url.startsWith('images/') ? `/${c.url}` : (c.url.startsWith('catalogo/') ? `/images/${c.url}` : `/storage/${c.url}`));
                                        return (
                                        <div key={c.id} className="relative group rounded-xl overflow-hidden aspect-[3/4] border border-white/10 bg-carbon">
                                            <img src={cUrl} alt="catalog" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button onClick={() => openEditCatalog(c)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-amber-400 hover:text-void transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteCatalog(c.id)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )})}
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
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Descripción *</label>
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
                                        <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Etiqueta duración *</label>
                                        <input type="text" placeholder="ej: 30-45 min" value={serviceForm.duration_label}
                                            onChange={e => setServiceForm((p: any) => ({...p, duration_label: e.target.value}))}
                                            className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                    </div>
                                </div>
                                {isBarber && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Precio normal (€) *</label>
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
                                {isHairdresser && (
                                    <div>
                                        <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Etiqueta (precio)</label>
                                        <input type="text" placeholder="CONSULTAR PRECIO POR TELÉFONO" value={serviceForm.etiqueta}
                                            onChange={e => setServiceForm((p: any) => ({...p, etiqueta: e.target.value}))}
                                            className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Foto * (Archivo o URL)</label>
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
                                    <div className="mt-2 text-center text-steel text-xs uppercase font-bold">O</div>
                                    <input type="text" placeholder="https://ejemplo.com/foto.jpg" value={serviceForm.photo_url}
                                        onChange={e => {
                                            setServiceForm((p: any) => ({...p, photo_url: e.target.value}));
                                            if (e.target.value) setServicePhotoPreview(e.target.value);
                                        }}
                                        className="w-full mt-2 bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
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
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Etiqueta *</label>
                                    <input type="text" placeholder="ej: Cera mate" value={productForm.tag} onChange={e => setProductForm((p: any) => ({...p, tag: e.target.value}))}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Descripción *</label>
                                    <textarea value={productForm.description} onChange={e => setProductForm((p: any) => ({...p, description: e.target.value}))}
                                        rows={3}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all resize-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Precio (€) *</label>
                                    <input type="number" min={0} step={0.5} value={productForm.price}
                                        onChange={e => setProductForm((p: any) => ({...p, price: e.target.value}))}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Foto * (Archivo o URL)</label>
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
                                    <div className="mt-2 text-center text-steel text-xs uppercase font-bold">O</div>
                                    <input type="text" placeholder="https://ejemplo.com/foto.jpg" value={productForm.photo_url}
                                        onChange={e => {
                                            setProductForm((p: any) => ({...p, photo_url: e.target.value}));
                                            if (e.target.value) setProductPhotoPreview(e.target.value);
                                        }}
                                        className="w-full mt-2 bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                            </div>
                        }
                    />
                )}
            </AnimatePresence>


            {/* ── MODAL: CATÁLOGO ── */}
            <AnimatePresence>
                {catalogModal && (
                    <FormModal
                        title={catalogModal.mode === 'create' ? 'Añadir al Catálogo' : 'Editar Foto'}
                        onClose={() => setCatalogModal(null)}
                        onSave={saveCatalog}
                        isSubmitting={isSubmitting}
                        fields={
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Pie de foto *</label>
                                    <input type="text" value={catalogCaption} onChange={e => setCatalogCaption(e.target.value)}
                                        className="w-full bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs text-steel font-bold uppercase tracking-wider mb-1.5 block">Foto * (Archivo o URL)</label>
                                    {catalogPreview && (
                                        <div className="mb-3 relative aspect-[3/4] max-w-[200px] mx-auto rounded-xl overflow-hidden border border-white/10">
                                            <img src={catalogPreview.startsWith('http') || catalogPreview.startsWith('/') ? catalogPreview : (catalogPreview.startsWith('images/') ? `/${catalogPreview}` : (catalogPreview.startsWith('catalogo/') ? `/images/${catalogPreview}` : `/storage/${catalogPreview}`))} alt="preview" className="w-full h-full object-cover" />
                                            <button onClick={() => { setCatalogFile(null); setCatalogPhotoUrl(''); setCatalogPreview(null); }}
                                                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:text-red-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex items-center justify-center gap-3 p-6 bg-carbon border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-amber-400 transition-colors">
                                        <Upload className="w-5 h-5 text-steel" />
                                        <span className="text-steel text-sm">{catalogFile ? catalogFile.name : 'Seleccionar foto...'}</span>
                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={e => handleFileChange(e, setCatalogFile, setCatalogPreview)} />
                                    </label>
                                    <div className="mt-2 text-center text-steel text-xs uppercase font-bold">O</div>
                                    <input type="text" placeholder="https://ejemplo.com/foto.jpg o /images/catalogo/1.jpg" value={catalogPhotoUrl}
                                        onChange={e => {
                                            setCatalogPhotoUrl(e.target.value);
                                            if (e.target.value) setCatalogPreview(e.target.value);
                                        }}
                                        className="w-full mt-2 bg-carbon border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-all" />
                                </div>
                            </div>
                        }
                    />
                )}
            </AnimatePresence>
        </PanelLayout>
    );
}
