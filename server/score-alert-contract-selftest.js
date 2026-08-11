import assert from 'node:assert/strict';
import fs from 'node:fs';

const route=fs.readFileSync(new URL('./score-alert-route.js',import.meta.url),'utf8');
const ui=fs.readFileSync(new URL('../admin-score-alerts.js',import.meta.url),'utf8');

assert.match(route,/app\.get\('\/api\/admin\/score-alerts'/);
for(const token of ['playerName','activityId','beforeValue','afterValue','delta','createdAt','reviewStatus','reviewNote','correctionId','correctionBeforeValue','correctionAfterValue','undoneAt','reasons','pendingCount'])assert.ok(route.includes(token),`score alert route missing ${token}`);
for(const token of ['/api/admin/score-alerts?limit=400','reviewStatus','correctionId','reasons','pendingCount'])assert.ok(ui.includes(token),`admin score alert UI contract missing ${token}`);
assert.ok(route.includes("decision.suppressed&&!review.reviewStatus"),'reviewed suppressed entries must remain visible');
assert.ok(route.includes("decision.priority==='none'&&!review.reviewStatus"),'reviewed non-alert entries must remain visible');
console.log('score alert admin contract selftest: ok');
