const fs=require('fs');
const src=fs.readFileSync('admin.js','utf8');
const guard=fs.readFileSync('admin-network-guard.js','utf8');
const required=[
  "restoreFile.addEventListener('change'",
  "if(!confirm(`선택한 백업 파일(${file.name})로 복원할까요?`))return",
  "restoring=true",
  "restoreButton.disabled=true"
];
for(const text of required){
  if(!src.includes(text))throw new Error(`restore confirmation contract missing: ${text}`);
}
const confirmAt=src.indexOf("if(!confirm(`선택한 백업 파일(${file.name})로 복원할까요?`))return");
const fetchAt=src.indexOf("fetch('/api/admin/restore'",confirmAt);
if(confirmAt<0||fetchAt<0||confirmAt>fetchAt)throw new Error('restore request must remain behind teacher confirmation');
if(!guard.includes("response?.status===401&&!isLoginUrl(url)"))throw new Error('restore admin 401 must use shared session expiry handling');
if(!guard.includes("sessionStorage.removeItem('studyvillage-admin-token')"))throw new Error('restore auth expiry must clear the stale admin token');
console.log('restore confirmation contract self-test passed');
