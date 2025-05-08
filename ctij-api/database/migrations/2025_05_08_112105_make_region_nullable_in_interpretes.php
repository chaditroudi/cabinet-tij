<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('interpretes', function (Blueprint $table) {
            $table->string('region')->nullable()->change();
        });
    }
    
    public function down()
    {
        Schema::table('interpretes', function (Blueprint $table) {
            $table->string('region')->nullable(false)->change();
        });
    }
    
};
