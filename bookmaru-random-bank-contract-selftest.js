const fs=require('fs');
const assert=require('assert');
const game=fs.readFileSync('library-game.js','utf8');
const data=fs.readFileSync('question-data.js','utf8');

assert.ok(game.includes("const ACTIVITY_ID='vocabulary',ROUND_SIZE=7"),'Bookmaru must draw seven questions per daily challenge');
assert.ok(game.includes('일곱 문제에 도전해요'),'the student guide must describe the seven-question challenge');
assert.ok(game.includes('const allSets=()=>Object.values(window.StudyVillageQuestionSets||{}).filter(set=>set?.bookmaru===true'),'Bookmaru must aggregate only explicitly approved vocabulary sets');
assert.ok(game.includes('_sourceActivityId:set.activityId,_sourceNumber:i+1'),'Bookmaru questions must retain source identity for teacher overrides');
assert.ok(game.includes('const buildRound=bank=>shuffle(bank).slice(0,Math.min(ROUND_SIZE,bank.length)).map(randomizeQuestion)'),'Bookmaru must draw a random bounded round');
assert.ok(game.includes('const correct=item.options[Number(item.answer)],options=shuffle(item.options)'),'choice options must be shuffled with their answer preserved');
assert.ok(game.includes('const percentScore=(correct,total)=>'),'seven-question scoring must normalize to a 0-100 percentage');
assert.ok(game.includes('score=percentScore(correctCount,questions.length)'),'Bookmaru must avoid fixed twenty-point scoring assumptions');
assert.ok(game.includes('correctCount,total:questions.length,questions:questions.map(cloneQuestion)'),'the selected random round and correct count must be saved in the checkpoint');
assert.ok(game.includes('questions=saved.questions'),'resuming must restore the same selected round');
assert.ok(game.includes('correctCount=saved.correctCount'),'resuming must restore the correct-answer count');
assert.ok(game.includes("if(!Number.isInteger(savedCorrect))savedCorrect=Math.round"),'legacy five-question checkpoints must migrate safely');
assert.ok(game.includes('questions=buildRound(questionBank)'),'a new challenge must create a fresh random round');
assert.ok(game.includes('/api/question-overrides'),'Bookmaru must load teacher question overrides');
assert.ok(game.includes('if(!row||!validQuestion(row))return base'),'invalid teacher overrides must fail safely');
assert.ok(game.includes('국어에서 만난 어려운 낱말의 뜻'),'the student guide must describe the vocabulary-only bank');
assert.ok(data.includes('bookmaru:true')&&data.includes('bookmaru:false'),'question sets must explicitly opt in or out of Bookmaru');
assert.ok(!game.includes('score+=20'),'Bookmaru scoring must not retain fixed five-question increments');
assert.ok(!game.includes('score/20'),'Bookmaru result counts must not depend on five-question scoring');
assert.ok((data.match(/category:'어휘'/g)||[]).length===5,'the bundled starter questions must remain categorized for future guide additions');

console.log('Bookmaru seven-question vocabulary bank contract self-test passed');
