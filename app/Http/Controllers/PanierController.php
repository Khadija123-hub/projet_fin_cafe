<?php

namespace App\Http\Controllers;

use App\Models\Panier;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PanierController extends Controller
{
    /**
     * Obtenir le contenu du panier / Initialiser le panier
     */
    public function getCart(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Get cart data using the existing method
            $panierData = $this->getPanierData($user->id);

            // Return JSON response
            return response()->json([
                'success' => true,
                'data' => $panierData
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du panier: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du panier'
            ], 500);
        }
    }

    /**
     * Ajouter un produit au panier
     */
    public function addToCart(Request $request)
    {
        // Log détaillé pour debug
        Log::info('Début addToCart', [
            'request_data' => $request->all(),
            'user_id' => Auth::id(),
            'headers' => $request->headers->all()
        ]);

        try {
            // Vérifier l'authentification en premier
            $user = Auth::user();
            if (!$user) {
                Log::warning('Utilisateur non authentifié');
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            Log::info('Utilisateur authentifié', ['user_id' => $user->id]);

            // Validation des données avec messages personnalisés
            try {
                $validated = $request->validate([
                    'produit_id' => 'required|integer|exists:produits,id',
                    'quantite' => 'required|integer|min:1'
                ], [
                    'produit_id.required' => 'L\'ID du produit est requis',
                    'produit_id.integer' => 'L\'ID du produit doit être un nombre',
                    'produit_id.exists' => 'Le produit n\'existe pas',
                    'quantite.required' => 'La quantité est requise',
                    'quantite.integer' => 'La quantité doit être un nombre',
                    'quantite.min' => 'La quantité doit être au moins 1'
                ]);
                
                Log::info('Validation réussie', ['validated' => $validated]);
            } catch (ValidationException $e) {
                Log::error('Erreur de validation', ['errors' => $e->errors()]);
                throw $e;
            }

            // Récupérer le produit avec vérification d'existence
            $produit = Produit::find($validated['produit_id']);
            if (!$produit) {
                Log::error('Produit non trouvé', ['produit_id' => $validated['produit_id']]);
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé'
                ], 404);
            }

            Log::info('Produit trouvé', [
                'produit_id' => $produit->id,
                'nom' => $produit->nom,
                'stock' => $produit->stock
            ]);

            // Vérifier le stock disponible
            if ($produit->stock < $validated['quantite']) {
                Log::warning('Stock insuffisant', [
                    'stock_disponible' => $produit->stock,
                    'quantite_demandee' => $validated['quantite']
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant. Stock disponible: ' . $produit->stock
                ], 400);
            }

            DB::beginTransaction();
            Log::info('Transaction démarrée');

            try {
                // Vérifier si le produit est déjà dans le panier
                $panierItem = Panier::where('user_id', $user->id)
                    ->where('produit_id', $validated['produit_id'])
                    ->where('statut', 'actif')
                    ->first();

                if ($panierItem) {
                    Log::info('Produit déjà dans le panier', ['panier_item_id' => $panierItem->id]);
                    
                    // Mettre à jour la quantité existante
                    $nouvelleQuantite = $panierItem->quantite + $validated['quantite'];
                    
                    if ($nouvelleQuantite > $produit->stock) {
                        DB::rollBack();
                        Log::warning('Quantité totale dépasse le stock', [
                            'nouvelle_quantite' => $nouvelleQuantite,
                            'stock' => $produit->stock
                        ]);
                        return response()->json([
                            'success' => false,
                            'message' => 'Quantité totale dépasse le stock disponible (' . $produit->stock . ' disponible)'
                        ], 400);
                    }

                    $panierItem->quantite = $nouvelleQuantite;
                    $panierItem->prix_total = $nouvelleQuantite * $panierItem->prix_unitaire;
                    $panierItem->save();

                    Log::info('Panier mis à jour', [
                        'panier_item_id' => $panierItem->id,
                        'nouvelle_quantite' => $nouvelleQuantite,
                        'prix_total' => $panierItem->prix_total
                    ]);
                } else {
                    Log::info('Création d\'un nouvel élément dans le panier');
                    
                    // Vérifier que toutes les colonnes nécessaires existent
                    $panierData = [
                        'user_id' => $user->id,
                        'produit_id' => $validated['produit_id'],
                        'quantite' => $validated['quantite'],
                        'prix_unitaire' => $produit->prix,
                        'prix_total' => $validated['quantite'] * $produit->prix,
                        'statut' => 'actif'
                    ];
                    
                    Log::info('Données pour création panier', $panierData);
                    
                    // Créer un nouvel élément dans le panier
                    $panierItem = Panier::create($panierData);

                    Log::info('Nouvel élément créé dans le panier', [
                        'panier_item_id' => $panierItem->id,
                        'user_id' => $user->id,
                        'produit_id' => $produit->id,
                        'quantite' => $validated['quantite']
                    ]);
                }

                DB::commit();
                Log::info('Transaction validée');

                // Récupérer le panier mis à jour
                $panier = $this->getPanierData($user->id);

                Log::info('Panier récupéré après ajout', [
                    'count' => $panier['count'],
                    'total' => $panier['total']
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Produit ajouté au panier avec succès',
                    'data' => $panier
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Erreur dans la transaction', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }

        } catch (ValidationException $e) {
            Log::error('Erreur de validation finale', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur générale lors de l\'ajout au panier', [
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout au panier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour la quantité d'un produit dans le panier
     */
    public function updateCartItem(Request $request, $produit_id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validated = $request->validate([
                'quantite' => 'required|integer|min:1'
            ], [
                'quantite.required' => 'La quantité est requise',
                'quantite.integer' => 'La quantité doit être un nombre',
                'quantite.min' => 'La quantité doit être au moins 1'
            ]);

            $panierItem = Panier::where('user_id', $user->id)
                ->where('produit_id', $produit_id)
                ->where('statut', 'actif')
                ->first();

            if (!$panierItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé dans le panier'
                ], 404);
            }

            $produit = Produit::find($produit_id);
            if (!$produit) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé'
                ], 404);
            }

            // Vérifier le stock
            if ($validated['quantite'] > $produit->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Quantité demandée dépasse le stock disponible (' . $produit->stock . ' disponible)'
                ], 400);
            }

            // Mettre à jour
            $panierItem->quantite = $validated['quantite'];
            $panierItem->prix_total = $validated['quantite'] * $panierItem->prix_unitaire;
            $panierItem->save();

            $panier = $this->getPanierData($user->id);

            return response()->json([
                'success' => true,
                'message' => 'Quantité mise à jour avec succès',
                'data' => $panier
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du panier', [
                'user_id' => Auth::id(),
                'produit_id' => $produit_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour'
            ], 500);
        }
    }

    /**
     * Supprimer un produit du panier
     */
    public function removeFromCart(Request $request, $produit_id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Rechercher l'item dans le panier
            $panierItem = Panier::where('user_id', $user->id)
                ->where('produit_id', $produit_id)
                ->where('statut', 'actif')
                ->first();

            if (!$panierItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé dans le panier'
                ], 404);
            }

            // Supprimer l'item
            $panierItem->delete();

            // Récupérer le panier mis à jour
            $panier = $this->getPanierData($user->id);

            return response()->json([
                'success' => true,
                'message' => 'Produit supprimé du panier avec succès',
                'data' => $panier
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du produit', [
                'user_id' => Auth::id(),
                'produit_id' => $produit_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du produit du panier'
            ], 500);
        }
    }

    /**
     * Vider complètement le panier
     */
    public function clearCart(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $deletedCount = Panier::where('user_id', $user->id)
                ->where('statut', 'actif')
                ->delete();

            Log::info('Panier vidé', [
                'user_id' => $user->id,
                'items_deleted' => $deletedCount
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Panier vidé avec succès',
                'data' => [
                    'items' => [],
                    'count' => 0,
                    'total' => 0,
                    'items_count' => 0
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors du vidage du panier', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du vidage du panier'
            ], 500);
        }
    }

    /**
     * Obtenir le nombre d'articles dans le panier
     */
    public function getCartCount(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $count = Panier::where('user_id', $user->id)
                ->where('statut', 'actif')
                ->sum('quantite');

            return response()->json([
                'success' => true,
                'count' => $count ?? 0
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du nombre d\'articles', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du nombre d\'articles'
            ], 500);
        }
    }

    /**
     * Méthode privée pour récupérer les données du panier
     */
    private function getPanierData($userId)
    {
        try {
            $panierItems = Panier::with(['produit' => function($query) {
                    $query->select('id', 'nom', 'prix', 'image', 'stock', 'description');
                }])
                ->where('user_id', $userId)
                ->where('statut', 'actif')
                ->orderBy('created_at', 'desc')
                ->get();

            $items = $panierItems->map(function($item) {
                // Vérifier que le produit existe toujours
                if (!$item->produit) {
                    Log::warning('Produit manquant dans le panier', [
                        'panier_id' => $item->id,
                        'produit_id' => $item->produit_id,
                        'user_id' => $item->user_id
                    ]);
                    return null;
                }

                return [
                    'id' => $item->produit_id,
                    'panier_id' => $item->id,
                    'nom' => $item->produit->nom ?? 'Produit indisponible',
                    'description' => $item->produit->description ?? '',
                    'prix' => $item->prix_unitaire,
                    'image' => $item->produit->image ?? null,
                    'stock' => $item->produit->stock ?? 0,
                    'quantite' => $item->quantite,
                    'total' => $item->prix_total,
                    'created_at' => $item->created_at,
                ];
            })->filter(); // Supprime les éléments null

            return [
                'items' => $items->values(), // Réindexe le tableau
                'count' => $panierItems->sum('quantite'),
                'total' => $panierItems->sum('prix_total'),
                'items_count' => $items->count()
            ];
        } catch (\Exception $e) {
            Log::error('Erreur dans getPanierData', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Retourner des données par défaut en cas d'erreur
            return [
                'items' => [],
                'count' => 0,
                'total' => 0,
                'items_count' => 0
            ];
        }
    }
}