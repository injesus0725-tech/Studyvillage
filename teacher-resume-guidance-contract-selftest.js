const fs=require('fs');
const assert=require('assert');

const connect=fs.readFileSync('connect.html','utf8');

for(const token of [
  '상태와 학생 접속 주소 다시 확인',
  '서버 상태 확인 중',
  '학생 접속 주소 확인 중',
  "document.querySelector('#refresh').onclick=load"
]){
  assert.ok(connect.includes(token),`connect.html 복귀 안내/새로고침 흐름 누락: ${token}`);
}

console.log('teacher resume recovery guidance contract self-test passed');
