const fs=require('fs');
const admin=fs.readFileSync('admin.js','utf8');
const edit=fs.readFileSync('admin-student-edit.js','utf8');
const html=fs.readFileSync('admin.html','utf8');
const server=fs.readFileSync('server/server.js','utf8');

const checks=[
  [admin.includes('data-action="password"'),'관리자 화면의 학생 비밀번호 변경 버튼이 필요합니다.'],
  [admin.includes('/reset-password'),'학생 비밀번호 변경 UI가 관리자 API를 호출해야 합니다.'],
  [server.includes("/api/admin/player/:name/reset-password"),'서버에 관리자 전용 학생 비밀번호 변경 API가 필요합니다.'],
  [edit.includes('data-xp-name'),'학생 XP 수정 버튼과 단일 처리기가 필요합니다.'],
  [edit.includes('/xp')&&server.includes("/api/admin/player/:name/xp"),'XP 수정의 UI·서버 경로가 일치해야 합니다.'],
  [edit.includes('data-title-name'),'학생 칭호 수정 버튼과 단일 처리기가 필요합니다.'],
  [edit.includes('/custom-title')&&server.includes("/api/admin/player/:name/custom-title"),'칭호 수정의 UI·서버 경로가 일치해야 합니다.'],
  [edit.includes('data-rename-name'),'학생 이름 수정 버튼과 단일 처리기가 필요합니다.'],
  [edit.includes('/rename')&&server.includes("/api/admin/player/:name/rename"),'이름 수정의 UI·서버 경로가 일치해야 합니다.'],
  [edit.includes('data-equipment-name'),'꾸미기 복구 버튼과 단일 처리기가 필요합니다.'],
  [edit.includes('/reset-equipment')&&server.includes("/api/admin/player/:name/reset-equipment"),'꾸미기 복구의 UI·서버 경로가 일치해야 합니다.'],
  [server.includes('requireAdmin'),'학생 계정 변경 API는 관리자 인증으로 보호되어야 합니다.'],
  [admin.includes('reset-record'),'관리자 화면의 성장 초기화 호출 경로가 필요합니다.'],
  [server.includes('/reset-record')||server.includes("/api/admin/players/:name/reset"),'서버의 성장 초기화 경로가 필요합니다.'],
  [html.indexOf('admin-student-edit.js')>html.indexOf('admin.js'),'학생 편집 확장 스크립트는 기본 관리자 화면 뒤에 로드되어야 합니다.'],
  [!html.includes('assets/admin-runtime-fixes.js'),'학생 편집 버튼을 중복 가로채는 구형 런타임 보강 스크립트를 관리자 화면에 로드하면 안 됩니다.']
];

const failures=checks.filter(([ok])=>!ok).map(([,message])=>message);
if(failures.length){
  console.error('admin student account contract gaps:');
  failures.forEach(message=>console.error(`- ${message}`));
  process.exitCode=1;
}else{
  console.log('admin student account single-handler contract self-test passed');
}
