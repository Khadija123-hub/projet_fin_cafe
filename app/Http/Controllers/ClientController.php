<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Commande;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    public function profile(Request $request)
    {
        try {
            $user = $request->user();
            return response()->json([
                'success' => true,
                'client' => $user,
                'message' => 'Profil récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur récupération profil: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Impossible de récupérer le profil'
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'telephone' => 'nullable|string|max:20',
                'adresse' => 'nullable|string|max:255',
            ]);

            $user->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour profil: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Impossible de mettre à jour le profil'
            ], 500);
        }
    }

    public function commandes(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Utilisateur non authentifié'
                ], 401);
            }

            // ✅ FIXED: Utiliser user_id de façon cohérente avec CommandeController
            $commandes = Commande::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            if ($commandes->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'commandes' => [],
                    'message' => 'Aucune commande trouvée'
                ]);
            }

            // Charger les produits si la relation existe
            try {
                $commandesWithProducts = $commandes->load(['produits' => function($query) {
                    $query->select('produits.id', 'nom', 'prix', 'image');
                }]);

                $formattedCommandes = $commandesWithProducts->map(function ($commande) {
                    return [
                        'id' => $commande->id,
                        'created_at' => $commande->created_at,
                        'statut' => $commande->statut ?? 'en_attente',
                        'total' => $commande->total ?? 0,
                        'adresse_livraison' => $commande->adresse_livraison ?? '',
                        'telephone_contact' => $commande->telephone_contact ?? '',
                        'date_livraison' => $commande->date_livraison ?? null,
                        'produits' => $commande->produits ? $commande->produits->map(function ($produit) {
                            $pivot = $produit->pivot ?? null;
                            return [
                                'id' => $produit->id,
                                'nom' => $produit->nom ?? 'Produit inconnu',
                                'prix_unitaire' => $pivot ? $pivot->prix_unitaire : ($produit->prix ?? 0),
                                'quantite' => $pivot ? $pivot->quantite : 1,
                                'sous_total' => $pivot ? $pivot->sous_total : ($produit->prix ?? 0),
                                'image' => $produit->image ?? null,
                                'pivot' => $pivot
                            ];
                        }) : []
                    ];
                });

                return response()->json([
                    'success' => true,
                    'commandes' => $formattedCommandes,
                    'message' => 'Commandes récupérées avec succès'
                ]);

            } catch (\Exception $relationError) {
                Log::warning('Erreur chargement relations produits: ' . $relationError->getMessage());
                
                $simpleCommandes = $commandes->map(function ($commande) {
                    return [
                        'id' => $commande->id,
                        'created_at' => $commande->created_at,
                        'statut' => $commande->statut ?? 'en_attente',
                        'total' => $commande->total ?? 0,
                        'adresse_livraison' => $commande->adresse_livraison ?? '',
                        'telephone_contact' => $commande->telephone_contact ?? '',
                        'date_livraison' => $commande->date_livraison ?? null,
                        'produits' => []
                    ];
                });

                return response()->json([
                    'success' => true,
                    'commandes' => $simpleCommandes,
                    'message' => 'Commandes récupérées (sans détails produits)'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Erreur récupération commandes: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Impossible de récupérer les commandes',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
