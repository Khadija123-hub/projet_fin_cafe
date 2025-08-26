<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('panier', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // ID de l'utilisateur
            $table->unsignedBigInteger('produit_id'); // ID du produit
            $table->integer('quantite')->default(1); // Quantité du produit
            $table->decimal('prix_unitaire', 10, 2); // Prix unitaire au moment de l'ajout
            $table->decimal('prix_total', 10, 2); // Prix total (quantité * prix_unitaire)
            $table->enum('statut', ['actif', 'commande', 'supprime'])->default('actif');
            $table->timestamps();

            // Clés étrangères
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');

            // Index pour optimiser les performances
            $table->index(['user_id', 'statut']);
            $table->index('produit_id');
            
            // Contrainte unique pour éviter les doublons (un utilisateur ne peut avoir qu'une entrée par produit)
            $table->unique(['user_id', 'produit_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('panier');
    }
};