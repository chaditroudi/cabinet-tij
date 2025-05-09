<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Interprete;
use App\Models\Langue;
use Illuminate\Http\Request;

class InterpreteController extends Controller
{
    public function index()
    {
        return Interprete::with('langue')->get(); 
    }

    public function store(Request $request)
    {
        $request->validate([
            'langue_id' => 'required',
            'identite' => 'required|string',
            'region' => 'required|string',
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
                } elseif ($key == 'region') {
                    $query->where('region', $value);
                } elseif ($key == 'langue') {
                    $query->where('langue_id', $value);
                }
            }
        }
    
        // Execute the query and get results
        $results = $query->with('langue')->get();
    
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
 
 
        $totalLanguage = Langue::count();
        $totalTrad= Interprete::count();
        $totalLanDispo = Interprete::where('langue_id', '!=', "")->count();


         return response()->json([
            'total_language' => $totalLanguage,
            'total_language_dispo' => $totalLanguage,
            'total_trad'=>$totalTrad
         ]);
     }
    
}
