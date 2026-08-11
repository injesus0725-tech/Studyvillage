/* v1.9 classroom network address ranking.
   Keeps every usable IPv4 address but marks likely physical LAN/Wi-Fi adapters as recommended.
   A wired teacher PC can still serve Wi-Fi student tablets when the school LAN and Wi-Fi allow
   device-to-device routing; matching adapter type is not required. */
import os from 'node:os';
import QRCode from 'qrcode';

const clean=v=>String(v??'').trim();
const VIRTUAL_HINTS=/(virtual|vmware|vbox|hyper-v|vethernet|docker|wsl|tailscale|zerotier|vpn|loopback|bluetooth|pseudo|tunnel)/i;
const PHYSICAL_HINTS=/(wi-?fi|wireless|wlan|ethernet|lan|이더넷|무선)/i;
const WIRED_HINTS=/(ethernet|lan|이더넷)/i;
const WIRELESS_HINTS=/(wi-?fi|wireless|wlan|무선)/i;
const isPrivateIpv4=address=>{
  const parts=String(address||'').split('.').map(Number);if(parts.length!==4||parts.some(n=>!Number.isInteger(n)||n<0||n>255))return false;
  return parts[0]===10||(parts[0]===172&&parts[1]>=16&&parts[1]<=31)||(parts[0]===192&&parts[1]===168);
};
function scoreAddress(adapter,address){
  let score=0;const name=clean(adapter);
  if(PHYSICAL_HINTS.test(name))score+=40;
  if(VIRTUAL_HINTS.test(name))score-=80;
  if(isPrivateIpv4(address))score+=30;
  if(/^169\.254\./.test(address))score-=60;
  return score;
}
function connectionKind(adapter){const name=clean(adapter);if(VIRTUAL_HINTS.test(name))return'virtual';if(WIRELESS_HINTS.test(name))return'wireless';if(WIRED_HINTS.test(name))return'wired';return'other'}
export function classroomNetworkAddresses(port){
  const rows=[];
  for(const[adapter,entries]of Object.entries(os.networkInterfaces())){
    for(const n of entries||[]){
      if(n.family!=='IPv4'||n.internal)continue;
      const kind=connectionKind(adapter);
      rows.push({adapter,address:n.address,url:`http://${n.address}:${port}`,kind,score:scoreAddress(adapter,n.address)});
    }
  }
  rows.sort((a,b)=>b.score-a.score||a.adapter.localeCompare(b.adapter,'ko'));
  const best=rows[0]?.score;
  return rows.map((row,index)=>({...row,recommended:index===0&&best!==undefined,recommendation:VIRTUAL_HINTS.test(row.adapter)?'가상/VPN 어댑터일 수 있음':index===0?'학생 패드 한 대로 먼저 접속 시험 권장':'대체 접속 주소'}));
}
export function installNetworkAccessRoute(app,{port}){
  app.get('/api/network',async(_req,res)=>{
    try{
      const rows=classroomNetworkAddresses(port);const urls=[];
      for(const row of rows)urls.push({...row,qr:await QRCode.toDataURL(row.url,{width:300,margin:1})});
      const recommended=urls.find(x=>x.recommended)||null;
      res.json({ok:true,urls,recommendedUrl:recommended?.url||null,classroomNote:recommended?.kind==='wired'?'교사 PC가 유선이어도 학생 패드가 Wi-Fi인 것은 정상입니다. 학교 유선망과 Wi-Fi망 사이의 기기 통신이 허용되어 있으면 이 QR로 접속할 수 있습니다.':'교사 PC와 학생 패드는 같은 학교 내부망에서 서로 통신할 수 있어야 합니다.'});
    }catch(err){res.status(500).json({ok:false,code:'network-address-read-failed',message:String(err?.message||err).slice(0,160)})}
  });
}
