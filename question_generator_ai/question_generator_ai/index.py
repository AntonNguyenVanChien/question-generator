import pandas as pd

import pickle as cPickle
from pathlib import Path
import re

def dumpPickle(fileName, content):
    pickleFile = open(fileName, 'wb')
    cPickle.dump(content, pickleFile, -1)
    pickleFile.close()

def loadPickle(fileName):    
    file = open(fileName, 'rb')
    content = cPickle.load(file)
    file.close()
    
    return content
    
def pickleExists(fileName):
    file = Path(fileName)
    
    if file.is_file():
        return True
    
    return False

import spacy
from spacy import displacy
nlp = spacy.load('vi_core_news_lg')

from gensim.models import KeyedVectors
word2vec = KeyedVectors.load_word2vec_format('keyword.model.bin', binary=True)
        
#Extract answers and the sentence they are in
def extractAnswers(qas, doc):
    answers = []

    senStart = 0
    senId = 0

    for sentence in doc.sents:
        senLen = len(sentence.text)

        for answer in qas:
            answerStart = answer['answers'][0]['answer_start']

            if (answerStart >= senStart and answerStart < (senStart + senLen)):
                answers.append({'sentenceId': senId, 'text': answer['answers'][0]['text']})

        senStart += senLen
        senId += 1
    
    return answers

#TODO - Clean answers from stopwords?
def tokenIsAnswer(token, sentenceId, answers):
    for i in range(len(answers)):
        if (answers[i]['sentenceId'] == sentenceId):
            if (answers[i]['text'] == token):
                return True
    return False

def getSentenceStartIndexes(doc):
    senStarts = []
    
    for sentence in doc.sents:
        senStarts.append(sentence[0].i)
    
    return senStarts
    
def getSentenceForWordPosition(wordPos, senStarts):
    for i in range(1, len(senStarts)):
        if (wordPos < senStarts[i]):
            return i - 1
        
def addWordsForParagrapgh(newWords, text):
    doc = nlp(text)

    senStarts = getSentenceStartIndexes(doc)
    
    #index of word in spacy doc text
    i = 0
    
    while (i < len(doc)):
        if ((doc[i].is_stop == False and doc[i].is_alpha == False and len(doc[i].text) > 1) or doc[i].text.isdigit()):
            word = doc[i]

            currentSentence = getSentenceForWordPosition(i, senStarts)
            wordLen = 1

            newWords.append([word.text, 0, 0, currentSentence, wordLen, None, word.pos_, word.tag_, word.dep_, word.shape_])
            
        i += 1
        
def blankAnswer(firstTokenIndex, lastTokenIndex, sentStart, sentEnd, doc):
    leftPartStart = doc[sentStart].idx
    leftPartEnd = doc[firstTokenIndex].idx
    rightPartStart = doc[lastTokenIndex].idx + len(doc[lastTokenIndex])
    rightPartEnd = doc[sentEnd - 1].idx + len(doc[sentEnd - 1])
    
    question = doc.text[leftPartStart:leftPartEnd] + '.........' + doc.text[rightPartStart:rightPartEnd]
    
    return question

def addIdQuestionToKeywords(answers, text):
    doc = nlp(text)
    currAnswerIndex = 0
    qaPair = []

    #Check wheter each token is the next answer
    indexG = 0
    for sent in doc.sents:
        for token in sent:
            
            if currAnswerIndex >= len(answers):
                break
            
            answerDoc = nlp(answers[currAnswerIndex]['word'])
            answerIsFound = True
            
            for j in range(len(answerDoc)):
                if token.i + j >= len(doc) or doc[token.i + j].text != answerDoc[j].text:
                    answerIsFound = False
            
            if answerIsFound:
                qaPair.append({'idQues' : indexG, 'word': answers[currAnswerIndex]['word'], 'prob': answers[currAnswerIndex]['prob']})
                
                currAnswerIndex += 1
        indexG +=1 
                
    return qaPair

        
def generateKeywords(text, count):
    words = []
    addWordsForParagrapgh(words, text)
    wordColums = ['text', 'titleId', 'paragrapghId', 'sentenceId','wordCount', 'NER', 'POS', 'TAG', 'DEP','shape']
    df = pd.DataFrame(words, columns=wordColums)

    columnsToEncode = ['NER', 'POS', "TAG", 'DEP']

    for column in columnsToEncode:
        print(column)
        one_hot = pd.get_dummies(df[column])
        one_hot = one_hot.add_prefix(column + '_')

        df = df.drop(column, axis = 1)
        df = df.join(one_hot)

    predictorFeaturesName = 'nb-predictor-features.pkl'
    predictorColumns = loadPickle(predictorFeaturesName)

    wordsDf = pd.DataFrame(columns=predictorColumns)

    for column in wordsDf.columns:
        if (column in df.columns):
            wordsDf[column] = df[column]
        else:
            wordsDf[column] = 0

    wordsDf = wordsDf.drop(['isAnswer'], axis = 1)

    predictorPickleName = 'nb-predictor.pkl'
    predictor = loadPickle(predictorPickleName)

    y_pred = predictor.predict_proba(wordsDf)

    labeledAnswers = []
    for i in range(len(y_pred)):
        labeledAnswers.append({'word': str(df.iloc[i]['text']).replace("_", " "), 'prob': y_pred[i][0]})
        
    
    labeledAnswersAddId = addIdQuestionToKeywords(labeledAnswers, text)
        
    sorted_labeledAnswers = sorted(labeledAnswersAddId, key=lambda x: x['prob'], reverse=True)
    
    
    seen_words = set()
    result_sorted_labeledAnswers = []

    for item in sorted_labeledAnswers:
        word = item['word']
        idQues = item['idQues']
        if word not in seen_words and all(existing_item['idQues'] >= idQues for existing_item in result_sorted_labeledAnswers):
            seen_words.add(word)
            result_sorted_labeledAnswers.append(item)
        
    doc = nlp(text)
    list_sent = []
    indexG = 0
    for sent in doc.sents:
        list_sent.append({'sent': str(sent).replace("_", " "), 'indexSent': indexG})
        indexG+=1
        
    #listInfoAnswer = {'sent': text, 'listAnswer': labeledAnswers[:10]}
    listInfoAnswer = {'listSent': list_sent, 'listAnswer': result_sorted_labeledAnswers[:count]}
        
    return listInfoAnswer

def addQuestiontoList(text, answersInfo):
    doc = nlp(text)
    currAnswerIndex = 0
    qa = []
    
    
    for info in answersInfo:
        get_sentence = str(list(doc.sents)[info['indexSent']]).replace("_", " ")
               
        answer = info['word']
    
        start_index = get_sentence.find(answer)
        blank_question = get_sentence[:start_index] + "___" + get_sentence[start_index + len(answer):]
        
        answer_dis = str(nlp(answer))
        
        print(answer_dis)
        
        list_answer_distractor = []
        if answer_dis in word2vec.key_to_index:
            
            similar_words = word2vec.most_similar(answer_dis, topn=3)
            list_answer_distractor = [word.replace("_", " ") for word, similarity in similar_words]
        
        qa.append({'question' : blank_question, 'answer': answer, 'list_distractor': list_answer_distractor})

    return qa
        
import contextlib
from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/api")
@cross_origin()
def hello():
    return json.dumps('Hello world!')

@app.route("/keyword", methods=["POST"])
@cross_origin()
def keyword():

    requestJson = json.loads(request.data)
    text = requestJson['text']
    
    count = int(requestJson['count'])
    
    result = generateKeywords(text, count)
    
    return json.dumps(result)

@app.route("/generate", methods=["POST"])
@cross_origin()
def generate():
    requestJson = json.loads(request.data)
    text = requestJson['text']
    listKeyword = requestJson['listKeyword']
    
    result = addQuestiontoList(text, listKeyword)
    
    return json.dumps(result)


if __name__ == '__main__':
    app.run(debug=True)

   
    
    

        
        
