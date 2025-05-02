<?php

namespace Database\Seeders;

use App\Models\Interprete;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InterpreteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Interprete::factory()->count(10)->create();

        //
    }
}
