<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;

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
