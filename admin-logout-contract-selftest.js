const fs=require('fs');
const src=fs.readFileSync('admin-logout.js','utf8');
const html=fs.readFileSync('admin.html','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const required=[
  "button.id='admin-logout-button'",
  "button.textContent='🔒 로그아웃'",
  "confirm('관리자 화면에서 로그아웃할까요?",
  "sessionStorage.removeItem('studyvillage-admin-token')",
  'location.reload()'
];
for(const text of required){
  if(!src.includes(text))throw new Error(`teacher logout contract missing: ${text}`);
}
if(!html.includes('<script src="admin-logout.js"></script>'))throw new Error('admin.html must load admin-logout.js');
if(!(pkg.build?.files||[]).includes('admin-logout.js'))throw new Error('admin-logout.js must be packaged');
if(/localStorage\.clear\(|sessionStorage\.clear\(/.test(src))throw new Error('teacher logout must only remove the admin token');
console.log('teacher logout contract self-test passed');
