<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    /**
     * Afficher la liste des produits
     */
    public function index()
    {
        $produits = Produit::with('categorie')->get()->map(function ($produit){
            return [
                'id' => $produit->id,
                'nom' => $produit->nom,
                'description' => $produit->description,
                'prix' => $produit->prix,
                'image' => $produit->image ? url('storage/produits/' . $produit->image) : null,
                'stock' => $produit->stock,
                'categorie_id' => $produit->categorie_id,
                'categorie_nom' => $produit->categorie ? $produit->categorie->nom : null,
            ];
        });
        return response()->json($produits);
    }

    /**
     * Enregistrer un nouveau produit
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:100',
            'description' => 'required|string',
            'prix' => 'required|numeric',
            'image' => 'nullable|string|max:255',
            'stock' => 'required|integer',
            'categorie_id' => 'required|exists:categories,id'
        ]);

        $produit = Produit::create($request->all());
        return response()->json($produit, 201);
    }

    /**
     * Afficher un produit spécifique
     */
    public function show($id)
    {
        $produit = Produit::with('categorie')->findOrFail($id);
        return response()->json($produit);
    }

    /**
     * Mettre à jour un produit
     */
    public function update(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);
        
        $request->validate([
            'nom' => 'string|max:100',
            'description' => 'string',
            'prix' => 'numeric',
            'image' => 'nullable|string|max:255',
            'stock' => 'integer',
            'categorie_id' => 'exists:categories,id'
        ]);

        $produit->update($request->all());
        return response()->json($produit);
    }

    /**
     * Supprimer un produit
     */
    public function destroy($id)
    {
        $produit = Produit::findOrFail($id);
        $produit->delete();
        return response()->json(null, 204);
    }

    /**
     * Affiche les produits d'une catégorie spécifique (pour l'API)
     */
    public function getProduitsByCategorieAPI($id)
    {
        $produits = Produit::where('categorie_id', $id)->with('categorie')->get()->map(function ($produit){
            return [
                'id' => $produit->id,
                'nom' => $produit->nom,
                'description' => $produit->description,
                'prix' => $produit->prix,
                'image' => $produit->image ? url('storage/produits/' . $produit->image) : null,
                'stock' => $produit->stock,
                'categorie_id' => $produit->categorie_id,
                'categorie_nom' => $produit->categorie ? $produit->categorie->nom : null,
            ];
        });
        return response()->json($produits);
    }
}