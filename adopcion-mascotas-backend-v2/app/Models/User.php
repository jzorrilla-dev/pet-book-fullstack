<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Passwords\CanResetPassword;
use App\Notifications\CustomPasswordResetNotification;
use App\Notifications\ResetPasswordNotification; // Importa tu notificador

class User extends Authenticatable
{
    // <-- ¡Añade Notifiable y CanResetPassword aquí!
    use HasFactory, Notifiable, CanResetPassword, HasApiTokens;

    protected $primaryKey = 'user_id'; // Clave primaria personalizada

    protected $fillable = [
        'user_name',
        'user_phone',
        'city',
        'email',
        'password',
        'description',
    ];

    protected $hidden = [
        'password',
        'created_at',
        'updated_at',
    ];

    // Relaciones
    public function pets()
    {
        return $this->hasMany(Pet::class, 'user_id');
    }

    public function lostPets()
    {
        return $this->hasMany(LostPet::class, 'user_id');
    }

    public function adoptionsAsCreator()
    {
        return $this->hasMany(Adoption::class, 'creator_user_id');
    }

    public function adoptionsAsAdopter()
    {
        return $this->hasMany(Adoption::class, 'adopter_user_id');
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

}
