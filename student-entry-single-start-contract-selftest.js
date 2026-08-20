const fs=require('fs'),assert=require('assert');
const buildings=fs.readFileSync('building-interiors.js','utf8');
const gate=fs.readFileSync('activity-gate.js','utf8');
const math=fs.readFileSync('math-practice.js','utf8');
const library=fs.readFileSync('library-game.js','utf8');
const game=fs.readFileSync('game.js','utf8');
const expedition=fs.readFileSync('assets/expedition-entry-guard.js','utf8');
const hub=fs.readFileSync('assets/student-study-menu.js','utf8');

assert.ok(buildings.includes("studyvillage:open-math-practice")&&buildings.includes("studyvillage:open-library-game"),'buildings must delegate learning starts to their activity entry points instead of duplicating activity logic');
assert.ok(gate.includes('const pending=new Set()')&&gate.includes('if(pending.has(id))return false'),'bookmaru and riddle gate checks must suppress repeated entry while validation is pending');
assert.ok(math.includes('if(busy)return')&&math.includes('busy=true'),'math start/save flow must suppress overlapping requests');
assert.ok(library.includes('if(opening||!panel.hidden)return')&&library.includes('if(saving)return'),'bookmaru must suppress duplicate open and duplicate finish requests');
assert.ok(game.includes('quizAnswered')&&game.includes('if(state.quizAnswered)return'),'legacy riddle answering must be single-submit per question');
assert.ok(expedition.includes('approvedStatus')&&expedition.includes('consumeApproved(input)'),'expedition preflight allowance must be reused rather than fetched twice for one click');
assert.ok(expedition.includes("button.dataset.expeditionStarting='true'")&&expedition.includes('holdUntilTransition(button)'),'expedition start must remain locked during the asynchronous transition');
assert.ok(hub.includes('if(saving)return;saving=true'),'expedition result save must suppress duplicate completion submissions');
console.log('student cross-activity single-start contract self-test passed');
