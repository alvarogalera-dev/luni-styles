<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'meta' => [
                'title'       => 'Luni Styles — Barbershop de Precisión',
                'description' => 'Experiencia de barbería premium en el corazón de la ciudad. Cortes, arreglos de barba y tratamientos capilares de alta gama.',
            ],
        ]);
    }

    public function laBarberia(): Response
    {
        return Inertia::render('LaBarberia', [
            'meta' => [
                'title'       => 'La Barbería — Luni Styles',
                'description' => 'Conoce nuestro equipo de maestros barberos y la historia de Luni Styles.',
            ],
        ]);
    }

    public function servicios(): Response
    {
        return Inertia::render('Servicios', [
            'meta' => [
                'title'       => 'Servicios — Luni Styles',
                'description' => 'Descubre todos nuestros servicios de barbería premium: cortes, barba, tratamientos y más.',
            ],
        ]);
    }

    public function corteInfantil(): Response
    {
        return Inertia::render('CorteInfantil', [
            'meta' => [
                'title'       => 'Corte Infantil — Luni Styles',
                'description' => 'Cortes de cabello para los más pequeños en un ambiente cómodo y divertido.',
            ],
        ]);
    }

    public function contacto(): Response
    {
        return Inertia::render('Contacto', [
            'meta' => [
                'title'       => 'Contacto — Luni Styles',
                'description' => 'Visítanos, llámanos o escríbenos. Estamos aquí para atenderte.',
            ],
        ]);
    }

    public function reservas(): Response
    {
        return Inertia::render('Reservas', [
            'meta' => [
                'title'       => 'Reservas — Luni Styles',
                'description' => 'Reserva tu cita online con nuestros maestros barberos. Elige tu servicio, fecha y hora.',
            ],
        ]);
    }
}
