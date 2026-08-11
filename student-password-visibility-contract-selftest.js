const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('index.html','utf8');
const auth=fs.readFileSync('auth.js','utf8');

assert.ok(/id="player-password"[^>]*type="password"/.test(html),'학생 비밀번호 입력은 기본적으로 숨김 상태여야 합니다.');
assert.ok(auth.includes("player-password-visibility"),'비밀번호 보기 토글이 필요합니다.');
assert.ok(auth.includes("checkbox.checked?'text':'password'"),'사용자가 선택했을 때만 비밀번호를 보여야 합니다.');
assert.ok(!/localStorage\.setItem\([^\n]*password[^H]/i.test(auth),'평문 비밀번호를 localStorage에 저장하면 안 됩니다.');

console.log('student password visibility contract self-test passed');
