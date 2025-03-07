<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use App\Http\Resources\QuestionResource;

class QuestionController extends Controller
{
    public function show(Question $question) {
        return new QuestionResource($question);
    }

    public function update(Question $question) {

        $data = request()->validate([
            'question' => 'required',
            'answer' => 'required',
            'distractor1' => 'required',
            'distractor2' => 'required',
            'distractor3' => 'required',
        ]);

        $qas = Question::findOrFail($question->id);

        $bankId = $qas->bank_id;

        $qas->update([
            'question' => $data['question'],
            'answer' => $data['answer'],
            'distractor1' => $data['distractor1'],
            'distractor2' => $data['distractor2'],
            'distractor3' => $data['distractor3'],
            'bank_id' => $bankId,
        ]);

        return response()->json("Update Successfull", 200);
    }

    public function destroy(Question $question) {
        $question->delete();
        return response()->json("Delete Successfull", 200);
    }
}
