<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use App\Models\Friend;
use App\Http\Resources\FriendResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'data' => [
                'type' => 'users',
                'user_id' => $this->id,
                'attributes' => [
                    'name' => $this->name,
                    'email' => $this->email,
                    'date_of_birth' => $this->date_of_birth,
                    'avatar' => $this->avatar,
                    'gender' => $this->gender,
                ] 
            ],
            'links' => [
                'self' => url('/users/'.$this->id),
            ]
        ];
    }
}
