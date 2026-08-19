/* Expedition variety: 2-3 randomized guides per stage, each with a different way to start the same verified question flow. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  const roster=[
    {id:'fox',icon:'🦊',name:'숲길 여우',trait:'선택형',intro:'갈림길을 골라 문제에 도전해요.',mode:'choice'},
    {id:'ghost',icon:'👻',name:'책방 유령',trait:'랜덤형',intro:'어떤 방식으로 문제가 나올지 유령도 몰라요!',mode:'random'},
    {id:'robot',icon:'🤖',name:'기록 로봇',trait:'기록형',intro:'문제에서 핵심 단어를 하나 찾고 도전해요.',mode:'keyword'},
    {id:'wizard',icon:'🧙',name:'별빛 마법사',trait:'힌트형',intro:'짧은 생각 힌트를 받고 시작해요.',mode:'hint'},
    {id:'owl',icon:'🦉',name:'지혜 부엉이',trait:'판단형',intro:'아는 것과 짐작한 것을 나누어 생각해요.',mode:'judge'},
    {id:'dragon',icon:'🐲',name:'꼬마 용',trait:'도전형',intro:'바로 도전할지 한 번 더 살펴볼지 선택해요.',mode:'brave'}
  ];
  const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  const toast=text=>{let el=stage.querySelector('.sv-npc-variety-toast');if(!el){el=document.createElement('div');el.className='sv-npc-variety-toast';stage.appendChild(el)}el.textContent=text;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,1800)};
  const style=document.createElement('style');style.textContent='.sv-stage-npc[data-variety-clone]{position:absolute;z-index:9;width:132px;min-height:116px;padding:10px 8px;border:4px solid #fff;border-radius:24px;background:#fffbd8;box-shadow:0 8px 22px #17382244;text-align:center;font-weight:1000;cursor:pointer}.sv-stage-npc[data-variety-clone] .ico{display:block;font-size:42px}.sv-stage-npc[data-variety-clone] small{display:block;margin-top:3px;color:#58705f;font-size:11px}.sv-npc-variety-toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:50;max-width:82%;padding:10px 15px;border:4px solid #fff;border-radius:22px;background:#244f36;color:#fff;font-weight:1000;text-align:center;box-shadow:0 8px 22px #0004}.sv-npc-variety-toast[hidden]{display:none}';document.head.appendChild(style);
  function currentLevel(){return Math.max(1,Number(document.querySelector('#profile-level')?.textContent?.match(/\d+/)?.[0])||1)}
  function runBehavior(npc,original){
    if(npc.mode==='choice'){const left=confirm('🦊 숲길 여우: 어느 길로 갈까요?\n확인 = 단서 길 / 취소 = 직감 길');toast(left?'단서 길! 문제의 중요한 말을 먼저 찾아봐요.':'직감 길! 첫 생각을 정한 뒤 문제를 읽어봐요.');}
    else if(npc.mode==='random'){const lines=['🎲 보기 두 개를 먼저 비교해 봐요.','🎲 문제 속 숫자·낱말 하나에 표시해 봐요.','🎲 정답을 보기 전에 먼저 예상해 봐요.'];toast(lines[Math.floor(Math.random()*lines.length)])}
    else if(npc.mode==='keyword')toast('🤖 핵심 단어 하나를 찾으면 기록 준비 완료!');
    else if(npc.mode==='hint')toast('🧙 문제를 천천히 읽고 “무엇을 묻는지”부터 찾아봐요.');
    else if(npc.mode==='judge')toast('🦉 아는 것 / 짐작한 것을 나누고 가장 근거 있는 답을 골라봐요.');
    else {const brave=confirm('🐲 바로 도전할까요?\n확인 = 바로 도전 / 취소 = 한 번 더 살펴보기');toast(brave?'🔥 용감하게 바로 도전!':'🔎 한 번 더 살펴본 뒤 도전!')}
    setTimeout(()=>original?.click(),260);
  }
  function rebuild(){
    const map=stage.querySelector('[data-stage-map]'),original=map?.querySelector('.sv-stage-npc:not([data-variety-clone])');if(stage.hidden||!map||!original)return;
    map.querySelectorAll('.sv-stage-npc[data-variety-clone]').forEach(el=>el.remove());
    const count=2+Math.floor(Math.random()*2),selected=shuffle(roster).slice(0,count),spots=shuffle([{x:.66,y:.18},{x:.80,y:.42},{x:.62,y:.68},{x:.34,y:.20},{x:.82,y:.72}]).slice(0,count-1);
    const first=selected[0];original.dataset.varietyNpc=first.id;original.title=`${first.name} · ${first.trait}`;
    const label=original.querySelector('strong')||original.querySelector('b');if(label)label.textContent=first.name;
    original.onclick=event=>{event?.preventDefault?.();event?.stopPropagation?.();runBehavior(first,original.dataset.varietyForward==='1'?null:original)};
    selected.slice(1).forEach((npc,i)=>{const spot=spots[i],el=document.createElement('button');el.type='button';el.className='sv-stage-npc';el.dataset.varietyClone='1';el.dataset.varietyNpc=npc.id;el.style.left=`${Math.round(spot.x*100)}%`;el.style.top=`${Math.round(spot.y*100)}%`;el.innerHTML=`<span class="ico">${npc.icon}</span><strong>${npc.name}</strong><small>${npc.trait} · 눌러서 문제 도전</small>`;el.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();runBehavior(npc,()=>{original.dataset.varietyForward='1';original.click();delete original.dataset.varietyForward})});map.appendChild(el)});
    toast(`🧭 이번 탐험에는 ${selected.map(n=>n.name).join(' · ')} 등장!`);
  }
  let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(rebuild,80)}).observe(stage,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});window.addEventListener('studyvillage:session-cleared',()=>stage.querySelectorAll('[data-variety-clone]').forEach(el=>el.remove()));
})();
