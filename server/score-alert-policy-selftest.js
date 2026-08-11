import assert from 'node:assert/strict';
import { classifyScoreLedgerEntry, normalizeScoreAlertPolicy, scoreAlertPolicyDefaults } from './score-alert-policy.js';

assert.deepEqual(scoreAlertPolicyDefaults(),{duplicateWindowMs:5000,largeXpDelta:200,largeActivityScoreDelta:1000,largeTotalScoreDelta:2000});
assert.equal(normalizeScoreAlertPolicy({duplicateWindowMs:10}).duplicateWindowMs,1000);
assert.equal(classifyScoreLedgerEntry({source:'teacher-correction',delta:5000}).suppressed,true);
assert.deepEqual(classifyScoreLedgerEntry({field:'xp',scope:'player',delta:250,createdAt:'2026-08-11T00:00:00Z'}).reasons,['한 번에 큰 XP 변화']);
assert.deepEqual(classifyScoreLedgerEntry({scope:'activity',field:'score',delta:1200,createdAt:'2026-08-11T00:00:00Z'}).reasons,['활동 점수의 큰 단일 변화']);
assert.deepEqual(classifyScoreLedgerEntry({scope:'player',field:'score',delta:-50,createdAt:'2026-08-11T00:00:00Z'}).reasons,['예상 밖 감소']);
const prev={playerName:'가람',scope:'activity',activityId:'vocabulary',field:'score',delta:100,createdAt:'2026-08-11T00:00:00Z'};
const next={...prev,createdAt:'2026-08-11T00:00:03Z'};
assert.equal(classifyScoreLedgerEntry(next,prev).reasons.includes('짧은 시간 안에 동일 증감 반복'),true);
assert.equal(classifyScoreLedgerEntry({...next,createdAt:'2026-08-11T00:00:08Z'},prev).reasons.includes('짧은 시간 안에 동일 증감 반복'),false);
console.log('score alert policy selftest: ok');
