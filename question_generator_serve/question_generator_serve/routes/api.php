<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiUserController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/ 

Route::post('/register', 'App\Http\Controllers\ApiUserController@register');
Route::post('/login', 'App\Http\Controllers\ApiUserController@login');
Route::post('/logout', 'App\Http\Controllers\ApiUserController@logout')->middleware('auth:api');
Route::post('users/register',[ApiUserController::class, 'register']);
Route::middleware('auth:api')->group(function () {

    Route::get('/user/auth', 'App\Http\Controllers\UserController@userAuth');

    Route::apiResources([
      '/question-bank' => 'App\Http\Controllers\QuestionBankController',
    ]); 

    Route::apiResources([
      '/question-to-bank' => 'App\Http\Controllers\QuestionToBankController',
    ]);

    Route::apiResources([
      '/question' => 'App\Http\Controllers\QuestionController',
    ]);
  
}); 

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
