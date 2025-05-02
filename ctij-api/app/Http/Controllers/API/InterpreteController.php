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
            'dispo' => 'required|boolean',
            'langue' => 'required|string',
            'identite' => 'required|string',
            'region'=>'required','string',
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
            $query->where('langue', 'LIKE', '%' . $request->input('langue') . '%');
        }
    
        if ($request->filled('zone')) {
            $query->whereRaw("CONCAT(departement, ' - ', region) LIKE ?", ['%' . $request->input('zone') . '%']);
        }
    
        if ($request->filled('dispo')) {
            $query->where('dispo', $request->input('dispo'));
        }
    
        return response()->json($query->get());
    }
    
}
