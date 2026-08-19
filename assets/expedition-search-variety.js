/* Expedition search variety: generate a different clue trail each time a hidden find appears. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  const map=()=>stage.querySelector('[data-stage-map]'),hero=()=>map()?.querySelector('.sv-stage-player');
  const modes=['trail','landmark','fork'];let markers=[];
  const style=document.createElement('style');style.textContent='.sv-search-clue{position:absolute;z-index:6;display:grid;place-items:center;width:30px;height:30px;border:3px solid #fff;border-radius:50%;background:#ffffffcf;box-shadow:0 5px 14px #20392b33;font-size:18px;opacity:.18;pointer-events:none;transition:opacity .2s,transform .2s}.sv-search-clue.visible{opacity:.9;transform:scale(1.08)}.sv-search-clue.decoy{filter:grayscale(.35);opacity:.14}.sv-search-landmark{width:42px;height:42px;border-radius:14px;font-size:24px}.sv-search-fork-note{position:absolute;z-index:6;padding:5px 8px;border:3px solid #fff;border-radius:999px;background:#fff9d9d8;color:#66551b;font-size:9px;font-weight:1000;pointer-events:none}';document.head.appendChild(style);
  const clear=()=>{markers.forEach(el=>el.remove());markers=[]};
  const point=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
  function add(x,y,text,extra=''){const host=map();if(!host)return;const el=document.createElement('span');el.className=`sv-search-clue ${extra}`;el.textContent=text;el.style.left=`${Math.round(x)}px`;el.style.top=`${Math.round(y)}px`;host.appendChild(el);markers.push(el);return el}
  function build(detail={}){clear();const host=map(),player=hero();if(!host||!player)return;const start={x:player.offsetLeft+player.offsetWidth/2,y:player.offsetTop+player.offsetHeight/2},end={x:Number(detail.x)||host.clientWidth*.75,y:Number(detail.y)||host.clientHeight*.65},mode=modes[Math.floor(Math.random()*modes.length)];
    if(mode==='trail'){
      [0.22,0.42,0.62,0.78].forEach((t,i)=>{const p=point(start,end,t);add(p.x+(i%2?24:-18),p.y+(i%2?-12:18),i%2?'🍃':'✨')});
    }else if(mode==='landmark'){
      const p=point(start,end,.48);add(p.x,p.y,'🪧','sv-search-landmark');const q=point(start,end,.74);add(q.x-20,q.y+18,'🔎');
    }else{
      const p=point(start,end,.38),q=point(start,end,.62);add(p.x,p.y,'👣');add(q.x,q.y,'❓');const decoy=add(Math.max(30,p.x+(end.y-start.y)*.22),Math.max(30,p.y-(end.x-start.x)*.18),'🍂','decoy');const note=document.createElement('span');note.className='sv-search-fork-note';note.textContent='어느 쪽일까?';note.style.left=`${Math.round((p.x+q.x)/2)}px`;note.style.top=`${Math.round((p.y+q.y)/2-34)}px`;host.appendChild(note);markers.push(note);if(decoy)decoy.classList.add('decoy')
    }
    revealNearby();
  }
  function revealNearby(){const host=map(),player=hero();if(!host||!player)return;const px=player.offsetLeft+player.offsetWidth/2,py=player.offsetTop+player.offsetHeight/2;for(const el of markers){if(!el.classList.contains('sv-search-clue'))continue;const x=el.offsetLeft+el.offsetWidth/2,y=el.offsetTop+el.offsetHeight/2;el.classList.toggle('visible',Math.hypot(px-x,py-y)<165)}}
  let timer=0;function loop(){clearTimeout(timer);if(stage.hidden)return;revealNearby();timer=setTimeout(loop,140)}
  window.addEventListener('studyvillage:expedition-find-spawned',e=>{build(e.detail);loop()});
  window.addEventListener('studyvillage:expedition-find-claimed',clear);
  window.addEventListener('studyvillage:session-cleared',()=>{clear();clearTimeout(timer)});
  new MutationObserver(()=>{if(stage.hidden){clear();clearTimeout(timer)}}).observe(stage,{attributes:true,attributeFilter:['hidden']});
})();
