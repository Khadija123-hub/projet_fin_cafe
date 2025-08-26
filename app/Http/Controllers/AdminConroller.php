<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Afficher la liste des utilisateurs
     */
    public function users()
    {
        $users = User::all();
        return response()->json(['users' => $users]);
    }
    
    /**
     * Afficher la liste des clients
     */
    public function clients()
    {
        $clients = Client::with('user')->get();
        return response()->json(['clients' => $clients]);
    }
    
    /**
     * Afficher la liste des commandes
     */
    public function commandes()
    {
        $commandes = Commande::with(['client', 'produits'])->get();
        return response()->json(['commandes' => $commandes]);
    }
    
    /**
     * Afficher la liste des produits
     */
    public function index()
    {
        $produits = Produit::all();
        return response()->json(['produits' => $produits]);
    }
    
    /**
     * Afficher un produit spécifique
     */
    public function show($id)
    {
        $produit = Produit::findOrFail($id);
        return response()->json(['produit' => $produit]);
    }
    
    /**
     * Créer un nouveau produit
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categorie_id' => 'required|exists:categories,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $produit = Produit::create($request->all());
        
        return response()->json([
            'message' => 'Produit créé avec succès',
            'produit' => $produit
        ], 201);
    }
    
    /**
     * Mettre à jour un produit
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'prix' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'categorie_id' => 'sometimes|required|exists:categories,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $produit = Produit::findOrFail($id);
        $produit->update($request->all());
        
        return response()->json([
            'message' => 'Produit mis à jour avec succès',
            'produit' => $produit
        ]);
    }
    
    /**
     * Supprimer un produit
     */
    public function destroy($id)
    {
        $produit = Produit::findOrFail($id);
        $produit->delete();
        
        return response()->json([
            'message' => 'Produit supprimé avec succès'
        ]);
    }
}