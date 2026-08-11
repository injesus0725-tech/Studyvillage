const fs=require('fs');
const assert=require('assert');

const auth=fs.readFileSync('auth.js','utf8');
const game=fs.readFileSync('game.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');

assert.ok(auth.includes("timedFetch('/api/login'"),'교실 로그인은 서버 /api/login을 사용해야 합니다.');
assert.ok(auth.includes("return{...result,mode:'classroom-server'}"),'서버 로그인 결과의 학생 데이터를 브라우저에 전달해야 합니다.');
assert.ok(game.includes('if(auth.player)applyRecord(auth.player)'),'로그인 성공 시 서버에서 받은 학생 기록을 즉시 적용해야 합니다.');
assert.ok(server.includes('player:safePlayer(row)'),'로그인 응답은 서버에 저장된 학생 프로필을 반환해야 합니다.');
for(const field of ['totalScore','xp','level','baseCharacter','inventory','equipment','activities']){
  assert.ok(server.includes(field),`서버 학생 프로필에 ${field} 데이터가 포함되어야 합니다.`);
}
assert.ok(auth.includes('if(await checkServer())return serverLogin(name,password)'),'교실 서버가 있으면 태블릿 로컬 계정보다 서버 로그인을 우선해야 합니다.');

console.log('student cross-device profile contract self-test passed');
