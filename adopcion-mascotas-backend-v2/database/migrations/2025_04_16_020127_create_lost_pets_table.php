<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('lost_pets', function (Blueprint $table) {
        $table->id();
        $table->string('pet_name')->nullable();
        $table->string('last_seen')->nullable(); // lugar donde se perdió
        $table->date('lost_date')->nullable();
        $table->string('pet_species');
        $table->string('pet_photo')->nullable();
        $table->text('description')->nullable();
        $table->unsignedBigInteger('user_id');
        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lost_pets');
    }
};
