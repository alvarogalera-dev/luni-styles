<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'shop_type', 'name', 'description', 'price', 'photo_url', 'sort_order', 'active',
    ];

    protected $casts = [
        'price'  => 'float',
        'active' => 'boolean',
    ];
}
