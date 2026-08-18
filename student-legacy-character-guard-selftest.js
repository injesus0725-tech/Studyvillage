const fs=require('fs'),assert=require('assert');
const guard=fs.readFileSync('assets/student-legacy-character-guard.js','utf8'),html=fs.readFileSync('index.html','utf8'),renderer=fs.readFileSync('avatar-renderer.js','utf8');
assert.ok(html.includes('assets/student-legacy-character-guard.js'),'legacy character guard must load after customize');
assert.ok(html.indexOf('customize.js')<html.indexOf('assets/student-legacy-character-guard.js'),'guard must run after the customize UI exists');
assert.ok(guard.includes("'우주 탐험가'")&&guard.includes("button.textContent.includes('🧑‍🚀')"),'legacy astronaut choices must be detected by both label and icon');
assert.ok(guard.includes("fallback?.click()"),'a selected legacy astronaut must migrate to the default student before removal');
assert.ok(!renderer.includes("'student-hero'")&&!renderer.includes('🧑‍🚀'),'canonical avatar renderer must not render the astronaut base');
console.log('student legacy character guard self-test passed');
