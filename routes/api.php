<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;

Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/categories/{id}/produits', [ProduitController::class, 'getProduitsByCategorieAPI']);