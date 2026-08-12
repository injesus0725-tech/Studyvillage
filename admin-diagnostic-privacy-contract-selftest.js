const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-errors.js','utf8');

assert.ok(src.includes("privacyNotice:'Passwords, authentication tokens, request bodies, password hashes, salts, equipment details, and the local database file path are excluded from this diagnostic export.'"),'진단 파일에 민감정보 제외 안내가 필요합니다.');
assert.ok(src.includes("safePlayers=players.map(p=>({name:p.name,level:p.level,xp:p.xp,totalScore:p.totalScore,attempts:p.attempts,bestScore:p.bestScore,lastScore:p.lastScore,loginCount:p.loginCount,lastLoginAt:p.lastLoginAt,activities:p.activities}))"),'학생 진단 정보는 필요한 학습 상태만 선별해서 내보내야 합니다.');
assert.ok(src.includes("dataStoreDetected:!!healthResult.data?.dataPath"),'DB 실제 경로 대신 데이터 저장소 감지 여부만 내보내야 합니다.');
assert.ok(!src.includes('passwordHash:p.passwordHash'),'학생 비밀번호 해시는 진단 파일에 포함하면 안 됩니다.');
assert.ok(!src.includes('salt:p.salt'),'학생 비밀번호 salt는 진단 파일에 포함하면 안 됩니다.');
assert.ok(!src.includes('token:token()'),'관리자 토큰은 진단 파일에 포함하면 안 됩니다.');

console.log('admin diagnostic privacy contract self-test passed');
