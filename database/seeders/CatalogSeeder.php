<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CatalogPhoto;

class CatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 12; $i++) {
            CatalogPhoto::updateOrCreate(
                ['shop_type' => 'peluqueria_infantil', 'sort_order' => $i],
                [
                    'url' => 'images/catalogo/' . $i . '.jpg',
                    'caption' => 'Catálogo ' . $i,
                    'active' => 1
                ]
            );
        }
    }
}
