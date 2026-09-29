<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocalMedia extends Model
{
    protected $fillable = [
        'shop_type', 'media_type', 'url', 'thumbnail_url', 'caption', 'sort_order', 'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
}
