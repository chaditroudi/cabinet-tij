<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interprete extends Model
{
    protected $fillable = ['dispo', 'langue', 'identite', 'telephone','region',    'departement','gender'
];

    use HasFactory;
}
