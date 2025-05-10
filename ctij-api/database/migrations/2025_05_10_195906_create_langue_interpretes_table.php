<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('langue_interpretes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interprete_id')->constrained('interpretes')->onDelete('cascade');
            $table->foreignId('langue_id')->constrained('langues')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('langue_interpretes');
    }
};
