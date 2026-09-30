<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('catalog:fix-order', function () {
    $photos = \App\Models\CatalogPhoto::where('shop_type', 'peluqueria_infantil')->get();
    foreach ($photos as $photo) {
        if (preg_match('/(\d+)\.jpg/i', $photo->url, $matches)) {
            $photo->sort_order = (int)$matches[1];
            $photo->save();
            $this->info("Set sort_order to {$matches[1]} for ID {$photo->id}");
        }
    }
    $this->info("Catalog photos order fixed based on filenames!");
});
