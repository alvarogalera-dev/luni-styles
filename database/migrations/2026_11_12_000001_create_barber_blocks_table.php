<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barber_blocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('employee_id'); // 1=Luis, 2=Carlos
            $table->date('block_date');
            $table->time('block_start'); // HH:MM
            $table->time('block_end');   // HH:MM
            $table->string('reason', 255)->nullable();
            $table->timestamps();

            $table->index(['employee_id', 'block_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barber_blocks');
    }
};

