<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('interpretes', function (Blueprint $table) {
            // Primary key with auto-increment
            $table->id();

            // identite (varchar(255)) - identity field, could be name or identifier
            $table->string('identite', 255)->collation('utf8mb4_unicode_ci');
            // region (varchar(255)) - region field, for geographical categorization
            $table->string('region', 255)->collation('utf8mb4_unicode_ci');

            // telephone (varchar(20)) - phone number field
            $table->string('telephone', 20)->collation('utf8mb4_unicode_ci');

            // created_at and updated_at timestamps
            $table->timestamps(0); // By default, Laravel will manage these fields with NULL as the default value
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('interpretes');
    }
};