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
    Schema::table('interpretes', function (Blueprint $table) {
        $table->string('code_postal')->nullable();
    });
}

public function down()
{
    Schema::table('interpretes', function (Blueprint $table) {
        $table->dropColumn('code_postal');
    });
}

};
