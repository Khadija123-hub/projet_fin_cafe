<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\PasseCommande;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes publiques
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/categories/{id}', [CategorieController::class, 'show']);
Route::get('/categories/{id}/produits', [ProduitController::class, 'getProduitsByCategorieAPI']);
Route::get('/produits', [ProduitController::class, 'index']);

// Routes d'authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Routes protégées pour les utilisateurs authentifiés
Route::middleware(['auth:sanctum'])->group(function () {
    // Routes spécifiques aux clients
    Route::prefix('client')->middleware('role:client')->group(function () {
        Route::get('/profile', [ClientController::class, 'profile']);
        Route::put('/profile', [ClientController::class, 'updateProfile']);
        Route::get('/commandes', [ClientController::class, 'commandes']);
    });

    

    // Routes des commandes
    Route::prefix('commandes')->middleware('role:client')->group(function () {
        Route::get('/', [CommandeController::class, 'index']);
        Route::post('/', [CommandeController::class, 'store']);
        Route::get('/{id}', [CommandeController::class, 'show']);
        Route::patch('/{id}/cancel', [CommandeController::class, 'cancel']);
    });
});

// Routes protégées pour les admins
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::get('/admin/clients', [AdminController::class, 'clients']);
    Route::get('/admin/commandes', [AdminController::class, 'commandes']);
    Route::resource('/admin/produits', AdminController::class);
});









Route::middleware(['auth:sanctum'])->group(function () {
    // Cart routes
    Route::get('/panier', [PanierController::class, 'getCart']);
  
    Route::put('/panier/{produit_id}', [PanierController::class, 'updateCartItem']);
    Route::delete('/panier/{produit_id}', [PanierController::class, 'removeFromCart']);
    Route::delete('/panier', [PanierController::class, 'clearCart']);
    Route::get('/panier/count', [PanierController::class, 'getCartCount']);
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('panier')->group(function () {
        Route::post('/ajouter', [PanierController::class, 'addToCart']);
        // ... other cart routes ...
    });
});


// Routes pour passer une commande (à ajouter dans routes/api.php)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware(['auth:sanctum'])->group(function () {
    // Existing routes
    Route::get('/passer-commande', [PasseCommande::class, 'index']);
    Route::post('/passer-commande', [PasseCommande::class, 'store']);
    Route::get('/passer-commande/{id}', [PasseCommande::class, 'show']);
    Route::get('/mes-commandes', [PasseCommande::class, 'mesCommandes']);
    Route::patch('/commandes/{id}/annuler', [PasseCommande::class, 'annuler']);
    
    // NEW: Add this route for complete order submission
    Route::post('/commandes/complete', [PasseCommande::class, 'storeComplete']);
});

