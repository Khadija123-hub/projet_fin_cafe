<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    /**
     * Affiche une liste de toutes les catégories.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Categorie::all();
        
        return response()->json($categories);
    }
    
    /**
     * Récupère les produits d'une catégorie spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getProduitsByCategorie($id)
    {
        $categorie = Categorie::findOrFail($id);
        $produits = $categorie->produits; // Ceci suppose que vous avez défini la relation dans le modèle
        
        return response()->json([
            'categorie' => $categorie->nom,
            'produits' => $produits
        ]);
    }
    
    // Autres méthodes du contrôleur...
}