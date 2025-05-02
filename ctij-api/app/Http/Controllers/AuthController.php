<?php 
namespace App\Http\Controllers;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Laravel\Fortify\Fortify;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use PragmaRX\Google2FA\Google2FA;

class AuthController extends Controller
{

    //register 
    public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('YourAppName')->plainTextToken;


    
    return response()->json([
        'message' => 'User successfully registered',
        'user' => $user,
        'token' => $token
    ], 201);
}

    // Login
 
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
    
        $this->throttleLoginAttempts($request);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'The provided credentials are incorrect.'], 401);
        }
    
        // Generate access token
        $accessToken = $user->createToken('api-token')->plainTextToken;



        
    // Create a refresh token for the user
    $refreshToken = new RefreshToken([
        'user_id' => $user->id,
        'token' => Str::random(60),
        'expires_at' => now()->addDays(30), // Refresh token expires in 30 days
    ]);
    $refreshToken->save();
    
     
    
        return response()->json([
            'message' => 'Login successful',
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => 3600,
            'user' => $user,
        ]);

    }


    public function logout(Request $request)
    {
        $user = $request->user();
    
        // Delete all tokens
        $user->tokens()->delete();
    
        // Delete refresh token
        RefreshToken::where('user_id', $user->id)->delete();
    
        $user->update(['two_factor_verified' => false]);
    
        return response()->json(['message' => 'Logged out successfully']);
    }
    

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
        ]);

        $request->user()->update($request->only('name', 'email'));
        return response()->json($request->user());
    }

    public function enableTwoFactor(Request $request)
    {
        $user = $request->user();
        $google2fa = app(abstract: 'pragmarx.google2fa');
    
        $secret = $google2fa->generateSecretKey();
        $user->google2fa_secret = Crypt::encryptString($secret);
        $user->save();
    
        $QRUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );
    
        return response()->json([
            'message' => '2FA enabled successfully',
            'qr_url' => $QRUrl,
            'secret' => $secret,
        ]);

    }

    public function verifyTwoFactor(Request $request)
    {
        $request->validate([
            'one_time_password' => 'required|numeric',
        ]);
    
        $user = $request->user();
        $google2fa = app('pragmarx.google2fa');
    
        $secret = Crypt::decryptString($user->google2fa_secret);
    
        if ($google2fa->verifyKey($secret, $request->one_time_password)) {
            $user->two_factor_verified = true;
            $user->save();
    
            return response()->json(['message' => '2FA verified successfully']);
        }
    
        return response()->json(['message' => 'Invalid 2FA code'], 401);
    }
    

    // Get User Profile
    public function getUser(Request $request)
    {
        return response()->json($request->user());
    }

    // Throttle login attempts (rate limiting)
    private function throttleLoginAttempts(Request $request)
    {
        $key = 'login|' . $request->ip();
        RateLimiter::for('login', function () use ($key) {
            return RateLimiter::perMinute(5)->by($key);
        });

        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                Fortify::username() => ['Too many login attempts. Please try again later.'],
            ]);
        }

        RateLimiter::hit($key);
    }





    public function refresh(Request $request)
    {
        // Validate the refresh token
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $refreshToken = RefreshToken::where('token', $request->refresh_token)->first();

        if (!$refreshToken || $refreshToken->expires_at < now()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired refresh token',
                'code' => 'INVALID_REFRESH_TOKEN',
                'expires_at' => $refreshToken ? $refreshToken->expires_at : null,
            ], 401);
        }

        // Create a new access token for the user
        $user = $refreshToken->user;
        $newAccessToken = $user->createToken('api-token')->plainTextToken;

        // Optionally create a new refresh token
        $newRefreshToken = new RefreshToken([
            'user_id' => $user->id,
            'token' => Str::random(60),
            'expires_at' => now()->addDays(30),
        ]);
        $newRefreshToken->save();

        // Delete the old refresh token
        $refreshToken->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Token refreshed successfully',
            'data' => [
                'access_token' => $newAccessToken,
                'refresh_token' => $newRefreshToken->token,
                'token_type' => 'Bearer',
                'expires_in' => 3600, // Access token expiry in seconds (1 hour)
                'refresh_token_expires_at' => $newRefreshToken->expires_at,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'two_factor_enabled' => !is_null($user->google2fa_secret),
                    'two_factor_verified' => $user->two_factor_verified,
                ]
            ]
        ], 200);
    }

}
