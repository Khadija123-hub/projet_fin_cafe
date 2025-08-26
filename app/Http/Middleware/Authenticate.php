<?php


namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Authenticate extends Middleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$guards
     * @return mixed
     */
    public function handle($request, Closure $next, ...$guards)
    {
        if ($request->expectsJson()) {
            if (!Auth::check()) {
                return response()->json([
                    'message' => 'Non authentifié',
                    'status' => 'error'
                ], 401);
            }
        }

        try {
            $this->authenticate($request, $guards);
            return $next($request);
        } catch (\Exception $e) {
            return $this->handleUnauthenticated($request, $guards);
        }
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }

        return route('login');
    }

    /**
     * Handle an unauthenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $guards
     * @return mixed
     */
    protected function handleUnauthenticated($request, array $guards)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Non authentifié',
                'status' => 'error'
            ], 401);
        }

        return redirect()->guest(route('login'));
    }
}