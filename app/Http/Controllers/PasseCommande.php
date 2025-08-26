<?php

namespace App\Http\Controllers;
use App\Models\Client;
use App\Models\Commande;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Models\DetailsCommande;
use Exception;
use Illuminate\Http\Request;

class PasseCommande extends Controller
{

    /**
     * Afficher les informations nécessaires pour passer une commande
     */
    public function index()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Récupérer les articles du panier
            $panierItems = DB::table('paniers')
                ->join('produits', 'paniers.produit_id', '=', 'produits.id')
                ->where('paniers.user_id', $user->id)
                ->where('paniers.statut', 'actif')
                ->select(
                    'paniers.id as panier_id',
                    'paniers.produit_id',
                    'paniers.quantite',
                    'paniers.prix_unitaire',
                    'paniers.prix_total',
                    'produits.nom',
                    'produits.description',
                    'produits.image',
                    'produits.stock'
                )
                ->get();

            if ($panierItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Votre panier est vide'
                ], 400);
            }

            // Vérifier la disponibilité du stock
            $stockErrors = [];
            foreach ($panierItems as $item) {
                if ($item->quantite > $item->stock) {
                    $stockErrors[] = [
                        'produit' => $item->nom,
                        'demande' => $item->quantite,
                        'disponible' => $item->stock
                    ];
                }
            }

            if (!empty($stockErrors)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant pour certains produits',
                    'errors' => $stockErrors
                ], 400);
            }

            // Calculer le total
            $total = $panierItems->sum('prix_total');

            // Récupérer les informations du client
            $client = DB::table('clients')
                ->where('user_id', $user->id)
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $panierItems,
                    'total' => $total,
                    'count' => $panierItems->count(),
                    'client' => $client,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer une nouvelle commande
     */
    public function store(Request $request)
    {
        // Validation des données - MODIFIÉE pour inclure date_livraison
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string|max:500',
            'date_livraison' => 'required|date|after:today', // AJOUTÉ
            'mode_paiement' => 'nullable|string|in:especes,carte,virement',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantite' => 'required|integer|min:1',
            'items.*.prix_unitaire' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données de validation invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            DB::beginTransaction();

            // Créer ou mettre à jour le client
            $clientData = [
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'adresse' => $request->adresse,
                'updated_at' => now()
            ];

            $client = Client::where('user_id', $user->id)->first();

            if ($client) {
                // Mettre à jour le client existant
                $client->update($clientData);
                $clientId = $client->id;
            } else {
                // Créer un nouveau client
                $clientData['user_id'] = $user->id;
                $clientData['created_at'] = now();
                $client = Client::create($clientData);
                $clientId = $client->id;
            }

            // Calculer le total
            $total = collect($request->items)->sum(function($item) {
                return $item['quantite'] * $item['prix_unitaire'];
            });

            // Créer la commande
            $commande = Commande::create([
                'user_id' => $user->id,
                'client_id' => $clientId,
                'date_commande' => now(),
                'statut' => 'en attente',
                'total' => $total,
            ]);

            // Créer les détails de la commande et mettre à jour le stock
            foreach ($request->items as $item) {
                // Insérer dans details_commandes
                DetailsCommande::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $item['produit_id'],
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $item['prix_unitaire'],
                ]);

                // Mettre à jour le stock
                DB::table('produits')
                    ->where('id', $item['produit_id'])
                    ->decrement('stock', $item['quantite']);
            }

            // Créer la livraison - MODIFIÉE pour inclure toutes les colonnes
            DB::table('livraisons')->insert([
                'commande_id' => $commande->id,
                'nom' => $request->nom,                           // AJOUTÉ
                'email' => $request->email,                       // AJOUTÉ
                'telephone' => $request->telephone,               // AJOUTÉ
                'adresse_livraison' => $request->adresse,         // MODIFIÉ (était 'adresse')
                'date_livraison' => $request->date_livraison,     // AJOUTÉ
                'note' => $request->notes,                        // MODIFIÉ (était 'notes')
                'statut_livraison' => 'en attente',              // MODIFIÉ (était 'statut')
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Marquer les articles du panier comme commandés
            DB::table('paniers')
                ->where('user_id', $user->id)
                ->where('statut', 'actif')
                ->update([
                    'statut' => 'commande',
                    'updated_at' => now()
                ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Commande créée avec succès',
                'data' => [
                    'commande_id' => $commande->id,
                    'total' => $total,
                    'statut' => 'en attente',
                    'date_commande' => now()->format('Y-m-d H:i:s'),
                    'date_livraison' => $request->date_livraison    // AJOUTÉ
                ]
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la commande: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une commande spécifique
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Récupérer la commande avec ses détails
            $commande = DB::table('commandes')
                ->join('clients', 'commandes.client_id', '=', 'clients.id')
                ->leftJoin('livraisons', 'commandes.id', '=', 'livraisons.commande_id') // AJOUTÉ
                ->where('commandes.id', $id)
                ->where('commandes.user_id', $user->id)
                ->select(
                    'commandes.*',
                    'clients.nom as client_nom',
                    'clients.email as client_email',
                    'clients.telephone as client_telephone',
                    'clients.adresse as client_adresse',
                    // AJOUTÉ - informations de livraison
                    'livraisons.date_livraison',
                    'livraisons.statut_livraison',
                    'livraisons.note as livraison_note'
                )
                ->first();

            if (!$commande) {
                return response()->json([
                    'success' => false,
                    'message' => 'Commande non trouvée'
                ], 404);
            }

            // Récupérer les détails de la commande
            $details = DB::table('details_commandes')
                ->join('produits', 'details_commandes.produit_id', '=', 'produits.id')
                ->where('details_commandes.commande_id', $id)
                ->select(
                    'details_commandes.*',
                    'produits.nom as produit_nom',
                    'produits.description as produit_description',
                    'produits.image as produit_image'
                )
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'commande' => $commande,
                    'details' => $details
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la commande: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lister toutes les commandes de l'utilisateur
     */
    public function mesCommandes()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $commandes = DB::table('commandes')
                ->join('clients', 'commandes.client_id', '=', 'clients.id')
                ->leftJoin('livraisons', 'commandes.id', '=', 'livraisons.commande_id') // AJOUTÉ
                ->where('commandes.user_id', $user->id)
                ->select(
                    'commandes.id',
                    'commandes.date_commande',
                    'commandes.statut',
                    'commandes.total',
                    'clients.nom as client_nom',
                    // AJOUTÉ - informations de livraison
                    'livraisons.date_livraison',
                    'livraisons.statut_livraison'
                )
                ->orderBy('commandes.date_commande', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $commandes
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des commandes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Annuler une commande (si elle est encore en attente)
     */
    public function annuler($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            DB::beginTransaction();

            // Vérifier que la commande existe et appartient à l'utilisateur
            $commande = DB::table('commandes')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->where('statut', 'en attente')
                ->first();

            if (!$commande) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Commande non trouvée ou ne peut pas être annulée'
                ], 404);
            }

            // Récupérer les détails pour restaurer le stock
            $details = DB::table('details_commandes')
                ->where('commande_id', $id)
                ->get();

            // Restaurer le stock
            foreach ($details as $detail) {
                DB::table('produits')
                    ->where('id', $detail->produit_id)
                    ->increment('stock', $detail->quantite);
            }

            // Mettre à jour le statut de la commande
            DB::table('commandes')
                ->where('id', $id)
                ->update([
                    'statut' => 'annulée',
                    'updated_at' => now()
                ]);

            // Mettre à jour le statut de livraison - AJOUTÉ
            DB::table('livraisons')
                ->where('commande_id', $id)
                ->update([
                    'statut_livraison' => 'annulée',
                    'updated_at' => now()
                ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Commande annulée avec succès'
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'annulation de la commande: ' . $e->getMessage()
            ], 500);
        }
    }
}