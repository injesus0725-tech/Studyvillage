const fs = require('fs');
const assert = require('assert');

const ranking = fs.readFileSync('assets/student-stability-fixes.js', 'utf8');
const css = fs.readFileSync('avatar-assets.css', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

assert.ok(ranking.includes('class="sv-rank-effect"'), 'student ranking must create the effect layer');
assert.ok(/"outfit",\s*"effect",/.test(ranking), 'student ranking must paint equipped effects');
assert.ok(css.includes('[data-avatar-item^="pet-"] img'), 'student pet images must share the authored master canvas');
assert.ok(css.includes('transform: none !important'), 'student pet artwork must not receive an extra transform');
assert.ok(index.includes('avatar-assets.css?v=20260909sparkle1'), 'student avatar CSS cache key must be current');
assert.ok(index.includes('student-stability-fixes.js?v=20260909studentpet2'), 'student ranking cache key must be current');
assert.ok(css.includes('.avatar-effect {')&&css.includes('z-index: 0 !important'), 'effects must render behind the character and pet');
assert.ok(css.includes('animation: studyvillage-effect-sparkle 2.4s'), 'static effect PNGs must use the lightweight sparkle animation');

console.log('student pet and ranking effect contract self-test passed');
