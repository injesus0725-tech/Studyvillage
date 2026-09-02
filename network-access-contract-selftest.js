/* v1.9 classroom QR address ranking + manual selector contract. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const server=fs.readFileSync(new URL('./server/network-access.js',import.meta.url),'utf8');
const installer=fs.readFileSync(new URL('./server/question-review.js',import.meta.url),'utf8');
const connect=fs.readFileSync(new URL('./connect.html',import.meta.url),'utf8');
const electron=fs.readFileSync(new URL('./electron/main.cjs',import.meta.url),'utf8');

for(const token of ['VIRTUAL_HINTS','PHYSICAL_HINTS','isPrivateIpv4','recommended','recommendation','parseWindowsPowerShell','Get-NetIPConfiguration','node+windows-powershell+ipconfig']){
  if(!server.includes(token))throw new Error(`network-access.js: missing ${token}`);
}
if(/continue;[^\n]*VIRTUAL_HINTS/.test(server)||/filter\([^\n]*VIRTUAL_HINTS/.test(server))throw new Error('network-access.js: virtual adapters must be ranked, not discarded');
if(!server.includes("app.get('/api/network'"))throw new Error('network-access.js: /api/network route missing');
if(!server.includes('recommendedUrl'))throw new Error('network-access.js: recommendedUrl must remain in API response');
if(!installer.includes('installNetworkAccessRoute'))throw new Error('question-review.js: ranked network route is not installed');
for(const token of ['학생용 접속 주소 직접 선택','address-select','use-address','studyvillage.classroomUrl']){
  if(!connect.includes(token))throw new Error(`connect.html: manual classroom address selection missing ${token}`);
}
if(!connect.includes('자동 추천')||!connect.includes('다른 접속 주소'))throw new Error('connect.html: recommended/fallback QR guidance missing');
if(!connect.includes("fetch('/api/network'"))throw new Error('connect.html: network address list is not loaded from /api/network');
assert.ok(electron.includes('FIREWALL_RULE')&&electron.includes('localport=3000')&&electron.includes('profile=private,domain'),'electron: classroom TCP 3000 firewall access must be requested on Windows');
assert.ok(electron.includes("writeRuntimeError('firewall-rule-unavailable'"),'electron: firewall setup failures must be written to runtime diagnostics');

console.log('network access contract selftest passed');
