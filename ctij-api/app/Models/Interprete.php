<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Langue; 
class Interprete extends Model
{    
    use HasFactory;

    protected $fillable = ['dispo', 'langue_id', 'identite', 'telephone','region'];
    public function langue()
    {
        return $this->belongsTo(Langue::class, 'langue_id'); 
    }


}
