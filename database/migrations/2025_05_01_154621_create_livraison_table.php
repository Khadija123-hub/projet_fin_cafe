<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLivraisonTable extends Migration
{
    public function up()
    {
        Schema::create('livraison', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes');
            $table->text('adresse_livraison');
            $table->date('date_livraison');
            $table->string('statut_livraison', 50)->default('préparation');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('livraison');
    }
}
