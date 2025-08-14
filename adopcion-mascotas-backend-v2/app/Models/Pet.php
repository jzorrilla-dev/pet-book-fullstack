<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $primaryKey = 'pet_id';

    protected $fillable = [
        'pet_name',
        'location',
        'description',
        'pet_species',
        'pet_status',
        'health_condition',
        'castrated',
        'pet_photo',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function adoption()
    {
        return $this->hasOne(Adoption::class, 'pet_id');
    }
}
