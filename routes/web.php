<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/la-barberia', [PageController::class, 'laBarberia'])->name('la-barberia');
Route::get('/servicios', [PageController::class, 'servicios'])->name('servicios');
Route::get('/corte-infantil', [PageController::class, 'corteInfantil'])->name('corte-infantil');
Route::get('/contacto', [PageController::class, 'contacto'])->name('contacto');
Route::get('/reservas', [PageController::class, 'reservas'])->name('reservas');
