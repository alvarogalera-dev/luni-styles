<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'surname',
        'email',
        'known_emails',
        'phone',
        'known_phones',
        'total_appointments',
        'attended_appointments',
        'missed_appointments',
        'consecutive_misses',
        'consecutive_attendances_after_penalty',
        'penalty_flag',
        'loyalty_points',
    ];

    protected $casts = [
        'penalty_flag' => 'boolean',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
