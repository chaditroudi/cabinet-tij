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
            'region'=>'string',
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
    
        if ($request->filled('langue')) {
            $query->where('langue', $request->input('langue'));
        }
        if ($request->filled('keyword')) {
            $query->where('identite', 'LIKE', '%' . $request->input('keyword') . '%');
        }
        if ($request->filled('departement')) {
            $query->where('departement', $request->input('departement'));
        }
    
        return response()->json($query->get());
    }
     // Combined method to get both the total of a selected language and available interpreters (dispo=1)
     public function getTotals(Request $request)
     {
         $request->validate([
             'langue' => 'required|string'
         ]);
 
         $totalLanguage = Interprete::where('langue', '!=', '')->count();
 
         // Get total of available interpreters (dispo=1)
         $totalDispoSMS = Interprete::where('dispo', 2)->count();
         $totalDispo = Interprete::where('dispo', 1)->count();
 
         return response()->json([
             'total_language' => $totalLanguage,
             'total_dispo_sms' => $totalDispoSMS,
             'total_dispo' => $totalDispo
         ]);
     }
    
}
