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
        $keyword = $request->input('keyword', '');
        $query = Interprete::with('langues');
        if (! empty($keyword)) {
            $query->where('identite', 'LIKE', "%{$keyword}%");
        }
        $paginated = $query->paginate(20);
        return response()->json($paginated);
    }
    

  public function store(Request $request)
{
    
    $validated = $request->validate([
        'langue_ids' => 'required|array',
        'langue_ids.*' => 'exists:langues,id', 
        'identite' => 'required|string',
        'region' => 'required|string',
        'telephone' => 'required|string|max:20',
    ]);

    $interprete = Interprete::create([
        'identite' => $validated['identite'],
        'region' => $validated['region'],
        'telephone' => $validated['telephone'],
    ]);

    $interprete->langues()->attach($validated['langue_ids']);  

    return response()->json([
        'message' => 'Interprète enregistré avec succès',
        'data' => $interprete->load('langues') 
    ], 201);
}


    public function show($id)
    {
        return Interprete::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'identite'     => 'required|string',
            'region'       => 'required|string',
            'telephone'    => 'required|string|max:20',
            'langue_ids'   => 'required|array|min:1',
            'langue_ids.*' => 'exists:langues,id',
        ]);
    
        $interp = Interprete::findOrFail($id);
        $interp->update($data);
        $interp->langues()->sync($data['langue_ids']);
    
        return response()->json($interp->load('langues'));
    }
    

    public function destroy($id)
    {
        return Interprete::destroy($id);
    }


    public function filter(Request $request)
    {
        $query = Interprete::query();
    
        if ($request->filled('keyword')) {
            $query->where('identite', 'LIKE', '%' . $request->keyword . '%');
        }
    
        if ($request->filled('region')) {
            $query->where('region', $request->region);
        }
    
        if ($request->filled('langue')) {
            $langueId = $request->langue;
    
            $query->whereHas('langues', function ($q) use ($langueId) {
                $q->where('langues.id', $langueId);
            });
    
            $query->with(['langues' => function ($q) use ($langueId) {
                $q->where('langues.id', $langueId);
            }]);
        } else {
            $query->with('langues');
        }
    
        $results = $query->get();
    
        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found'], 404);
        }
    
        return response()->json($results);
    }
    
    
    public function getTotals(Request $request)
    {
        $totalLanguages = Langue::count(); 
        $totalInterpretes = Interprete::count(); 
        $totalLanguesDisponibles = Interprete::has('langues')->count(); 
    
        return response()->json([
            'total_language' => $totalLanguages,
            'total_language_dispo' => $totalLanguesDisponibles,
            'total_trad' => $totalInterpretes
        ]);
    }
    
    
}
