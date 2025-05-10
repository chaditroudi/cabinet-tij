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

        public function langues()
        {
            return $this->belongsToMany(
                Langue::class,
                'langue_interpretes', 
                'interprete_id',
                'langue_id'
            )->withTimestamps();
        }
    
        protected static function booted()
        {
            static::deleting(function (Interprete $i) {
                $i->langues()->detach();
            });
        }
    }
    