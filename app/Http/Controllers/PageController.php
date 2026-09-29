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
                'title'       => 'Luni Styles',
                'description' => 'Experiencia de barbería premium en el corazón de la ciudad. Cortes, arreglos de barba y tratamientos capilares de alta gama.',
            ],
        ]);
    }

    public function laBarberia(): Response
    {
        $services = \App\Models\Service::where('shop_type', 'barberia')->where('active', true)->orderBy('sort_order')->get();
        $products = \App\Models\Product::where('shop_type', 'barberia')->where('active', true)->orderBy('sort_order')->get();
        $localMedia = \App\Models\LocalMedia::where('shop_type', 'barberia')->where('active', true)->orderBy('sort_order')->get();

        return Inertia::render('LaBarberia', [
            'services' => $services,
            'products' => $products,
            'localMedia' => $localMedia,
            'meta' => [
                'title'       => 'La Barbería',
                'description' => 'Servicios de barbería premium: cortes, barba, tratamientos y más.',
            ],
        ]);
    }

    public function peluqueriaInfantil(): Response
    {
        $services = \App\Models\Service::where('shop_type', 'peluqueria_infantil')->where('active', true)->orderBy('sort_order')->get();
        $localMedia = \App\Models\LocalMedia::where('shop_type', 'peluqueria_infantil')->where('active', true)->orderBy('sort_order')->get();
        $catalogPhotos = \App\Models\CatalogPhoto::where('shop_type', 'peluqueria_infantil')->where('active', true)->orderBy('sort_order')->get();

        return Inertia::render('PeluqueriaInfantil', [
            'services' => $services,
            'localMedia' => $localMedia,
            'catalogPhotos' => $catalogPhotos,
            'meta' => [
                'title'       => 'Peluquería Infantil',
                'description' => 'Cortes de cabello para los más pequeños en un ambiente cómodo y divertido.',
            ],
        ]);
    }

    public function quienesSomos(): Response
    {
        return Inertia::render('QuienesSomos', [
            'meta' => [
                'title'       => 'Quiénes Somos',
                'description' => 'Conoce la historia de Luni Styles y nuestra pasión por el estilo.',
            ],
        ]);
    }

    public function contacto(): Response
    {
        return Inertia::render('Contacto', [
            'meta' => [
                'title'       => 'Contacto',
                'description' => 'Encuéntranos en Madrid. Contacta con nosotros para cualquier duda o consulta.',
            ]
        ]);
    }

    public function avisoLegal(): Response
    {
        return Inertia::render('Legal/AvisoLegal', [
            'meta' => [
                'title'       => 'Aviso Legal',
                'description' => 'Aviso Legal y datos registrales de Luni Styles.',
            ]
        ]);
    }

    public function politicaPrivacidad(): Response
    {
        return Inertia::render('Legal/PoliticaPrivacidad', [
            'meta' => [
                'title'       => 'Política de Privacidad',
                'description' => 'Política de Privacidad y protección de datos.',
            ]
        ]);
    }

    public function politicaCookies(): Response
    {
        return Inertia::render('Legal/PoliticaCookies', [
            'meta' => [
                'title'       => 'Política de Cookies',
                'description' => 'Política de Cookies de nuestra web.',
            ]
        ]);
    }

    public function terminosReserva(): Response
    {
        return Inertia::render('Legal/TerminosReserva', [
            'meta' => [
                'title'       => 'Términos de Reserva',
                'description' => 'Condiciones y términos al reservar en Luni Styles.',
            ]
        ]);
    }
}
