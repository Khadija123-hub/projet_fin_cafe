<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
//use Log
use Illuminate\Support\Facades\Log;

class ProduitController extends Controller
{
    /**
     * Afficher la liste des produits
     */
    public function index(): JsonResponse
    {
        try {
            $produits = Produit::with('categorie')->get()->map(function ($produit) {
                return [
                    'id' => $produit->id,
                    'nom' => $produit->nom,
                    'description' => $produit->description,
                    'prix' => (float) $produit->prix,
                    'image' => $produit->image ? url('storage/produits/' . $produit->image) : null,
                    'stock' => (int) $produit->stock,
                    'categorie_id' => $produit->categorie_id,
                    'categorie_nom' => $produit->categorie ? $produit->categorie->nom : null,
                    'disponible' => $produit->stock > 0,
                ];
            });
            
            return response()->json($produits);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des produits',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Enregistrer un nouveau produit
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:100',
                'description' => 'required|string',
                'prix' => 'required|numeric|min:0',
                'image' => 'nullable|string|max:255',
                'stock' => 'required|integer|min:0',
                'categorie_id' => 'required|exists:categories,id'
            ]);

            $produit = Produit::create($validated);
            
            return response()->json([
                'message' => 'Produit créé avec succès',
                'produit' => $produit
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Données de validation invalides',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la création du produit',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un produit spécifique
     */
    public function show($id): JsonResponse
    {
        try {
            $produit = Produit::with('categorie')->findOrFail($id);
            
            $produitData = [
                'id' => $produit->id,
                'nom' => $produit->nom,
                'description' => $produit->description,
                'prix' => (float) $produit->prix,
                'image' => $produit->image ? url('storage/produits/' . $produit->image) : null,
                'stock' => (int) $produit->stock,
                'categorie_id' => $produit->categorie_id,
                'categorie_nom' => $produit->categorie ? $produit->categorie->nom : null,
                'disponible' => $produit->stock > 0,
            ];
            
            return response()->json($produitData);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Produit non trouvé'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération du produit',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un produit
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $produit = Produit::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'sometimes|string|max:100',
                'description' => 'sometimes|string',
                'prix' => 'sometimes|numeric|min:0',
                'image' => 'nullable|string|max:255',
                'stock' => 'sometimes|integer|min:0',
                'categorie_id' => 'sometimes|exists:categories,id'
            ]);

            $produit->update($validated);
            
            return response()->json([
                'message' => 'Produit mis à jour avec succès',
                'produit' => $produit
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Produit non trouvé'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Données de validation invalides',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la mise à jour du produit',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un produit
     */
    public function destroy($id): JsonResponse
    {
        try {
            $produit = Produit::findOrFail($id);
            $produit->delete();
            
            return response()->json([
                'message' => 'Produit supprimé avec succès'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Produit non trouvé'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la suppression du produit',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche les produits d'une catégorie spécifique (pour l'API)
     */
public function getProduitsByCategorieAPI($id)
{
    try {
        Log::info('Début de récupération des produits pour la catégorie', ['categorie_id' => $id]);
        
        $produits = Produit::where('categorie_id', $id)->get();
        
        $produits->transform(function ($produit) {
            $imagePath = public_path('storage/produits/' . $produit->image);
            $imageExists = $produit->image && file_exists($imagePath);
            
            // Log des informations sur l'image
            Log::debug('Vérification image produit', [
                'produit_id' => $produit->id,
                'nom_produit' => $produit->nom,
                'image_name' => $produit->image,
                'image_path' => $imagePath,
                'image_exists' => $imageExists,
                'public_url' => $imageExists ? asset('storage/produits/' . $produit->image) : null
            ]);
            
            return [
                'id' => $produit->id,
                'nom' => $produit->nom,
                'description' => $produit->description,
                'prix' => (float) $produit->prix,
                'image' => $produit->image,
                'imageUrl' => $imageExists ? url('storage/produits/' . $produit->image) : null,
                'stock' => (int) $produit->stock,
                'categorie_id' => $produit->categorie_id,
                'categorie_nom' => 'boisson',
                'disponible' => true
            ];
        });

        return response()->json($produits);
        
    } catch (\Exception $e) {
        Log::error('Erreur lors du chargement des produits', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        
        return response()->json([
            'error' => 'Erreur lors de la récupération des produits',
            'message' => $e->getMessage()
        ], 500);
    }
}
}