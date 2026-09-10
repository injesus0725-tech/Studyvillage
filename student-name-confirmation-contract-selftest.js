const fs=require('fs');
const assert=require('assert');

const auth=fs.readFileSync('auth.js','utf8'),html=fs.readFileSync('index.html','utf8');

assert.ok(auth.includes('studyvillage-known-student-names'),'확인한 학생 이름 목록을 기기에 기억해야 합니다.');
assert.ok(!auth.includes('confirmUnfamiliarName')&&!auth.includes('처음 사용하는 이름이에요.'),'iPad에서 보이지 않는 동기식 이름 확인 팝업이 로그인을 막으면 안 됩니다.');
assert.ok(html.includes('처음 입력한 이름과 비밀번호로 계정이 만들어집니다.'),'동기식 팝업 없이 로그인 화면에서 새 계정 생성 가능성을 안내해야 합니다.');
assert.ok(auth.includes('rememberName(name)'),'정상 로그인한 학생 이름은 다음부터 반복 확인하지 않게 기억해야 합니다.');
assert.ok(!/KNOWN_NAMES_KEY[^\n]*password/i.test(auth),'이름 확인 목록에 비밀번호를 저장하면 안 됩니다.');

console.log('student name confirmation contract self-test passed');
