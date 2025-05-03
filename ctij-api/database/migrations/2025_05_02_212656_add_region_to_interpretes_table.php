<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('interpretes', function (Blueprint $table) {
            $table->id();
            $table->boolean('dispo');
            $table->string('langue');
            $table->string('identite');
            $table->string('departement');
            $table->string('region');
            $table->string('telephone', 20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interpretes', function (Blueprint $table) {
            //
            
        });
    }
};
