<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdoptionsTable extends Migration
{
    public function up(): void
    {
        Schema::create('adoptions', function (Blueprint $table) {
            $table->id('adoption_id');
            $table->unsignedBigInteger('creator_user_id');
            $table->unsignedBigInteger('adopter_user_id');
            $table->unsignedBigInteger('pet_id');
            $table->foreign('creator_user_id')->references('user_id')->on('users')->onDelete('restrict');
            $table->foreign('adopter_user_id')->references('user_id')->on('users')->onDelete('restrict');
            $table->foreign('pet_id')->references('pet_id')->on('pets')->onDelete('cascade');
            $table->timestamp('adoption_date')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adoptions');
    }
}
