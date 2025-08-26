<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CategorieController extends Controller
{
    /**
     * Affiche une liste de toutes les catégories.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $categories = Categorie::with('produits')->get();
            Log::info('Categories loaded:', ['count' => $categories->count()]);
            
            if ($categories->isEmpty()) {
                Log::warning('No categories found in database');
            }
            
            return response()->json($categories);
        } catch (\Exception $e) {
            Log::error('Error loading categories:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to load categories'], 500);
        }
    }
    
    /**
     * Récupère les produits d'une catégorie spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
     public function getProduitsByCategorie($id)
    {
        try {
            $categorie = Categorie::with('produits')->findOrFail($id);
            Log::info('Products loaded for category:', [
                'category_id' => $id,
                'products_count' => $categorie->produits->count()
            ]);
            
            return response()->json([
                'categorie' => $categorie->nom,
                'produits' => $categorie->produits
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading category products:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Category not found'], 404);
        }
    }
    
    // Autres méthodes du contrôleur...
}