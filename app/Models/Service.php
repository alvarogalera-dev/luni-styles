<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'shop_type', 'name', 'description', 'duration_label',
        'duration_minutes', 'price', 'promo_price', 'photo_url',
        'sort_order', 'active',
    ];

    protected $casts = [
        'price'       => 'float',
        'promo_price' => 'float',
        'active'      => 'boolean',
    ];
}
