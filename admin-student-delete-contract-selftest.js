const fs=require('fs');
const assert=require('assert');

const admin=fs.readFileSync('admin.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');

assert.ok(
  admin.includes("if(action==='delete'&&!confirm("),
  '학생 삭제는 교사 확인창을 반드시 거쳐야 합니다.'
);
assert.ok(
  admin.includes("fetch(`/api/admin/player/${encodeURIComponent(name)}`"),
  '학생 삭제 요청은 선택한 학생 이름만 서버에 전달해야 합니다.'
);
assert.ok(
  admin.includes("method:'DELETE'"),
  '학생 삭제 요청은 DELETE 방식이어야 합니다.'
);

// 서버 연결을 추가할 때 반드시 지켜야 할 계약입니다.
const route="app.delete('/api/admin/player/:name',requireAdmin";
if(server.includes(route)){
  for(const required of [
    "DELETE FROM activity_records WHERE player_name=?",
    "DELETE FROM activity_log WHERE player_name=?",
    "DELETE FROM error_reports WHERE player_name=?",
    "DELETE FROM star_ledger WHERE player_name=?",
    "DELETE FROM players WHERE name=?",
    'clearStudentSessions(name)'
  ]){
    assert.ok(server.includes(required),`학생 삭제 서버 정리 누락: ${required}`);
  }
  assert.ok(
    server.includes("compat:stars:"),
    '학생 삭제 시 별 백업 호환 데이터도 함께 정리해야 합니다.'
  );
}

console.log('student delete safety contract self-test passed');
