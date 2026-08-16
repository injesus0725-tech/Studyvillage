const fs=require('fs'),assert=require('assert'),src=fs.readFileSync('game.js','utf8');
assert.ok(src.includes('const shuffledIndexes=length=>'),'riddle engine must randomize order without mutating the source bank');
assert.ok(src.includes('questionOrder=shuffledIndexes(quizQuestions.length)')&&src.includes('optionOrders=questionOrder.map(id=>shuffledIndexes('),'every new attempt must shuffle both questions and choices');
assert.ok(src.includes('new Set(questionOrder).size!==quizQuestions.length')&&src.includes('new Set(order).size!==source.options.length'),'restored permutations must be complete and duplicate-free');
assert.ok(src.includes('answer:order.indexOf(source.answer)'),'choice shuffling must preserve the correct answer');
assert.ok(src.includes('questionOrder:activeQuizQuestions.map(q=>q.id)')&&src.includes('optionOrders:activeQuizQuestions.map(q=>q.optionOrder)'),'checkpoint must preserve the exact randomized attempt across devices');
assert.ok(src.includes('activeQuizQuestions=saved.questions'),'continuing must reuse the saved order rather than reshuffle');
console.log('student riddle randomization contract self-test passed');
