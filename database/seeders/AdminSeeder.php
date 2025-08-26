<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Vérifie s'il existe déjà un admin pour éviter les doublons
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'Administrateur',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'), // ⚠️ change le mot de passe en prod
                'role' => 'admin',
            ]);
        }
    }
}
