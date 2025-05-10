<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


    class Langue extends Model
    {
        use HasFactory;
        protected $table = 'langues';
        protected $fillable = ['id', 'name'];

        /**
         * The interpreters that speak this language.
         */
        public function interpretes()
        {
            return $this->belongsToMany(
                Interprete::class,          // related model
                'langue_interpretes',        // pivot table name
                'langue_id',                // this model’s FK on pivot
                'interprete_id'             // related model’s FK on pivot
            )->withTimestamps();
        }
    
        /**
         * Detach pivot links when soft- or hard-deleting a language.
         */
        protected static function booted()
        {
            static::deleting(function (Langue $langue) {
                $langue->interpretes()->detach();
            });
        }
    }
    