<?php

namespace Database\Factories;

use App\Models\Interprete;
use Illuminate\Database\Eloquent\Factories\Factory;

class InterpreteFactory extends Factory
{
    protected $model = Interprete::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $identites = [
            "M. Odai SAKER",
            "M. Philippe ALAYA",
            "Mme Rahma MIRI HAMDOUNI",
            "Mme Rim Ben Friha",
            "M. Mahmoud HADLA",
            "Mme Sana RIDA ALI",
            "M. Mohamed SAFINI"
        ];
        $departements = ['75', '13', '69', '59', '92', '33', '31']; // Paris, Marseille, Lyon...

        return [
            'dispo' => $this->faker->boolean(80),
            'langue' => 'AR | Arabe',
            'identite' => $this->faker->randomElement($identites),
            'telephone' => $this->faker->numerify('06########'),
            'region' => $this->faker->randomElement([
                'Île-de-France',
                'Provence-Alpes-Côte d\'Azur',
                'Occitanie',
                'Nouvelle-Aquitaine'
            ]),
            'departement' => $this->faker->randomElement($departements)


        ];
    }
}
