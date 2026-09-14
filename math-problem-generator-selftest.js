import assert from 'node:assert/strict';
import {auditGeneratedMathModes,auditGeneratedMathProblems,randomizeChoiceProblem} from './server/math-practice.js';

const audit=auditGeneratedMathProblems(1000);
assert.equal(audit.ok,true,`random math generator audit failed: ${audit.errors.join('; ')}`);
assert.ok(audit.families>=40,'all random math families must participate in the audit');
assert.ok(audit.checked>=40000,'the audit must exercise enough random combinations');
const modes=auditGeneratedMathModes();
assert.equal(modes.mixedFamilies,modes.totalFamilies,'전체 문제 mode must include every random math family');
assert.ok(modes.focusedFamilies>0&&modes.focusedOnly,'곱셈·나눗셈 mode must contain only multiplication and division families');
assert.ok(modes.focusedUnits.some(unit=>unit.includes('곱셈'))&&modes.focusedUnits.some(unit=>unit.includes('나눗셈')),'곱셈·나눗셈 mode must include both operations');
const source={type:'choice',answerFormat:'choice',options:['첫 보기','둘째 보기','정답 보기','넷째 보기'],answer:2};
const positions=new Set();
for(let i=0;i<200;i++){
  const randomized=randomizeChoiceProblem(source);
  assert.equal(randomized.options[randomized.answer],'정답 보기','choice shuffle must move the answer index with its text');
  assert.deepEqual([...randomized.options].sort(),[...source.options].sort(),'choice shuffle must preserve every option');
  positions.add(randomized.answer);
}
assert.ok(positions.size>=3,'choice answers must appear in multiple numbered positions');
console.log(`random math generator audit passed (${audit.checked} problems across ${audit.families} families)`);
