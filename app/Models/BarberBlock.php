<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarberBlock extends Model
{
    protected $fillable = [
        'employee_id',
        'block_date',
        'block_start',
        'block_end',
        'reason',
    ];

    protected $casts = [
        'block_date' => 'date',
    ];
}

