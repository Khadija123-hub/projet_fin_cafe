<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function detailsCommandes()
    {
        return $this->hasMany(DetailsCommande::class, 'produit_id');
    }
}