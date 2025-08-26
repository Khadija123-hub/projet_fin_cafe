<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = 'clients';

    // Ajoute 'user_id' pour lier ce client à un utilisateur
    protected $fillable = ['nom', 'email', 'telephone', 'adresse', 'user_id'];

    /**
     * 🔁 Relation : ce client appartient à un utilisateur (User)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 🔁 Relation : un client peut avoir plusieurs commandes
     */
    public function commandes()
    {
        return $this->hasMany(Commande::class, 'client_id');
    }
}