<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'date_commande',
        'statut',
        'total'
    ];

 

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec le client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // Relation avec les détails de commande
    public function details()
    {
        return $this->hasMany(DetailsCommande::class);
    }

    // Scopes pour filtrer par statut
    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en attente');
    }

    public function scopeConfirmee($query)
    {
        return $query->where('statut', 'confirmée');
    }

 
}