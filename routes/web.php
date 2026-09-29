<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;

$locales = ['es', 'en', 'ru', 'cn'];
foreach ($locales as $locale) {
    $prefix = $locale === 'es' ? '' : $locale;
    Route::group(['prefix' => $prefix], function () use ($locale) {
        Route::get('/', [PageController::class, 'home'])->name($locale.'.home');
        Route::get('/la-barberia', [PageController::class, 'laBarberia'])->name($locale.'.la-barberia');
        Route::get('/peluqueria-infantil', [PageController::class, 'peluqueriaInfantil'])->name($locale.'.peluqueria-infantil');
        Route::get('/quienes-somos', [PageController::class, 'quienesSomos'])->name($locale.'.quienes-somos');
        Route::get('/contacto', [PageController::class, 'contacto'])->name($locale.'.contacto');

        // Legal Routes
        Route::get('/aviso-legal', [PageController::class, 'avisoLegal'])->name($locale.'.aviso-legal');
        Route::get('/politica-privacidad', [PageController::class, 'politicaPrivacidad'])->name($locale.'.politica-privacidad');
        Route::get('/politica-cookies', [PageController::class, 'politicaCookies'])->name($locale.'.politica-cookies');
        Route::get('/terminos-reserva', [PageController::class, 'terminosReserva'])->name($locale.'.terminos-reserva');
    });
}

// API Routes (Using web middleware for CSRF protection in Inertia)
Route::post('/api/booking', [BookingController::class, 'store'])->name('api.booking.store');
Route::post('/api/check-loyalty', [BookingController::class, 'checkLoyalty'])->name('api.check-loyalty');
Route::post('/api/available-slots', [BookingController::class, 'getAvailableSlots'])->name('api.available-slots');
// API para disponibilidad de barberos por hora (tiempo real en BookingModal)
Route::post('/api/barbers-availability', [BookingController::class, 'getBarbersAvailability'])->name('api.barbers-availability');
Route::post('/api/contact', [ContactController::class, 'send'])->name('api.contact.send');

// Webhook para despliegues
use App\Http\Controllers\WebhookController;
Route::post('/api/webhook/github', [WebhookController::class, 'deploy']);

// Panel Routes
use App\Http\Controllers\PanelController;
use App\Http\Controllers\ShopController;

Route::get('/panel', function () {
    return redirect('/panel/login');
});

Route::get('/panel/login', [PanelController::class, 'showLogin'])->name('login');
Route::post('/panel/login', [PanelController::class, 'login']);

Route::middleware('auth')->group(function () {
    Route::post('/panel/logout', [PanelController::class, 'logout'])->name('logout');
    Route::get('/panel/citas', [PanelController::class, 'dashboard'])->name('panel.citas');
    Route::put('/panel/citas/{id}/status', [PanelController::class, 'updateStatus']);
    Route::put('/panel/citas/{id}', [PanelController::class, 'updateAppointment']);
    Route::delete('/panel/citas/{id}', [PanelController::class, 'deleteAppointment']);
    Route::post('/panel/citas', [PanelController::class, 'createAppointment'])->name('panel.citas.create');
    Route::get('/panel/estadisticas/{type?}', [PanelController::class, 'statistics'])->name('panel.estadisticas');

    // API estadísticas drill-down
    Route::get('/panel/api/stats/drill', [PanelController::class, 'statsDrillDown'])->name('panel.stats.drill');
    Route::get('/panel/api/stats/penalizados', [PanelController::class, 'statsPenalizados'])->name('panel.stats.penalizados');

    // Shop (Servicios, Productos, Local, Catálogo)
    Route::get('/panel/tienda', [ShopController::class, 'index'])->name('panel.tienda');

    // Services
    Route::post('/panel/tienda/servicios', [ShopController::class, 'storeService'])->name('panel.tienda.servicios.store');
    Route::post('/panel/tienda/servicios/{id}', [ShopController::class, 'updateService'])->name('panel.tienda.servicios.update');
    Route::delete('/panel/tienda/servicios/{id}', [ShopController::class, 'destroyService'])->name('panel.tienda.servicios.destroy');

    // Products
    Route::post('/panel/tienda/productos', [ShopController::class, 'storeProduct'])->name('panel.tienda.productos.store');
    Route::post('/panel/tienda/productos/{id}', [ShopController::class, 'updateProduct'])->name('panel.tienda.productos.update');
    Route::delete('/panel/tienda/productos/{id}', [ShopController::class, 'destroyProduct'])->name('panel.tienda.productos.destroy');

    // Local Media
    Route::post('/panel/tienda/local', [ShopController::class, 'storeLocalMedia'])->name('panel.tienda.local.store');
    Route::post('/panel/tienda/local/{id}', [ShopController::class, 'updateLocalMedia'])->name('panel.tienda.local.update');
    Route::delete('/panel/tienda/local/{id}', [ShopController::class, 'destroyLocalMedia'])->name('panel.tienda.local.destroy');

    // Catalog Photos (Peluquería)
    Route::post('/panel/tienda/catalogo', [ShopController::class, 'storeCatalogPhoto'])->name('panel.tienda.catalogo.store');
    Route::post('/panel/tienda/catalogo/{id}', [ShopController::class, 'updateCatalogPhoto'])->name('panel.tienda.catalogo.update');
    Route::delete('/panel/tienda/catalogo/{id}', [ShopController::class, 'destroyCatalogPhoto'])->name('panel.tienda.catalogo.destroy');
});
