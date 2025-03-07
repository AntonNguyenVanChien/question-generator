<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
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
                'type' => 'question',
                'question_id' => $this->id,
                'attributes' => [
                    'question' => $this->question,
                    'answer' => $this->answer,
                    'distractor1' => $this->distractor1,
                    'distractor2' => $this->distractor2,
                    'distractor3' => $this->distractor3,
                ]
            ]
        ];
    }
}
