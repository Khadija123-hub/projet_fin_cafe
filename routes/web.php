
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Routes traditionnelles pour les vues Laravel
Route::get('/produits', [ProduitController::class, 'index']);
//Route::get('/produits/boissons', [ProduitController::class, 'afficherBoissons']);
//Route::get('/produits/matieres-premieres', [ProduitController::class, 'afficherMatieresPremières']);
//Route::get('/produits/{type}', [ProduitController::class, 'afficherParType']);

// Route pour les accès directs à la base de données (pas pour l'API)
Route::get('/api/categories/{id}/produits', [ProduitController::class, 'getProduitsByCategorieAPI']);


// Route pour l'application React SPA
Route::get('/{path?}', function () {
    return view('app');
})->where('path', '.*');