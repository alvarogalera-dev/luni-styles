<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Product;

class InitialDataSeeder extends Seeder
{
    public function run(): void
    {
        // Barberia Services
        Service::firstOrCreate(['shop_type' => 'barberia', 'name' => 'Corte Normal'], [
            'description' => 'Corte de pelo, lavado y arreglo de cejas.',
            'duration_label' => '30 min',
            'duration_minutes' => 30,
            'price' => 12,
            'sort_order' => 1,
            'photo_url' => 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop'
        ]);

        Service::firstOrCreate(['shop_type' => 'barberia', 'name' => 'Corte + Barba'], [
            'description' => 'Corte completo más arreglo y perfilado de barba con navaja y productos premium.',
            'duration_label' => '45–60 min',
            'duration_minutes' => 60,
            'price' => 15,
            'sort_order' => 2,
            'photo_url' => 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop'
        ]);

        Service::firstOrCreate(['shop_type' => 'barberia', 'name' => 'Solo Barba'], [
            'description' => 'Arreglo, perfilado y acabado de barba.',
            'duration_label' => '15–30 min',
            'duration_minutes' => 30,
            'price' => 4,
            'sort_order' => 3,
            'photo_url' => 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop'
        ]);

        // Peluqueria Services
        Service::firstOrCreate(['shop_type' => 'peluqueria_infantil', 'name' => 'Corte Infantil'], [
            'description' => 'Para los más pequeños. Incluye diploma de primer corte (opcional).',
            'duration_label' => '30 min',
            'duration_minutes' => 30,
            'price' => 10,
            'sort_order' => 1,
            'photo_url' => 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop'
        ]);

        Service::firstOrCreate(['shop_type' => 'peluqueria_infantil', 'name' => 'Peinados de Comunión'], [
            'description' => 'Peinados especiales para días inolvidables.',
            'duration_label' => '45 min',
            'duration_minutes' => 45,
            'price' => 25,
            'sort_order' => 2,
            'photo_url' => 'https://images.unsplash.com/photo-1605664187214-d07d1217e2c9?q=80&w=600&auto=format&fit=crop'
        ]);

        Service::firstOrCreate(['shop_type' => 'peluqueria_infantil', 'name' => 'Corte Bebé'], [
            'description' => 'Con todo el mimo y paciencia para sus primeros meses.',
            'duration_label' => '20 min',
            'duration_minutes' => 20,
            'price' => 8,
            'sort_order' => 3,
            'photo_url' => 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?q=80&w=600&auto=format&fit=crop'
        ]);

        // Barberia Product
        Product::firstOrCreate(['shop_type' => 'barberia', 'name' => 'RedOne Aqua Hair Wax'], [
            'description' => 'Fijación extrema y brillo duradero. Fórmula a base de agua ideal para peinados que necesitan máxima sujeción sin dejar residuos.',
            'tag' => 'Cera',
            'price' => 6,
            'sort_order' => 1,
            'photo_url' => '/products/redone-aqua-hair-red.png'
        ]);
    }
}
