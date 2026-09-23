<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->dateTime('appointment_date');
            $table->string('service_type'); // 'barberia' or 'peluqueria_infantil'
            $table->string('price')->nullable(); 
            $table->text('observations')->nullable();
            $table->string('status')->default('pending'); // 'pending', 'confirmed', 'completed', 'no-show'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
