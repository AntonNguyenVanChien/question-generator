<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

class QuestionToBankController extends Controller
{
    public function store(Request $request) {

        foreach ($request->listBank as $bank) {
            foreach ($request->listQuestion as $lquestion) {
                
                $distractor1 = '';
                $distractor2 = '';
                $distractor3 = '';

                $distractor1 = count($lquestion['list_distractor']) >= 1 ? $lquestion['list_distractor'][0] : '';
                $distractor2 = count($lquestion['list_distractor']) >= 2 ? $lquestion['list_distractor'][1] : '';
                $distractor3 = count($lquestion['list_distractor']) >= 3 ? $lquestion['list_distractor'][2] : '';

                $questions = Question::create([
                    'question' => $lquestion['question'],
                    'answer' => $lquestion['answer'],
                    'distractor1' => $distractor1,
                    'distractor2' => $distractor2,
                    'distractor3' => $distractor3,
                    'type' => 0,
                    'bank_id' => $bank,
                ]);
            }
        }

        return $request->listBank;
    }

}
