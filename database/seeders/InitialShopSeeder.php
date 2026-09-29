<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Product;

class InitialShopSeeder extends Seeder
{
    public function run(): void
    {
        // Barbería - Servicios
        Service::firstOrCreate(['shop_type' => 'barberia', 'name' => 'Corte Normal'], [
            'description'      => 'Corte de pelo, lavado y arreglo de cejas.',
            'duration_label'   => '30 min',
            'duration_minutes' => 30,
            'price'            => 12,
            'promo_price'      => 10,
            'photo_url'        => 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80',
            'sort_order'       => 1,
            'active'           => true,
        ]);

        Service::firstOrCreate(['shop_type' => 'barberia', 'name' => 'Corte + Barba'], [
            'description'      => 'Corte completo más arreglo y perfilado de barba con navaja y productos premium.',
            'duration_label'   => '45–60 min',
            'duration_minutes' => 60,
            'price'            => 15,
            'promo_price'      => 13,
            'photo_url'        => 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80',
            'sort_order'       => 2,
            'active'           => true,
        ]);

        Service::firstOrCreate(['shop_type' => 'barberia', 'name' => 'Solo Barba'], [
            'description'      => 'Arreglo, perfilado y acabado de barba.',
            'duration_label'   => '15–30 min',
            'duration_minutes' => 30,
            'price'            => 4,
            'promo_price'      => 4,
            'photo_url'        => 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80',
            'sort_order'       => 3,
            'active'           => true,
        ]);

        // Barbería - Productos
        Product::firstOrCreate(['shop_type' => 'barberia', 'name' => 'Cera Mate Premium'], [
            'tag'         => 'Fijación Fuerte',
            'description' => 'Cera de acabado mate para una fijación duradera y natural.',
            'price'       => 14.50,
            'photo_url'   => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80',
            'sort_order'  => 1,
            'active'      => true,
        ]);

        Product::firstOrCreate(['shop_type' => 'barberia', 'name' => 'Aceite para Barba'], [
            'tag'         => 'Hidratación',
            'description' => 'Aceite esencial para hidratar y suavizar la barba.',
            'price'       => 12.00,
            'photo_url'   => 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80',
            'sort_order'  => 2,
            'active'      => true,
        ]);

        // Peluquería Infantil - Servicios
        Service::firstOrCreate(['shop_type' => 'peluqueria_infantil', 'name' => 'Corte Infantil'], [
            'description'      => 'Corte profesional para niños, niñas y adolescentes.',
            'duration_label'   => '30 – 60 min',
            'duration_minutes' => 45,
            'price'            => null,
            'promo_price'      => null,
            'photo_url'        => 'https://images.unsplash.com/photo-1593450989025-502a9bd0b3eb?auto=format&fit=crop&q=80',
            'sort_order'       => 1,
            'active'           => true,
        ]);

        Service::firstOrCreate(['shop_type' => 'peluqueria_infantil', 'name' => 'Peinados'], [
            'description'      => 'Trenzas, coletas, ondas y peinados especiales para niñas.',
            'duration_label'   => '45 min',
            'duration_minutes' => 45,
            'price'            => null,
            'promo_price'      => null,
            'photo_url'        => 'https://images.unsplash.com/photo-1590540182697-3f309a96e95c?auto=format&fit=crop&q=80',
            'sort_order'       => 2,
            'active'           => true,
        ]);

        Service::firstOrCreate(['shop_type' => 'peluqueria_infantil', 'name' => 'Accesorios'], [
            'description'      => 'Coletas, lazos, broches y brillos para el look de las pequeñas.',
            'duration_label'   => '15 – 30 min',
            'duration_minutes' => 20,
            'price'            => null,
            'promo_price'      => null,
            'photo_url'        => 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80',
            'sort_order'       => 3,
            'active'           => true,
        ]);
        
        // Peluquería Infantil - Productos
        Product::firstOrCreate(['shop_type' => 'peluqueria_infantil', 'name' => 'Gominas Suaves'], [
            'tag'         => 'Fijación Niños',
            'description' => 'Gomina suave y sin alcohol especial para niños.',
            'price'       => 8.50,
            'photo_url'   => 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80',
            'sort_order'  => 1,
            'active'      => true,
        ]);
    }
}
