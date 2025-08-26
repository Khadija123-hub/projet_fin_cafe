<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Client;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Constructeur - Applique le middleware d'authentification
     */
    public function __construct()
    {
        // Applique le middleware auth à toutes les méthodes
        $this->middleware('auth');
        
        // Middleware spécifique pour les routes admin
        $this->middleware('role:admin')->only(['admin', 'clients', 'commandes']);
        
        // Middleware spécifique pour les routes client
        $this->middleware('role:client')->only(['client', 'profil', 'mesCommandes']);
    }

    /**
     * Afficher le tableau de bord admin
     */
    public function admin()
    {
        // Vérification supplémentaire pour s'assurer que l'utilisateur est admin
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return redirect()->route('login')->with('error', 'Accès non autorisé.');
        }

        $totalClients = Client::count();
        $totalCommandes = Commande::count();
        $commandesRecentes = Commande::with('client')
                            ->orderBy('created_at', 'desc')
                            ->take(5)
                            ->get();
        
        return view('admin.dashboard', compact('totalClients', 'totalCommandes', 'commandesRecentes'));
    }
    
    /**
     * Afficher la liste des clients pour l'admin
     */
    public function clients()
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return redirect()->route('login')->with('error', 'Accès non autorisé.');
        }

        $clients = Client::with('user')->paginate(10);
        return view('admin.clients', compact('clients'));
    }
    
    /**
     * Afficher la liste des commandes pour l'admin
     */
    public function commandes()
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return redirect()->route('login')->with('error', 'Accès non autorisé.');
        }

        $commandes = Commande::with(['client', 'produits'])
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
        return view('admin.commandes', compact('commandes'));
    }
    
    /**
     * Afficher le tableau de bord client
     */
    public function client()
    {
        // Vérifier si l'utilisateur est connecté
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Vous devez être connecté pour accéder à cette page.');
        }

        $user = Auth::user();
        
        // Vérifier si l'utilisateur a le rôle client
        if ($user->role !== 'client') {
            return redirect()->route('login')->with('error', 'Accès non autorisé.');
        }

        // Vérifier si le client existe
        $client = $user->client;
        if (!$client) {
            return redirect()->route('login')->with('error', 'Profil client introuvable.');
        }

        $totalCommandes = $client->commandes()->count();
        $commandesRecentes = $client->commandes()
                            ->orderBy('created_at', 'desc')
                            ->take(5)
                            ->get();
        
        return view('client.dashboard', compact('client', 'totalCommandes', 'commandesRecentes'));
    }
    
    /**
     * Afficher le profil du client
     */
    public function profil()
    {
        if (!Auth::check() || Auth::user()->role !== 'client') {
            return redirect()->route('login')->with('error', 'Vous devez être connecté comme client.');
        }

        $user = Auth::user();
        $client = $user->client;
        
        if (!$client) {
            return redirect()->route('login')->with('error', 'Profil client introuvable.');
        }
        
        return view('client.profil', compact('client'));
    }
    
    /**
     * Afficher les commandes du client
     */
    public function mesCommandes()
    {
        if (!Auth::check() || Auth::user()->role !== 'client') {
            return redirect()->route('login')->with('error', 'Vous devez être connecté comme client.');
        }

        $user = Auth::user();
        $client = $user->client;
        
        if (!$client) {
            return redirect()->route('login')->with('error', 'Profil client introuvable.');
        }

        $commandes = $client->commandes()
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
        
        return view('client.commandes', compact('commandes'));
    }

    /**
     * Gérer la déconnexion
     */
    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('login')->with('success', 'Vous avez été déconnecté avec succès.');
    }




    // Dans DashboardController.php
public function getProfile()
{
    $user = Auth::user();
    $client = $user->client;
    
    return response()->json([
        'success' => true,
        'profile' => [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'client' => [
                'id' => $client->id,
                'telephone' => $client->telephone,
                'adresse' => $client->adresse,
            ]
        ]
    ]);
}
}