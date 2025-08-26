<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Vérifier si l'utilisateur est authentifié et a le bon rôle
        if ($request->user() && $request->user()->role === $role) {
            return $next($request);
        }

        // Si c'est une requête API, retourner une réponse JSON
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Accès non autorisé.'
            ], 403);
        }

        // Sinon, rediriger vers la page d'accueil ou de connexion
        return redirect()->route('login')->with('error', 'Accès non autorisé.');
    }
}