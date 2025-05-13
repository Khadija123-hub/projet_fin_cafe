<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;
    
    protected $table = 'clients';
    protected $fillable = ['nom', 'email', 'telephone', 'adresse'];
    
    // Relation avec les commandes
    public function commandes()
    {
        return $this->hasMany(Commande::class, 'client_id');
    }
}