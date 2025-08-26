<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Produit;
use App\Models\DetailsCommande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
    /**
     * Enregistrer une nouvelle commande
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'produits' => 'required|array|min:1',
                'produits.*.id' => 'required|exists:produits,id',
                'produits.*.quantite' => 'required|integer|min:1',
                'adresse_livraison' => 'required|string|max:255',
                'telephone_contact' => 'required|string|max:20',
                'date_livraison' => 'nullable|date|after:today'
            ]);

            DB::beginTransaction();

            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Vérifier que l'utilisateur est un client
            if ($user->role !== 'client') {
                return response()->json([
                    'success' => false,
                    'message' => 'Seuls les clients peuvent passer des commandes'
                ], 403);
            }

            // Calculer le total de la commande et vérifier les stocks
            $total = 0;
            $produitsDetails = [];

            foreach ($request->produits as $produitData) {
                $produit = Produit::find($produitData['id']);
                if (!$produit) {
                    throw new \Exception("Produit non trouvé: ID " . $produitData['id']);
                }
                
                // Vérifier le stock si disponible
                if (isset($produit->stock) && $produit->stock < $produitData['quantite']) {
                    throw new \Exception("Stock insuffisant pour " . $produit->nom . ". Stock disponible: " . $produit->stock);
                }
                
                $sousTotal = $produit->prix * $produitData['quantite'];
                $total += $sousTotal;
                
                $produitsDetails[] = [
                    'produit' => $produit,
                    'quantite' => $produitData['quantite'],
                    'sous_total' => $sousTotal
                ];
            }

            // Créer la commande - UTILISER user_id de façon cohérente
            $commande = Commande::create([
                'user_id' => $user->id, // ✅ Utiliser user_id de façon cohérente
                'adresse_livraison' => $request->adresse_livraison,
                'telephone_contact' => $request->telephone_contact,
                'date_livraison' => $request->date_livraison ?? now()->addDays(3),
                'statut' => 'en_attente',
                'total' => $total
            ]);

            // Créer les détails de commande
            foreach ($produitsDetails as $detail) {
                $produit = $detail['produit'];
                
                // Utiliser la table pivot si elle existe
                if (method_exists($commande, 'produits')) {
                    $commande->produits()->attach($produit->id, [
                        'quantite' => $detail['quantite'],
                        'prix_unitaire' => $produit->prix,
                        'sous_total' => $detail['sous_total']
                    ]);
                }

                // Mettre à jour le stock si la colonne existe
                if (isset($produit->stock)) {
                    $produit->decrement('stock', $detail['quantite']);
                }
            }

            DB::commit();

            // Charger la commande avec ses produits pour la réponse
            $commandeComplete = Commande::with('produits')->find($commande->id);

            return response()->json([
                'success' => true,
                'message' => 'Commande créée avec succès',
                'data' => [
                    'commande_id' => $commande->id,
                    'total' => $total,
                    'statut' => $commande->statut,
                    'commande' => $commandeComplete
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur création commande: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = auth()->user();
            $commande = Commande::with(['produits'])
                ->where('user_id', $user->id) // ✅ Cohérent avec store()
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $commande
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Commande non trouvée'
            ], 404);
        }
    }

    public function cancel($id)
    {
        try {
            $user = auth()->user();
            $commande = Commande::where('user_id', $user->id) // ✅ Cohérent
                ->where('statut', 'en_attente')
                ->findOrFail($id);

            $commande->update(['statut' => 'annulee']);

            return response()->json([
                'success' => true,
                'message' => 'Commande annulée avec succès',
                'commande' => $commande
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'annuler cette commande'
            ], 400);
        }
    }

    /**
     * Lister les commandes du client connecté
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $commandes = Commande::with('produits')
                ->where('user_id', $user->id) // ✅ Cohérent
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $commandes
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur récupération commandes: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des commandes'
            ], 500);
        }
    }
}
