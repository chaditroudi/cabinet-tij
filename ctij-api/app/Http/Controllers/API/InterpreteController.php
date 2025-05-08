<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Interprete;
use Illuminate\Http\Request;

class InterpreteController extends Controller
{
    public function index()
    {
        return Interprete::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'dispo' => 'required|string',
            'langue' => 'required|string',
            'identite' => 'required|string',
            'departement' => 'required|string',
            'region' => 'nullable|string',

            'gender' => 'required|string',
            'telephone' => 'required|string|max:20',
        ]);

        return Interprete::create($request->all());
    }

    public function show($id)
    {
        return Interprete::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $interprete = Interprete::findOrFail($id);
        $interprete->update($request->all());

        return $interprete;
    }

    public function destroy($id)
    {
        return Interprete::destroy($id);
    }


    public function filter(Request $request)
    {
        $query = Interprete::query();
    
        // Loop through all request parameters and add filters dynamically
        foreach ($request->all() as $key => $value) {
            if (!empty($value)) {
                // Apply dynamic filters based on the request parameters
                if ($key == 'keyword') {
                    // Case-insensitive LIKE for keyword matching
                    $query->where('identite', 'LIKE', '%' . $value . '%');
                } elseif ($key == 'departement') {
                    // Ensure departement is treated as an integer and matches
                    $query->where('departement', (int) $value);
                } elseif ($key == 'langue') {
                    // Remove the extra characters from langue to ensure the comparison matches the prefix
                    $query->whereRaw('LOWER(SUBSTRING_INDEX(langue, " |", 1)) = ?', [strtolower($value)]);
                }
            }
        }
    
        // Execute the query and get results
        $results = $query->get();
    
        // If no results found, return a message
        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found'], 404);
        }
    
        // Return the filtered results as JSON
        return response()->json($results);
    }
    
     // Combined method to get both the total of a selected language and available interpreters (dispo=1)
     public function getTotals(Request $request)
     {
 
 
        $totalLanguage = Interprete::where('langue', '!=', '')->count();
        $totalTrad= Interprete::count();
 
         // Get total of available interpreters (dispo=1)
         $totalDispoSMS = Interprete::where('dispo', 2)->count();
         $totalDispo = Interprete::where('dispo', 1)->count();
 
         return response()->json([
             'total_language' => $totalLanguage,
             'total_dispo_sms' => $totalDispoSMS,
             'total_dispo' => $totalDispo,
             'total_trad'=>$totalTrad
         ]);
     }
    
}
