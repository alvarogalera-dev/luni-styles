<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/la-barberia', [PageController::class, 'laBarberia'])->name('la-barberia');
Route::get('/peluqueria-infantil', [PageController::class, 'peluqueriaInfantil'])->name('peluqueria-infantil');
Route::get('/quienes-somos', [PageController::class, 'quienesSomos'])->name('quienes-somos');
Route::get('/contacto', [PageController::class, 'contacto'])->name('contacto');

// Legal Routes
Route::get('/aviso-legal', [PageController::class, 'avisoLegal'])->name('aviso-legal');
Route::get('/politica-privacidad', [PageController::class, 'politicaPrivacidad'])->name('politica-privacidad');
Route::get('/politica-cookies', [PageController::class, 'politicaCookies'])->name('politica-cookies');
Route::get('/terminos-reserva', [PageController::class, 'terminosReserva'])->name('terminos-reserva');

// API Routes (Using web middleware for CSRF protection in Inertia)
Route::post('/api/booking', [BookingController::class, 'store'])->name('api.booking.store');
Route::post('/api/check-loyalty', [BookingController::class, 'checkLoyalty'])->name('api.check-loyalty');
Route::post('/api/available-slots', [BookingController::class, 'getAvailableSlots'])->name('api.available-slots');
Route::post('/api/contact', [ContactController::class, 'send'])->name('api.contact.send');

// Panel Routes
use App\Http\Controllers\PanelController;

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
    Route::get('/panel/estadisticas/{type?}', [PanelController::class, 'statistics'])->name('panel.estadisticas');
});
