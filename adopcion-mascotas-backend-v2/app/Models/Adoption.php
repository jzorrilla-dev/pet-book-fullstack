<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Adoption extends Model
{
    protected $primaryKey = 'adoption_id';

    protected $fillable = [
        'creator_user_id',
        'adopter_user_id',
        'pet_id',
        'adoption_date',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_user_id');
    }

    public function adopter()
    {
        return $this->belongsTo(User::class, 'adopter_user_id');
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class, 'pet_id');
    }
}
