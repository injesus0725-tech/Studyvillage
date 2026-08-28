const fs=require('fs'),assert=require('assert');
const policy=fs.readFileSync('server/activity-attempt-settings.js','utf8');
const ui=fs.readFileSync('assets/student-exploration-v2-subject-ui.js','utf8');
for(const id of ['riddle-demo','exploration-korean','exploration-social','exploration-science','exploration-random']){
  assert.ok(policy.includes(`'${id}':Object.freeze({mode:'limited'`)&&new RegExp(`'${id}'.{0,120}xpMode:'every-attempt'`).test(policy),`${id} must reward every teacher-allowed fresh completion`);
}
assert.ok(!policy.includes("'exploration-forest-riddle'"),'legacy standalone riddle forest policy must be retired');
assert.ok(!policy.includes("'exploration-mountain-riddle'"),'legacy standalone riddle mountain policy must be retired');
assert.ok(policy.includes('REPEAT_XP_ACTIVITIES.has(id)')&&policy.includes("xpMode:'every-attempt'"),'saved first-completion settings must migrate to repeat XP for normal learning activities');
assert.ok(ui.includes("filters.querySelector('[data-subject=\"수수께끼\"]')?.remove()"),'standalone riddle filter must be removed');
assert.ok(ui.includes("list.querySelectorAll('[data-exp*=\"riddle\"]')"),'standalone riddle cards must be removed');
console.log('repeat XP and riddle integration contract self-test passed');
