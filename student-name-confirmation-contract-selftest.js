const fs=require('fs');
const assert=require('assert');

const auth=fs.readFileSync('auth.js','utf8');

assert.ok(auth.includes('studyvillage-known-student-names'),'확인한 학생 이름 목록을 기기에 기억해야 합니다.');
assert.ok(auth.includes('confirmUnfamiliarName'),'처음 보는 학생 이름은 로그인 전에 확인해야 합니다.');
assert.ok(auth.includes('이름을 잘못 입력하면 새 학생 계정이 만들어질 수 있어요'),'학생이 이름 오타 위험을 이해할 수 있는 안내가 필요합니다.');
assert.ok(auth.includes('rememberName(name)'),'정상 로그인한 학생 이름은 다음부터 반복 확인하지 않게 기억해야 합니다.');
assert.ok(!/KNOWN_NAMES_KEY[^\n]*password/i.test(auth),'이름 확인 목록에 비밀번호를 저장하면 안 됩니다.');

console.log('student name confirmation contract self-test passed');
