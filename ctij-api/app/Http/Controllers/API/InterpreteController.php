<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Interprete;
use App\Models\Langue;
use Illuminate\Http\Request;

class InterpreteController extends Controller
{
   
    public function index(Request $request)
    {
        $query = Interprete::query();
        $result = [];
        $keyword = $request->input('keyword'); 
        $query->where('identite', 'LIKE', '%' . $keyword . '%');
        if($keyword==""){
            $results = Interprete::paginate(20);
        }  
        else
        {
            $results = $query->with('langue')->paginate(20);
        }      

        return response()->json($results);
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
    
        foreach ($request->all() as $key => $value) {
            if (!empty($value)) {
                if ($key == 'keyword') {
                    $query->where('identite', 'LIKE', '%' . $value . '%');
                } elseif ($key == 'region') {
                    $query->where('region', $value);
                } elseif ($key == 'langue') {
                    $query->where('langue_id', $value);
                }
            }
        }
    
        $results = $query->with('langue')->get();
    
        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found'], 404);
        }
    
        return response()->json($results);
    }
    
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
