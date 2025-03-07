<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Friend;

use App\Http\Resources\UserResource;
use App\Http\Resources\UserFriendCollection;



class UserController extends Controller
{
    public function show(User $user) {
        return new UserResource($user);
    }

    public function userAuth(Request $request) {
        return new UserResource($request->user());
    }
}
