<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\DashboardController;

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

// Routes d'accueil
Route::get('/', function () {
    return view('app');
});

// Routes protégées pour l'administration
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/', [DashboardController::class, 'admin'])->name('admin.dashboard');
    Route::get('/produits', [ProduitController::class, 'adminIndex'])->name('admin.produits');
    Route::get('/clients', [DashboardController::class, 'clients'])->name('admin.clients');
    Route::get('/commandes', [DashboardController::class, 'commandes'])->name('admin.commandes');
});

// Routes protégées pour les clients
Route::middleware(['auth', 'role:client'])->prefix('client')->group(function () {
    Route::get('/', [DashboardController::class, 'client'])->name('client.dashboard');
    Route::get('/profil', [DashboardController::class, 'profil'])->name('client.profil');
    Route::get('/commandes', [DashboardController::class, 'mesCommandes'])->name('client.commandes');
});

// Route pour l'application React SPA - doit être en dernier pour éviter les conflits
Route::get('/{path?}', function () {
    return view('app');
})->where('path', '.*')->name('spa');

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});