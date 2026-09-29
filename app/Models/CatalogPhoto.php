<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogPhoto extends Model
{
    protected $fillable = [
        'shop_type', 'url', 'caption', 'sort_order', 'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
}
