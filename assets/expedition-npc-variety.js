/* Expedition variety: keep one verified challenge NPC and add 1-2 randomized guides with distinct styles across the expanded map. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  const roster=[
    {id:'fox',icon:'🦊',name:'숲길 여우',trait:'선택형',mode:'choice'},
    {id:'ghost',icon:'👻',name:'책방 유령',trait:'랜덤형',mode:'random'},
    {id:'robot',icon:'🤖',name:'기록 로봇',trait:'핵심어형',mode:'keyword'},
    {id:'wizard',icon:'🧙',name:'별빛 마법사',trait:'힌트형',mode:'hint'},
    {id:'owl',icon:'🦉',name:'지혜 부엉이',trait:'판단형',mode:'judge'},
    {id:'dragon',icon:'🐲',name:'꼬마 용',trait:'도전형',mode:'brave'}
  ];
  const NPC_SPOTS=[{x:.24,y:.18},{x:.48,y:.16},{x:.72,y:.18},{x:.84,y:.38},{x:.76,y:.62},{x:.58,y:.75},{x:.34,y:.70},{x:.18,y:.52},{x:.46,y:.44}];
  const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  const toast=text=>{let el=stage.querySelector('.sv-npc-variety-toast');if(!el){el=document.createElement('div');el.className='sv-npc-variety-toast';stage.appendChild(el)}el.textContent=text;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,1800)};
  const style=document.createElement('style');style.textContent='.sv-stage-npc[data-variety-clone]{position:absolute;z-index:9;width:132px;min-height:116px;padding:10px 8px;border:4px solid #fff;border-radius:24px;background:#fffbd8;box-shadow:0 8px 22px #17382244;text-align:center;font-weight:1000;cursor:pointer}.sv-stage-npc[data-variety-clone] .ico{display:block;font-size:42px}.sv-stage-npc[data-variety-clone] small{display:block;margin-top:3px;color:#58705f;font-size:11px}.sv-npc-variety-toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:50;max-width:82%;padding:10px 15px;border:4px solid #fff;border-radius:22px;background:#244f36;color:#fff;font-weight:1000;text-align:center;box-shadow:0 8px 22px #0004}.sv-npc-variety-toast[hidden]{display:none}';document.head.appendChild(style);
  function runBehavior(npc,forward){
    if(npc.mode==='choice'){const left=confirm('🦊 숲길 여우: 어느 길로 갈까요?\n확인 = 단서 길 / 취소 = 직감 길');toast(left?'단서 길! 중요한 말을 먼저 찾아봐요.':'직감 길! 답을 먼저 예상한 뒤 읽어봐요.');}
    else if(npc.mode==='random'){const lines=['🎲 보기 두 개를 먼저 비교해 봐요.','🎲 문제 속 핵심 낱말 하나를 찾아봐요.','🎲 정답을 보기 전에 먼저 예상해 봐요.'];toast(lines[Math.floor(Math.random()*lines.length)])}
    else if(npc.mode==='keyword')toast('🤖 문제에서 핵심 단어 하나를 찾고 시작!');
    else if(npc.mode==='hint')toast('🧙 “무엇을 묻는지”부터 천천히 찾아봐요.');
    else if(npc.mode==='judge')toast('🦉 아는 것과 짐작한 것을 나누고 근거 있는 답을 골라봐요.');
    else{const brave=confirm('🐲 바로 도전할까요?\n확인 = 바로 도전 / 취소 = 한 번 더 살펴보기');toast(brave?'🔥 바로 도전!':'🔎 한 번 더 살펴보고 도전!')}
    setTimeout(forward,260);
  }
  function putAt(el,spot){el.style.left=`${Math.round(spot.x*100)}%`;el.style.top=`${Math.round(spot.y*100)}%`;el.style.right='auto';el.style.bottom='auto'}
  function rebuild(){
    const map=stage.querySelector('[data-stage-map]'),original=map?.querySelector('.sv-stage-npc:not([data-variety-clone])');if(stage.hidden||!map||!original)return;
    map.querySelectorAll('.sv-stage-npc[data-variety-clone]').forEach(el=>el.remove());
    const total=2+Math.floor(Math.random()*2),selected=shuffle(roster).slice(0,total-1),spots=shuffle(NPC_SPOTS).slice(0,total);
    putAt(original,spots[0]);original.dataset.randomNpcPosition='1';
    selected.forEach((npc,i)=>{const el=document.createElement('button');el.type='button';el.className='sv-stage-npc';el.dataset.varietyClone='1';el.dataset.varietyNpc=npc.id;putAt(el,spots[i+1]);el.innerHTML=`<span class="ico">${npc.icon}</span><strong>${npc.name}</strong><small>${npc.trait} · 문제 도전</small>`;el.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();runBehavior(npc,()=>original.click())});map.appendChild(el)});
    toast(`🧭 이번 지역에는 문제를 내는 친구가 ${total}명 있어요. 지도를 돌아다니며 골라 보세요.`);
    window.StudyVillageExpeditionCamera?.ensureSize?.();
  }
  let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(rebuild,120)}).observe(stage,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});window.addEventListener('studyvillage:session-cleared',()=>stage.querySelectorAll('[data-variety-clone]').forEach(el=>el.remove()));
  window.StudyVillageExpeditionNpcVariety={rebuild,spots:NPC_SPOTS};
})();
