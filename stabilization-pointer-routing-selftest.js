import assert from 'node:assert/strict';
import fs from 'node:fs';

const src=fs.readFileSync('onboarding.js','utf8');
assert.ok(!src.includes("document.addEventListener('pointerup'"),'global pointerup interception must stay removed');
assert.ok(!src.includes("document.addEventListener('touchend'"),'global touchend interception must stay removed');
assert.ok(!src.includes('new KeyboardEvent('),'tap movement must not synthesize keyboard events');
assert.ok(src.includes("world.addEventListener('pointerup'"),'movement input must be scoped to the world');
assert.ok(src.includes('isInteractiveTarget'),'interactive controls must be excluded from movement taps');
assert.ok(src.includes('.mobile-controls,.control-help{display:none!important}'),'legacy direction UI must remain hidden');
assert.ok(src.includes('컴퓨터에서 학생 화면을 확인할 때는 마우스로 클릭'),'guide must describe mouse click preview instead of keyboard movement');
console.log('stabilization pointer routing selftest passed');
