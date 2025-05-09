<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Langue;
use Illuminate\Http\Request;

class LangueController extends Controller
{
    public function index()
    {
        return Langue::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        return Langue::create($request->all());
    }

    public function show($id)
    {
        return Langue::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $interprete = Langue::findOrFail($id);
        $interprete->update($request->all());

        return $interprete;
    }

    public function destroy($id)
    {
        return Langue::destroy($id);
    }



}
