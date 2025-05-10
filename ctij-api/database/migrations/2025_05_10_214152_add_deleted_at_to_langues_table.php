<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtToLanguesTable extends Migration
{
    public function up()
    {
        Schema::table('langues', function (Blueprint $table) {
            $table->softDeletes();  // adds nullable deleted_at TIMESTAMP
        });
    }

    public function down()
    {
        Schema::table('langues', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
