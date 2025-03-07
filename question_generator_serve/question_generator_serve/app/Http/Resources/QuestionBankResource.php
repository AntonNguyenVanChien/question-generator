<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuestionBankResource extends JsonResource
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
                'type' => 'question_bank',
                'question_bank_id' => $this->id,
                'attributes' => [
                    'topic' => $this->topic,
                    'questions' => new QuestionCollection($this->questions),
                    'questionCount' => count($this->questions)
                ]
            ],
            'links' => [
            ]
        ];
    }
}
