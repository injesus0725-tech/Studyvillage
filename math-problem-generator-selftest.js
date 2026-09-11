import assert from 'node:assert/strict';
import {auditGeneratedMathProblems} from './server/math-practice.js';

const audit=auditGeneratedMathProblems(1000);
assert.equal(audit.ok,true,`random math generator audit failed: ${audit.errors.join('; ')}`);
assert.ok(audit.families>=40,'all random math families must participate in the audit');
assert.ok(audit.checked>=40000,'the audit must exercise enough random combinations');
console.log(`random math generator audit passed (${audit.checked} problems across ${audit.families} families)`);
