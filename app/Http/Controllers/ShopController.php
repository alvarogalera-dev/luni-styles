<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\Product;
use App\Models\LocalMedia;
use App\Models\CatalogPhoto;

class ShopController extends Controller
{
    // ─────────────────────────────────────
    // SHOP PAGE (Services, Products, Local)
    // ─────────────────────────────────────

    public function index()
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);

        $services = Service::where('shop_type', $shopType)
            ->where('active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $products = Product::where('shop_type', $shopType)
            ->where('active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $catalogPhotos = [];
        if ($shopType === 'peluqueria_infantil') {
            $catalogPhotos = CatalogPhoto::where('shop_type', $shopType)
                ->where('active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get();
        }

        return Inertia::render('Panel/Shop', [
            'services'      => $services,
            'products'      => $products,
            'catalogPhotos' => $catalogPhotos,
            'shopType'      => $shopType,
            'user'          => ['name' => $user->name, 'role' => $user->role],
        ]);
    }

    public function local()
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);

        $localMedia = LocalMedia::where('shop_type', $shopType)
            ->where('active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return Inertia::render('Panel/Local', [
            'localMedia' => $localMedia,
            'shopType'   => $shopType,
            'user'       => ['name' => $user->name, 'role' => $user->role],
        ]);
    }

    // ─────────────────────────────────────
    // SERVICES CRUD
    // ─────────────────────────────────────

    public function storeService(Request $request)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);

        $validated = $request->validate([
            'name'             => 'required|string|max:150',
            'description'      => 'required|string|max:1000',
            'duration_label'   => 'required|string|max:50',
            'duration_minutes' => 'required|integer|min:5|max:480',
            'price'            => 'required|numeric|min:0',
            'promo_price'      => 'nullable|numeric|min:0',
            'photo'            => 'nullable|file|image|max:5120',
            'photo_url'        => 'nullable|string|max:500',
        ]);

        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $photoUrl = $this->uploadImage($request->file('photo'), 'service', $shopType);
        } elseif (!empty($validated['photo_url'])) {
            $photoUrl = $validated['photo_url'];
        }

        $maxOrder = Service::where('shop_type', $shopType)->max('sort_order') ?? 0;

        Service::create([
            'shop_type'        => $shopType,
            'name'             => strip_tags($validated['name']),
            'description'      => isset($validated['description']) ? strip_tags($validated['description']) : null,
            'duration_label'   => isset($validated['duration_label']) ? strip_tags($validated['duration_label']) : null,
            'duration_minutes' => (int) $validated['duration_minutes'],
            'price'            => isset($validated['price']) ? (float) $validated['price'] : null,
            'promo_price'      => isset($validated['promo_price']) ? (float) $validated['promo_price'] : null,
            'photo_url'        => $photoUrl,
            'sort_order'       => $maxOrder + 1,
            'active'           => true,
        ]);

        return back();
    }

    public function updateService(Request $request, $id)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);

        $service = Service::where('shop_type', $shopType)->findOrFail((int) $id);

        $validated = $request->validate([
            'name'             => 'required|string|max:150',
            'description'      => 'required|string|max:1000',
            'duration_label'   => 'required|string|max:50',
            'duration_minutes' => 'required|integer|min:5|max:480',
            'price'            => 'required|numeric|min:0',
            'promo_price'      => 'nullable|numeric|min:0',
            'photo'            => 'nullable|file|image|max:5120',
            'photo_url'        => 'nullable|max:500',
        ]);

        $photoUrl = $service->photo_url;
        if ($request->hasFile('photo')) {
            $photoUrl = $this->uploadImage($request->file('photo'), 'service', $shopType);
        } elseif (isset($validated['photo_url']) && !empty($validated['photo_url'])) {
            $photoUrl = $validated['photo_url'];
        }

        $updateData = [
            'name'             => strip_tags($validated['name']),
            'description'      => isset($validated['description']) ? strip_tags($validated['description']) : null,
            'duration_label'   => isset($validated['duration_label']) ? strip_tags($validated['duration_label']) : null,
            'duration_minutes' => (int) $validated['duration_minutes'],
            'photo_url'        => $photoUrl,
        ];

        // Solo actualizar precio en barberia (peluqueria no puede editar precio)
        if ($shopType !== 'peluqueria_infantil') {
            $updateData['price']       = isset($validated['price']) ? (float) $validated['price'] : null;
            $updateData['promo_price'] = isset($validated['promo_price']) ? (float) $validated['promo_price'] : null;
        }

        $service->update($updateData);
        return back();
    }

    public function destroyService($id)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);
        $service = Service::where('shop_type', $shopType)->findOrFail((int) $id);
        $service->delete();
        return back();
    }

    // ─────────────────────────────────────
    // PRODUCTS CRUD
    // ─────────────────────────────────────

    public function storeProduct(Request $request)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);

        $validated = $request->validate([
            'name'        => 'required|string|max:150',
            'tag'         => 'required|string|max:50',
            'description' => 'required|string|max:1000',
            'price'       => 'required|numeric|min:0',
            'photo'       => 'nullable|file|image|max:5120',
            'photo_url'   => 'nullable|string|max:500',
        ]);

        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $photoUrl = $this->uploadImage($request->file('photo'), 'product', $shopType);
        } elseif (!empty($validated['photo_url'])) {
            $photoUrl = $validated['photo_url'];
        }

        $maxOrder = Product::where('shop_type', $shopType)->max('sort_order') ?? 0;

        Product::create([
            'shop_type'   => $shopType,
            'name'        => strip_tags($validated['name']),
            'tag'         => isset($validated['tag']) ? strip_tags($validated['tag']) : null,
            'description' => isset($validated['description']) ? strip_tags($validated['description']) : null,
            'price'       => isset($validated['price']) ? (float) $validated['price'] : null,
            'photo_url'   => $photoUrl,
            'sort_order'  => $maxOrder + 1,
            'active'      => true,
        ]);

        return back();
    }

    public function updateProduct(Request $request, $id)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);

        $product = Product::where('shop_type', $shopType)->findOrFail((int) $id);

        $validated = $request->validate([
            'name'        => 'required|string|max:150',
            'tag'         => 'required|string|max:50',
            'description' => 'required|string|max:1000',
            'price'       => 'required|numeric|min:0',
            'photo'       => 'nullable|file|image|max:5120',
            'photo_url'   => 'nullable|string|max:500',
        ]);

        $photoUrl = $product->photo_url;
        if ($request->hasFile('photo')) {
            $photoUrl = $this->uploadImage($request->file('photo'), 'product', $shopType);
        } elseif (isset($validated['photo_url']) && !empty($validated['photo_url'])) {
            $photoUrl = $validated['photo_url'];
        }

        $product->update([
            'name'        => strip_tags($validated['name']),
            'tag'         => isset($validated['tag']) ? strip_tags($validated['tag']) : null,
            'description' => isset($validated['description']) ? strip_tags($validated['description']) : null,
            'price'       => isset($validated['price']) ? (float) $validated['price'] : null,
            'photo_url'   => $photoUrl,
        ]);

        return back();
    }

    public function destroyProduct($id)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);
        $product = Product::where('shop_type', $shopType)->findOrFail((int) $id);
        $product->delete();
        return back();
    }

    // ─────────────────────────────────────
    // LOCAL MEDIA CRUD
    // ─────────────────────────────────────

    public function storeLocalMedia(Request $request)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);

        $validated = $request->validate([
            'media_type' => 'required|in:photo,video',
            'media'      => 'nullable|file|max:51200|mimes:jpg,jpeg,png,webp,gif,mp4,mov,avi,webm',
            'url'        => 'nullable|url|max:500',
            'caption'    => 'required|string|max:255',
        ]);

        $url = null;
        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $isVideo = in_array($file->getMimeType(), ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm']);
            if ($isVideo) {
                $url = $this->uploadVideo($file, $shopType);
            } else {
                $url = $this->uploadImage($file, 'local', $shopType);
            }
        } elseif (!empty($validated['url'])) {
            $url = $validated['url'];
        }

        if (!$url) return back()->withErrors(['url' => 'Debes proporcionar una URL o subir un archivo.']);

        $maxOrder = LocalMedia::where('shop_type', $shopType)->max('sort_order') ?? 0;

        LocalMedia::create([
            'shop_type'  => $shopType,
            'media_type' => $validated['media_type'],
            'url'        => $url,
            'caption'    => isset($validated['caption']) ? strip_tags($validated['caption']) : null,
            'sort_order' => $maxOrder + 1,
            'active'     => true,
        ]);

        return back();
    }

    public function updateLocalMedia(Request $request, $id)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);
        $media = LocalMedia::where('shop_type', $shopType)->findOrFail((int) $id);

        $validated = $request->validate([
            'caption'    => 'required|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'media'      => 'nullable|file|max:51200|mimes:jpg,jpeg,png,webp,gif,mp4,mov,avi,webm',
            'url'        => 'nullable|max:500',
            'media_type' => 'nullable|in:photo,video',
        ]);

        $url = $media->url;
        $mediaType = $media->media_type;
        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $isVideo = in_array($file->getMimeType(), ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm']);
            $url = $isVideo ? $this->uploadVideo($file, $shopType) : $this->uploadImage($file, 'local', $shopType);
            $mediaType = $isVideo ? 'video' : 'photo';
        } elseif (isset($validated['url']) && !empty($validated['url'])) {
            $url = $validated['url'];
            if (isset($validated['media_type'])) {
                $mediaType = $validated['media_type'];
            }
        } else {
            if (isset($validated['media_type'])) {
                $mediaType = $validated['media_type'];
            }
        }

        $media->update([
            'url'        => $url,
            'media_type' => $mediaType,
            'caption'    => isset($validated['caption']) ? strip_tags($validated['caption']) : $media->caption,
            'sort_order' => isset($validated['sort_order']) ? (int)$validated['sort_order'] : $media->sort_order,
        ]);

        return back();
    }

    public function destroyLocalMedia($id)
    {
        $user = Auth::user();
        $shopType = $this->getShopType($user);
        $media = LocalMedia::where('shop_type', $shopType)->findOrFail((int) $id);
        $media->delete();
        return back();
    }

    // ─────────────────────────────────────
    // CATALOG PHOTOS CRUD (Peluquería)
    // ─────────────────────────────────────

    public function storeCatalogPhoto(Request $request)
    {
        $user = Auth::user();
        if ($user->role === 'barber') abort(403);
        $shopType = 'peluqueria_infantil';

        $validated = $request->validate([
            'photo'     => 'nullable|file|image|max:5120',
            'photo_url' => 'nullable|string|max:500',
            'caption'   => 'required|string|max:255',
        ]);

        $url = null;
        if ($request->hasFile('photo')) {
            $url = $this->uploadImage($request->file('photo'), 'catalog', $shopType);
        } elseif (!empty($validated['photo_url'])) {
            $url = $validated['photo_url'];
        }

        if (!$url) return back()->withErrors(['photo_url' => 'Debes proporcionar una URL o subir una foto.']);

        $maxOrder = CatalogPhoto::where('shop_type', $shopType)->max('sort_order') ?? 0;

        CatalogPhoto::create([
            'shop_type'  => $shopType,
            'url'        => $url,
            'caption'    => isset($validated['caption']) ? strip_tags($validated['caption']) : null,
            'sort_order' => $maxOrder + 1,
            'active'     => true,
        ]);

        return back();
    }

    public function updateCatalogPhoto(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role === 'barber') abort(403);

        $photo = CatalogPhoto::findOrFail((int) $id);

        $validated = $request->validate([
            'caption'    => 'required|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'photo'      => 'nullable|file|image|max:5120',
            'photo_url'  => 'nullable|max:500',
        ]);

        $url = $photo->url;
        if ($request->hasFile('photo')) {
            $url = $this->uploadImage($request->file('photo'), 'catalog', 'peluqueria_infantil');
        } elseif (isset($validated['photo_url']) && !empty($validated['photo_url'])) {
            $url = $validated['photo_url'];
        }

        $photo->update([
            'url'        => $url,
            'caption'    => isset($validated['caption']) ? strip_tags($validated['caption']) : $photo->caption,
            'sort_order' => isset($validated['sort_order']) ? (int)$validated['sort_order'] : $photo->sort_order,
        ]);

        return back();
    }

    public function destroyCatalogPhoto($id)
    {
        $user = Auth::user();
        if ($user->role === 'barber') abort(403);
        $photo = CatalogPhoto::findOrFail((int) $id);
        $photo->delete();
        return back();
    }

    // ─────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────

    private function getShopType($user): string
    {
        if ($user->role === 'barber') return 'barberia';
        if ($user->role === 'hairdresser') return 'peluqueria_infantil';
        return 'barberia'; // superadmin default
    }

    private function uploadImage($file, string $category, string $shopType): string
    {
        // Genera nombre único y profesional
        $shopSlug  = $shopType === 'barberia' ? 'barb' : 'pelu';
        $catSlug   = substr($category, 0, 4);
        $uid       = Str::random(12);
        $ext       = 'webp'; // siempre convertir a webp si es posible
        $filename  = "{$shopSlug}_{$catSlug}_{$uid}.{$ext}";

        // Intentar convertir a WebP con GD si está disponible
        $tmpPath = $file->getPathname();
        $mimeType = $file->getMimeType();

        if (function_exists('imagecreatefromjpeg') && function_exists('imagewebp')) {
            try {
                if ($mimeType === 'image/jpeg' || $mimeType === 'image/jpg') {
                    $img = imagecreatefromjpeg($tmpPath);
                } elseif ($mimeType === 'image/png') {
                    $img = imagecreatefrompng($tmpPath);
                } elseif ($mimeType === 'image/gif') {
                    $img = imagecreatefromgif($tmpPath);
                } elseif ($mimeType === 'image/webp') {
                    $img = imagecreatefromwebp($tmpPath);
                } else {
                    $img = null;
                }

                if ($img) {
                    // Redimensionar si es muy grande (max 1920x1080)
                    $origW = imagesx($img);
                    $origH = imagesy($img);
                    $maxW = 1920;
                    $maxH = 1920;
                    if ($origW > $maxW || $origH > $maxH) {
                        $ratio = min($maxW / $origW, $maxH / $origH);
                        $newW  = (int) round($origW * $ratio);
                        $newH  = (int) round($origH * $ratio);
                        $resized = imagecreatetruecolor($newW, $newH);
                        imagealphablending($resized, false);
                        imagesavealpha($resized, true);
                        imagecopyresampled($resized, $img, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
                        imagedestroy($img);
                        $img = $resized;
                    }

                    $webpTmp = tempnam(sys_get_temp_dir(), 'luni_') . '.webp';
                    imagewebp($img, $webpTmp, 82); // calidad 82%
                    imagedestroy($img);

                    $path = "uploads/{$shopType}/{$filename}";
                    Storage::disk('public')->put($path, file_get_contents($webpTmp));
                    unlink($webpTmp);
                    return Storage::disk('public')->url($path);
                }
            } catch (\Exception $e) {
                // Fallback a subida directa
            }
        }

        // Fallback: subir tal cual pero con nombre seguro
        $ext      = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = "{$shopSlug}_{$catSlug}_{$uid}.{$ext}";
        $path     = $file->storeAs("uploads/{$shopType}", $filename, 'public');
        return Storage::disk('public')->url($path);
    }

    private function uploadVideo($file, string $shopType): string
    {
        $shopSlug = $shopType === 'barberia' ? 'barb' : 'pelu';
        $uid      = Str::random(12);
        $ext      = $file->getClientOriginalExtension() ?: 'mp4';
        $filename = "{$shopSlug}_vid_{$uid}.{$ext}";
        $path     = $file->storeAs("uploads/{$shopType}/videos", $filename, 'public');
        return Storage::disk('public')->url($path);
    }
}
