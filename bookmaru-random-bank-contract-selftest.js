const fs=require('fs');
const assert=require('assert');
const game=fs.readFileSync('library-game.js','utf8');
const data=fs.readFileSync('question-data.js','utf8');

assert.ok(game.includes("const ACTIVITY_ID='vocabulary',ROUND_SIZE=5"),'Bookmaru must draw five questions per challenge during stabilization');
assert.ok(game.includes('const allSets=()=>Object.values(window.StudyVillageQuestionSets||{}).filter(set=>set?.bookmaru!==false'),'Bookmaru must aggregate eligible registered question sets');
assert.ok(game.includes('_sourceActivityId:set.activityId,_sourceNumber:i+1'),'Bookmaru questions must retain source identity for teacher overrides');
assert.ok(game.includes('const buildRound=bank=>shuffle(bank).slice(0,Math.min(ROUND_SIZE,bank.length)).map(randomizeQuestion)'),'Bookmaru must draw a random bounded round');
assert.ok(game.includes('const correct=item.options[Number(item.answer)],options=shuffle(item.options)'),'choice options must be shuffled with their answer preserved');
assert.ok(game.includes('questions:questions.map(cloneQuestion)'),'the selected random round must be saved in the checkpoint');
assert.ok(game.includes('questions=saved.questions'),'resuming must restore the same selected round');
assert.ok(game.includes('questions=buildRound(questionBank)'),'a new challenge must create a fresh random round');
assert.ok(game.includes('/api/question-overrides'),'Bookmaru must load teacher question overrides');
assert.ok(game.includes('invalid question override ignored'),'invalid teacher overrides must fail safely');
assert.ok(game.includes('수수께끼·어휘·상식·교과 문제'),'the student guide must describe the cumulative mixed question bank');
assert.ok((data.match(/category:'어휘'/g)||[]).length===5,'the bundled starter questions must remain categorized for future guide additions');

console.log('Bookmaru random cumulative bank contract self-test passed');
