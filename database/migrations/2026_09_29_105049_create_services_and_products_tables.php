<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Servicios editables por barberos/peluqueros
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('shop_type', 30); // 'barberia' | 'peluqueria_infantil'
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('duration_label', 50)->nullable();
            $table->integer('duration_minutes')->default(30);
            $table->decimal('price', 8, 2)->nullable();
            $table->decimal('promo_price', 8, 2)->nullable();
            $table->string('photo_url', 500)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // Productos
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('shop_type', 30);
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2)->nullable();
            $table->string('photo_url', 500)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // Multimedia del local (fotos y videos del carrusel)
        Schema::create('local_media', function (Blueprint $table) {
            $table->id();
            $table->string('shop_type', 30)->default('general');
            $table->string('media_type', 10)->default('photo'); // 'photo' | 'video'
            $table->string('url', 500);
            $table->string('thumbnail_url', 500)->nullable();
            $table->string('caption', 255)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // Catálogo de fotos (peluquería infantil)
        Schema::create('catalog_photos', function (Blueprint $table) {
            $table->id();
            $table->string('shop_type', 30)->default('peluqueria_infantil');
            $table->string('url', 500);
            $table->string('caption', 255)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_photos');
        Schema::dropIfExists('local_media');
        Schema::dropIfExists('products');
        Schema::dropIfExists('services');
    }
};
