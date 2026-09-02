/* v2.0 classroom network address ranking.
   The QR recommendation follows the address selected by the operating system's
   active default route. Adapter-name scoring is only a fallback. */
import os from 'node:os';
import dgram from 'node:dgram';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import QRCode from 'qrcode';

const clean=v=>String(v??'').trim();
const VIRTUAL_HINTS=/(virtual|vmware|vbox|hyper-v|vethernet|docker|wsl|tailscale|zerotier|vpn|loopback|bluetooth|pseudo|tunnel)/i;
const PHYSICAL_HINTS=/(wi-?fi|wireless|wlan|ethernet|lan|이더넷|무선)/i;
const WIRED_HINTS=/(ethernet|lan|이더넷)/i;
const WIRELESS_HINTS=/(wi-?fi|wireless|wlan|무선)/i;
const ROUTE_PROBES=Object.freeze(['1.1.1.1','8.8.8.8']);
const execFileAsync=promisify(execFile);
const isPrivateIpv4=address=>{
  const parts=String(address||'').split('.').map(Number);if(parts.length!==4||parts.some(n=>!Number.isInteger(n)||n<0||n>255))return false;
  return parts[0]===10||(parts[0]===172&&parts[1]>=16&&parts[1]<=31)||(parts[0]===192&&parts[1]===168);
};
function scoreAddress(adapter,address,routeAddresses){
  let score=0;const name=clean(adapter);
  if(routeAddresses.has(address))score+=200;
  if(PHYSICAL_HINTS.test(name))score+=40;
  if(WIRELESS_HINTS.test(name))score+=25;
  if(WIRED_HINTS.test(name))score+=5;
  if(VIRTUAL_HINTS.test(name))score-=80;
  if(isPrivateIpv4(address))score+=30;
  if(/^169\.254\./.test(address))score-=60;
  return score;
}
function connectionKind(adapter){const name=clean(adapter);if(VIRTUAL_HINTS.test(name))return'virtual';if(WIRELESS_HINTS.test(name))return'wireless';if(WIRED_HINTS.test(name))return'wired';return'other'}
function probeRouteAddress(target){
  return new Promise(resolve=>{
    const socket=dgram.createSocket('udp4');let settled=false;
    const finish=value=>{if(settled)return;settled=true;try{socket.close()}catch{}resolve(value||null)};
    const timer=setTimeout(()=>finish(null),700);
    socket.once('error',()=>{clearTimeout(timer);finish(null)});
    socket.connect(53,target,()=>{let address=null;try{address=socket.address().address}catch{}clearTimeout(timer);finish(address)});
  });
}
export async function activeRouteAddresses(){
  const found=await Promise.all(ROUTE_PROBES.map(probeRouteAddress));
  return new Set(found.filter(address=>address&&address!=='0.0.0.0'));
}
export async function windowsIpv4Addresses(){
  if(process.platform!=='win32')return[];
  try{
    const command="Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -ne '127.0.0.1'} | Select-Object InterfaceAlias,IPAddress | ConvertTo-Json -Compress";
    const{stdout}=await execFileAsync('powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{timeout:2500,windowsHide:true,maxBuffer:256*1024});
    const parsed=JSON.parse(String(stdout||'null'));const entries=Array.isArray(parsed)?parsed:parsed?[parsed]:[];
    return entries.map(entry=>({adapter:clean(entry.InterfaceAlias),address:clean(entry.IPAddress)})).filter(entry=>entry.adapter&&(isPrivateIpv4(entry.address)||/^169\.254\./.test(entry.address)));
  }catch{return[]}
}
export function classroomNetworkAddresses(port,{routeAddresses=new Set(),additionalAddresses=[]}={}){
  const routes=routeAddresses instanceof Set?routeAddresses:new Set(routeAddresses||[]),rows=[];
  for(const[adapter,entries]of Object.entries(os.networkInterfaces())){
    for(const n of entries||[]){
      if(n.family!=='IPv4'||n.internal)continue;
      const kind=connectionKind(adapter);
      rows.push({adapter,address:n.address,url:`http://${n.address}:${port}`,kind,score:scoreAddress(adapter,n.address,routes),activeRoute:routes.has(n.address)});
    }
  }
  const known=new Set(rows.map(row=>row.address));
  for(const entry of additionalAddresses||[]){
    const adapter=clean(entry?.adapter),address=clean(entry?.address);
    if(!adapter||!address||known.has(address))continue;
    const kind=connectionKind(adapter);known.add(address);
    rows.push({adapter,address,url:`http://${address}:${port}`,kind,score:scoreAddress(adapter,address,routes),activeRoute:routes.has(address)});
  }
  rows.sort((a,b)=>b.score-a.score||a.adapter.localeCompare(b.adapter,'ko'));
  const best=rows[0]?.score;
  return rows.map((row,index)=>({...row,recommended:index===0&&best!==undefined,recommendation:row.activeRoute?'Windows가 현재 실제 통신에 사용하는 주소':VIRTUAL_HINTS.test(row.adapter)?'가상/VPN 어댑터일 수 있음':index===0&&row.kind==='wireless'?'교사 PC의 현재 Wi-Fi 주소 · 학생 패드 한 대로 먼저 시험':index===0?'학생 패드 한 대로 먼저 접속 시험 권장':'대체 접속 주소'}));
}
export function installNetworkAccessRoute(app,{port}){
  app.get('/api/network',async(_req,res)=>{
    try{
      const[routeAddresses,additionalAddresses]=await Promise.all([activeRouteAddresses(),windowsIpv4Addresses()]);
      const rows=classroomNetworkAddresses(port,{routeAddresses,additionalAddresses});const urls=[];
      for(const row of rows)urls.push({...row,qr:await QRCode.toDataURL(row.url,{width:300,margin:1})});
      const recommended=urls.find(x=>x.recommended)||null;
      res.json({ok:true,urls,recommendedUrl:recommended?.url||null,selectionBasis:recommended?.activeRoute?'active-default-route':'adapter-ranking',classroomNote:recommended?.kind==='wired'?'교사 PC가 유선이어도 학생 패드가 Wi-Fi인 것은 정상입니다. 학교 유선망과 Wi-Fi망 사이의 기기 통신이 허용되어 있으면 이 QR로 접속할 수 있습니다.':'교사 PC와 학생 패드는 같은 학교 내부망에서 서로 통신할 수 있어야 합니다.'});
    }catch(err){res.status(500).json({ok:false,code:'network-address-read-failed',message:String(err?.message||err).slice(0,160)})}
  });
}
