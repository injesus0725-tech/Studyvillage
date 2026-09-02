/* v1.9.4 classroom network discovery.
   Keep Node's normal interface list, and on Windows also recover IPv4 addresses from ipconfig.
   This mirrors the manual CMD diagnostic that previously found working classroom addresses,
   while keeping every discovered candidate visible and ranking likely physical adapters first. */
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import QRCode from 'qrcode';

const execFileAsync=promisify(execFile);
const clean=v=>String(v??'').trim();
const VIRTUAL_HINTS=/(virtual|vmware|vbox|hyper-v|vethernet|docker|wsl|tailscale|zerotier|vpn|loopback|bluetooth|pseudo|tunnel)/i;
const PHYSICAL_HINTS=/(wi-?fi|wireless|wlan|ethernet|lan|이더넷|무선)/i;
const WIRED_HINTS=/(ethernet|lan|이더넷)/i;
const WIRELESS_HINTS=/(wi-?fi|wireless|wlan|무선)/i;
const IPV4_RE=/\b((?:\d{1,3}\.){3}\d{1,3})\b/;
const isPrivateIpv4=address=>{
  const parts=String(address||'').split('.').map(Number);if(parts.length!==4||parts.some(n=>!Number.isInteger(n)||n<0||n>255))return false;
  return parts[0]===10||(parts[0]===172&&parts[1]>=16&&parts[1]<=31)||(parts[0]===192&&parts[1]===168);
};
const isLinkLocalIpv4=address=>/^169\.254\./.test(String(address||''));
const isUsableIpv4=address=>{const parts=String(address||'').split('.').map(Number);return parts.length===4&&parts.every(n=>Number.isInteger(n)&&n>=0&&n<=255)&&address!=='0.0.0.0'&&!/^127\./.test(address)};
function connectionKind(adapter){const name=clean(adapter);if(VIRTUAL_HINTS.test(name))return'virtual';if(WIRELESS_HINTS.test(name))return'wireless';if(WIRED_HINTS.test(name))return'wired';return'other'}
function scoreAddress(adapter,address,source='node'){
  const name=clean(adapter),kind=connectionKind(name);let score=0;
  if(kind==='wireless')score+=140;
  else if(kind==='wired')score+=100;
  else if(PHYSICAL_HINTS.test(name))score+=70;
  else score+=20;
  if(isPrivateIpv4(address))score+=40;else score-=20;
  if(VIRTUAL_HINTS.test(name))score-=180;
  if(isLinkLocalIpv4(address))score-=220;
  if(source==='ipconfig')score+=2;
  return score;
}
function recommendationFor(row,isRecommended){
  if(isLinkLocalIpv4(row.address))return'자동 할당 주소(169.254)라 학생 접속용으로 사용하지 않는 것을 권장';
  if(row.kind==='virtual')return'가상/VPN 어댑터일 수 있어 학생 접속용으로 권장하지 않음';
  if(isRecommended&&row.kind==='wireless')return'Windows에서 확인된 Wi-Fi 교실망 주소를 우선 추천';
  if(isRecommended&&row.kind==='wired')return'Windows에서 확인된 유선 교실망 주소를 우선 추천';
  if(row.kind==='wireless')return'Wi-Fi 대체 접속 주소';
  if(row.kind==='wired')return'유선 대체 접속 주소';
  return'Windows에서 확인된 대체 접속 주소';
}
function nodeCandidates(){
  const rows=[];
  for(const[adapter,entries]of Object.entries(os.networkInterfaces()))for(const n of entries||[]){
    if(n.family!=='IPv4'||n.internal||!isUsableIpv4(n.address))continue;
    rows.push({adapter,address:n.address,source:'node'});
  }
  return rows;
}
export function parseWindowsIpconfig(text=''){
  const rows=[];let adapter='Windows 네트워크';
  for(const rawLine of String(text).split(/\r?\n/)){
    const line=rawLine.trim();
    if(!line)continue;
    if(/adapter\s+.+:$/i.test(line)||/어댑터\s+.+:$/.test(line))adapter=line.replace(/:$/,'').replace(/^.*?adapter\s+/i,'').replace(/^.*?어댑터\s+/,'').trim()||adapter;
    if(!/IPv4/i.test(line))continue;
    const match=line.match(IPV4_RE);if(!match||!isUsableIpv4(match[1]))continue;
    rows.push({adapter,address:match[1],source:'ipconfig'});
  }
  return rows;
}
async function windowsCandidates(){
  if(process.platform!=='win32')return[];
  try{
    const {stdout}=await execFileAsync('ipconfig',['/all'],{windowsHide:true,encoding:'utf8',timeout:5000,maxBuffer:1024*1024});
    return parseWindowsIpconfig(stdout);
  }catch{return[]}
}
function rankCandidates(candidates,port){
  const byAddress=new Map();
  for(const candidate of candidates){
    if(!isUsableIpv4(candidate.address))continue;
    const old=byAddress.get(candidate.address);
    if(!old||scoreAddress(candidate.adapter,candidate.address,candidate.source)>scoreAddress(old.adapter,old.address,old.source))byAddress.set(candidate.address,candidate);
  }
  const rows=[...byAddress.values()].map(row=>{const kind=connectionKind(row.adapter),address=row.address;return{adapter:row.adapter,address,url:`http://${address}:${port}`,kind,source:row.source,private:isPrivateIpv4(address),linkLocal:isLinkLocalIpv4(address),score:scoreAddress(row.adapter,address,row.source)}});
  rows.sort((a,b)=>b.score-a.score||a.adapter.localeCompare(b.adapter,'ko')||a.address.localeCompare(b.address));
  const preferredIndex=rows.findIndex(row=>!row.linkLocal&&row.kind!=='virtual'&&row.private);
  const fallbackIndex=preferredIndex>=0?preferredIndex:rows.findIndex(row=>!row.linkLocal&&row.kind!=='virtual');
  const recommendedIndex=fallbackIndex>=0?fallbackIndex:(rows.length?0:-1);
  return rows.map((row,index)=>({...row,recommended:index===recommendedIndex,recommendation:recommendationFor(row,index===recommendedIndex)}));
}
export function classroomNetworkAddresses(port){return rankCandidates(nodeCandidates(),port)}
export async function discoverClassroomNetworkAddresses(port){return rankCandidates([...nodeCandidates(),...await windowsCandidates()],port)}
export function installNetworkAccessRoute(app,{port}){
  app.get('/api/network',async(_req,res)=>{
    try{
      const rows=await discoverClassroomNetworkAddresses(port),urls=[];
      for(const row of rows)urls.push({...row,qr:await QRCode.toDataURL(row.url,{width:300,margin:1})});
      const recommended=urls.find(x=>x.recommended)||null;
      const baseGuidance='교사 PC가 유선이어도 학생 패드가 Wi-Fi인 것은 정상입니다. 학교 유선망과 Wi-Fi망 사이의 기기 통신이 허용되어 있으면 접속할 수 있습니다. 교사 PC와 학생 패드는 같은 학교 내부망에서 서로 통신할 수 있어야 합니다.';
      const foundByWindows=urls.some(x=>x.source==='ipconfig');
      const discoveryNote=foundByWindows?' Windows의 실제 네트워크 구성(ipconfig)까지 자동 검색했습니다.':' 현재 운영체제가 제공한 네트워크 주소를 사용합니다.';
      const classroomNote=recommended?.kind==='wireless'
        ?`${baseGuidance}${discoveryNote} 학생 패드가 Wi-Fi를 사용한다면 추천 주소를 먼저 시험하고, 안 되면 다른 접속 주소를 직접 선택하세요.`
        :recommended?.kind==='wired'
          ?`${baseGuidance}${discoveryNote} 현재 유선 교실망 주소를 추천했습니다. 추천 주소가 안 되면 다른 접속 주소를 직접 선택하세요.`
          :`${baseGuidance}${discoveryNote} 자동 추천이 맞지 않을 수 있으므로 표시된 주소 중 학생 패드에서 열리는 주소를 직접 선택하세요.`;
      res.json({ok:true,urls,recommendedUrl:recommended?.url||null,classroomNote,discovery:'node+windows-ipconfig'});
    }catch(err){res.status(500).json({ok:false,code:'network-address-read-failed',message:String(err?.message||err).slice(0,160)})}
  });
}
