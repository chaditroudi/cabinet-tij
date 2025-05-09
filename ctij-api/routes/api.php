<?php

use App\Http\Controllers\API\InterpreteController;
use App\Http\Controllers\API\LangueController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('enable-2fa', [AuthController::class, 'enableTwoFactor']);
    Route::post('verify-2fa', [AuthController::class, 'verifyTwoFactor']);

    
    // Protected routes with 2FA
    Route::middleware('2fa')->group(function () {
        Route::get('profile', [AuthController::class, 'getUser']);
        Route::post('update-profile', [AuthController::class, 'updateProfile']);
    });
});
Route::get(uri: '/interpretes/filter', action: [InterpreteController::class, 'filter']);
Route::get(uri: '/interpretes/stats', action: [InterpreteController::class, 'getTotals']);

Route::apiResource(name: 'langues', controller: LangueController::class);

Route::apiResource(name: 'interpretes', controller: InterpreteController::class);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
