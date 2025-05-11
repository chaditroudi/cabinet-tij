<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Langue; 
class Interprete extends Model
{    
    use HasFactory;
    protected $fillable = [ 'identite', 'telephone','region','level'];

    protected static function booted()
    {
        static::deleting(function (Interprete $interprete) {
            $interprete->langues()->detach();
        });
    }

    public function langues()
    {
        return $this->belongsToMany(
            Langue::class,           
            'langue_interpretes',     
            'interprete_id',          
            'langue_id'              
        )->withTimestamps();
    }
    

}
