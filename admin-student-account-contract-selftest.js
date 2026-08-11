const fs=require('fs');
const admin=fs.readFileSync('admin.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');

const checks=[
  [admin.includes('data-action="password"'),'관리자 화면의 학생 비밀번호 변경 버튼이 필요합니다.'],
  [admin.includes('/reset-password'),'관리자 화면이 학생 비밀번호 변경 API를 호출해야 합니다.'],
  [server.includes("/api/admin/player/:name/reset-password")||server.includes("/api/admin/players/:name/reset-password"),'서버에 관리자 전용 학생 비밀번호 변경 API가 필요합니다.'],
  [server.includes('requireAdmin'),'학생 계정 변경 API는 관리자 인증으로 보호되어야 합니다.'],
  [admin.includes('reset-record'),'관리자 화면의 성장 초기화 호출 경로가 필요합니다.'],
  [server.includes('/reset-record')||server.includes("/api/admin/players/:name/reset"),'서버의 성장 초기화 경로가 필요합니다.']
];

const failures=checks.filter(([ok])=>!ok).map(([,message])=>message);
if(failures.length){
  console.error('admin student account contract gaps:');
  failures.forEach(message=>console.error(`- ${message}`));
  process.exitCode=1;
}else{
  console.log('admin student account contract self-test passed');
}
