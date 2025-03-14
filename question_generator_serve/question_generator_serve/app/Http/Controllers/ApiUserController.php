<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ApiRegisterRequest;
use App\Http\Requests\ApiLoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ApiUserController extends Controller
{
    public function register(Request $request) {
        
        $user = new User;
        $user->fill($request->all());
        $user->password = Hash::make($request->password);

    
        $user->save(); 
       
        return response()->json($user);
    }

    public function login(Request $request) {
         if (Auth::attempt([
            'email' => $request->email, 
            'password' => $request->password
        ])) {
            $user = User::whereEmail($request->email)->first();
            $user->token = $user->createToken('App')->accessToken;
            return response()->json($user);
        }

        return response()->json([
            'Error' => 'Email or Password Not Correct !!!',
        ], 401);
    }

    public function logout(Request $request) {
        $request->user()->token()->revoke();
        return response()->json([
            'Success' => 'Logout Successfull',
        ], 200);
    }

    public function userProfile(Request $request) {
        return response()->json($request->user('api'));
    }
}
