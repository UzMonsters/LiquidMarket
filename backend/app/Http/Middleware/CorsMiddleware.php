<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        $origin = $request->header('Origin');
        $allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://frontend:3000',
        ];

        if ($origin && (in_array($origin, $allowedOrigins) || preg_match('/^http:\/\/\d+\.\d+\.\d+\.\d+:3000$/', $origin))) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400');

        return $response;
    }
}
