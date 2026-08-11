/* v1.9 classroom QR address ranking contract. */
import fs from 'node:fs';

const server=fs.readFileSync(new URL('./server/network-access.js',import.meta.url),'utf8');
const installer=fs.readFileSync(new URL('./server/question-review.js',import.meta.url),'utf8');
const connect=fs.readFileSync(new URL('./connect.html',import.meta.url),'utf8');

for(const token of ['VIRTUAL_HINTS','PHYSICAL_HINTS','isPrivateIpv4','recommended','recommendation']){
  if(!server.includes(token))throw new Error(`network-access.js: missing ${token}`);
}
if(/continue;[^\n]*VIRTUAL_HINTS/.test(server)||/filter\([^\n]*VIRTUAL_HINTS/.test(server))throw new Error('network-access.js: virtual adapters must be ranked, not discarded');
if(!server.includes("app.get('/api/network'"))throw new Error('network-access.js: /api/network route missing');
if(!installer.includes('installNetworkAccessRoute'))throw new Error('question-review.js: ranked network route is not installed');
if(!connect.includes('⭐ 추천')||!connect.includes('recommendedUrl'))throw new Error('connect.html: recommended classroom QR is not surfaced');
if(!connect.includes('다른 QR도 시도'))throw new Error('connect.html: fallback QR guidance missing');

console.log('network access contract selftest passed');
