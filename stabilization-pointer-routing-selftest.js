import assert from 'node:assert/strict';
import fs from 'node:fs';

const onboarding=fs.readFileSync('onboarding.js','utf8');
const movement=fs.readFileSync('student-direct-movement.js','utf8');
assert.ok(!onboarding.includes("document.addEventListener('pointerup'"),'global pointerup interception must stay removed from onboarding');
assert.ok(!onboarding.includes("document.addEventListener('touchend'"),'global touchend interception must stay removed from onboarding');
assert.ok(!onboarding.includes('new KeyboardEvent(')&&!movement.includes('new KeyboardEvent('),'tap movement must not synthesize keyboard events');
assert.ok(movement.includes("world.addEventListener('pointerup'"),'movement input must be scoped to the world');
assert.ok(movement.includes('const interactive=')&&movement.includes('interactive(event.target)'),'interactive controls must be excluded from movement taps');
assert.ok(movement.includes('.mobile-controls,.control-help{display:none!important}'),'legacy direction UI must remain hidden');
assert.ok(movement.includes("window.addEventListener('keydown',blockKeyboard,true)"),'legacy keyboard movement must be blocked at runtime');
assert.ok(onboarding.includes('컴퓨터에서 확인할 때는 마우스로 클릭'),'guide must describe mouse click preview instead of keyboard movement');
assert.ok(onboarding.includes('Movement is owned by student-direct-movement.js'),'onboarding must not silently reclaim movement ownership');
console.log('stabilization pointer routing selftest passed');
