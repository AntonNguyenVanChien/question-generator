<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuestionBank;
use App\Http\Resources\QuestionBankCollection;
use App\Http\Resources\QuestionBankResource;

use Illuminate\Http\Response;

class QuestionBankController extends Controller
{
    public function index(Request $request) {
        $qb = $request->user()->questionBank ;

        return new QuestionBankCollection($qb);
    }

    public function show(QuestionBank $questionBank) {
        return new QuestionBankResource($questionBank);
    }

    public function store() {
        $data = request()->validate([
            'topic' => 'required',
        ]);

        $questionBank = QuestionBank::create([
            'user_id' => auth()->user()->id,
            'topic' => $data['topic'],
        ]);

        return response()->json(['data' => new QuestionBankResource($questionBank)], Response::HTTP_CREATED);
    }

    public function update(QuestionBank $questionBank) {

        $data = request()->validate([
            'topic' => 'required',
        ]);
        
        $userId = request()->user()->id;

        $bank = QuestionBank::findOrFail($questionBank->id);

        $bank->update([
            'user_id' => $userId,
            'topic' => $data['topic'],
        ]);

        return response()->json("Update Successfull", 200);
    }

    public function destroy(QuestionBank $questionBank) {
        $questionBank->delete();
        return response()->json("Delete Successfull", 200);
    }
}
