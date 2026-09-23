<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->integer('total_appointments')->default(0);
            $table->integer('attended_appointments')->default(0);
            $table->integer('missed_appointments')->default(0);
            $table->integer('consecutive_misses')->default(0);
            $table->integer('consecutive_attendances_after_penalty')->default(0);
            $table->boolean('penalty_flag')->default(false);
            $table->integer('loyalty_points')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
