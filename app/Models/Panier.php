<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Panier extends Model
{
    use HasFactory;

    protected $table = 'paniers'; // Cohérent avec votre contrôleur qui utilise 'panier'

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'produit_id',
        'quantite',
        'prix_unitaire',
        'prix_total',
        'statut'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'prix_unitaire' => 'decimal:2',
        'prix_total' => 'decimal:2',
        'quantite' => 'integer',
        'user_id' => 'integer',
        'produit_id' => 'integer',
    ];

    /**
     * Relation avec le modèle User
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /**
     * Relation avec le modèle Produit
     */
    public function produit()
    {
        return $this->belongsTo(\App\Models\Produit::class);
    }

    /**
     * Scope pour les éléments actifs du panier
     */
    public function scopeActif($query)
    {
        return $query->where('statut', 'actif');
    }

    /**
     * Scope pour un utilisateur spécifique
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Mutateur pour calculer automatiquement le prix total
     */
    public function setPrixTotalAttribute($value)
    {
        $this->attributes['prix_total'] = $this->quantite * $this->prix_unitaire;
    }

    /**
     * Accesseur pour formater le prix unitaire
     */
    public function getPrixUnitaireFormatteAttribute()
    {
        return number_format($this->prix_unitaire, 2, ',', ' ') . ' €';
    }

    /**
     * Accesseur pour formater le prix total
     */
    public function getPrixTotalFormatteAttribute()
    {
        return number_format($this->prix_total, 2, ',', ' ') . ' €';
    }
}