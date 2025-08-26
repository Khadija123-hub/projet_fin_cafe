<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Gérer une demande de connexion
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,
            'redirect' => $user->role === 'admin' ? '/admin' : '/commender'
        ]);
    }

    /**
     * Gérer une demande d'inscription
     */
    public function register(Request $request)
    {
        // Journaliser les données reçues pour le débogage (à retirer en production)
        Log::info('Données reçues:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email|unique:clients,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols() // Ajout de symboles pour plus de sécurité
            ],
            'nom' => 'required|string|max:255',
            'telephone' => ['required', 'string', 'max:20', 'regex:/^[0-9+\-\s()]*$/'],
            'adresse' => 'required|string|max:255',
        ], [
            'password.min' => 'Le mot de passe doit comporter au moins 8 caractères.',
            'password.mixed_case' => 'Le mot de passe doit contenir au moins une majuscule et une minuscule.',
            'password.numbers' => 'Le mot de passe doit contenir au moins un chiffre.',
            'password.symbols' => 'Le mot de passe doit contenir au moins un symbole.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'telephone.regex' => 'Le numéro de téléphone contient des caractères non autorisés.',
        ]);

        if ($validator->fails()) {
            Log::info('Erreurs de validation:', $validator->errors()->toArray());
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                // Loguer avant la création de l'utilisateur
                Log::info('Tentative de création d\'utilisateur');
                
                $user = User::create([
                    'name' => trim($request->name),
                    'email' => strtolower(trim($request->email)),
                    'password' => Hash::make($request->password),
                    'role' => 'client',
                ]);
                
                // Loguer après la création de l'utilisateur
                Log::info('Utilisateur créé avec succès:', ['id' => $user->id]);
                
                // Loguer avant la création du client
                Log::info('Tentative de création du client');
                
                $client = Client::create([
                    'nom' => trim($request->nom),
                    'email' => strtolower(trim($request->email)),
                    'telephone' => trim($request->telephone),
                    'adresse' => trim($request->adresse),
                    'user_id' => $user->id,
                ]);
                
                // Loguer après la création du client
                Log::info('Client créé avec succès:', ['id' => $client->id]);
                
                $token = $user->createToken('auth_token')->plainTextToken;
                
                return response()->json([
                    'status' => 'success',
                    'message' => 'Inscription réussie',
                    'user' => $user,
                    'client' => $client,
                    'token' => $token,
                    'redirect' => '/commender' // Redirection vers la page des commandes pour les nouveaux clients
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Erreur d\'inscription détaillée: ' . $e->getMessage());
            Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'inscription',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur est survenue'
            ], 500);
        }
    }

    /**
     * Déconnecter l'utilisateur (révoquer le token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Déconnexion réussie',
            'redirect' => '/login'
        ]);
    }
}