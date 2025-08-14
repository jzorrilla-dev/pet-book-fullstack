<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePetsTable extends Migration
{
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id('pet_id');
            $table->string('pet_name');
            $table->string('location');
            $table->text('description')->nullable();
            $table->string('pet_species');
            $table->enum('pet_status', ['adopted', 'available', 'pending'])->default('available');
            $table->string('health_condition')->nullable();
            $table->boolean('castrated')->default(false);
            $table->string('pet_photo')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
