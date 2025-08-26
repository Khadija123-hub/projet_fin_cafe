<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categorie;
use App\Models\Panier;

class Produit extends Model
{
    use HasFactory;
    
    protected $table = 'produits';
    
    protected $fillable = ['nom', 'description', 'prix', 'image', 'stock', 'categorie_id'];
    
    // Relation: un produit appartient à une catégorie
    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
    }
    
    // Relation: un produit peut apparaître dans plusieurs détails de commande
    
public function paniers()
{
    return $this->hasMany(Panier::class);
}
   
}