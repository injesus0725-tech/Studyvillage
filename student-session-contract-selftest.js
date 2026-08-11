const fs=require('fs');
const session=fs.readFileSync('student-session.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const required=[
  "button.textContent='👤 학생 바꾸기'",
  'window.StudyVillageAuth.clearSession();',
  'location.reload();',
  '이미 저장된 기록과 풀던 문제의 임시 기록은 지워지지 않습니다.'
];
for(const text of required){if(!session.includes(text))throw new Error(`student switch safety missing: ${text}`)}
if(!session.includes('if(!confirm('))throw new Error('student switch must require confirmation');
if(!index.includes('<script src="student-session.js"></script>'))throw new Error('student-session.js must be loaded by index.html');
const files=pkg.build?.files||[];
if(!files.includes('student-session.js'))throw new Error('student-session.js must be packaged');
if(/clearCheckpoint|localStorage\.clear|sessionStorage\.clear/.test(session))throw new Error('student switch must not clear saved activity checkpoints or all browser storage');
require('./student-cross-device-data-contract-selftest.js');
console.log('student session switch contract self-test passed');
