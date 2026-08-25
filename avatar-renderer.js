/* v0.8 full-body avatar renderer */
window.StudyVillageAvatar = (() => {
  const BASES = {
    'student-default': { emoji:'🧍', src:null, alt:'기본 학생 캐릭터' },
    'student-boy': { emoji:'🧍‍♂️', src:null, alt:'소년 탐험가' },
    'student-girl': { emoji:'🧍‍♀️', src:null, alt:'소녀 탐험가' },
    'student-hero': { emoji:'🧑‍🚀', src:null, alt:'우주 탐험가' }
  };
  const ASSETS = {
    'cap-blue': { emoji:'🧢', src:null, alt:'파란 모자' },
    'crown-gold': { emoji:'👑', src:null, alt:'황금 왕관' },
    'glasses-round': { emoji:'👓', src:null, alt:'동그란 안경' },
    'backpack': { emoji:'🎒', src:null, alt:'모험 가방' },
    'pet-chick': { emoji:'🐣', src:null, alt:'병아리 친구' },
    'pet-cat': { emoji:'🐱', src:null, alt:'고양이 친구' },
    'leaf-cap': { emoji:'🍃', src:null, alt:'새싹 탐험모' },
    'scholar-cap': { emoji:'🎓', src:null, alt:'별빛 학사모' },
    'explorer-goggles': { emoji:'🥽', src:null, alt:'숲빛 고글' },
    'star-monocle': { emoji:'🔭', src:null, alt:'별 관측경' },
    'field-satchel': { emoji:'🧰', src:null, alt:'탐험 도구 가방' },
    'book-pack': { emoji:'📚', src:null, alt:'책마루 가방' },
    'pet-owl': { emoji:'🦉', src:null, alt:'부엉이 친구' },
    'pet-fox': { emoji:'🦊', src:null, alt:'여우 친구' },
    'hair-short': {emoji:'💇',src:null,alt:'씩씩한 짧은 머리'},'hair-bob':{emoji:'👩',src:null,alt:'단정한 단발머리'},'hair-ponytail':{emoji:'👱‍♀️',src:null,alt:'활동적인 포니테일'},'hair-blue':{emoji:'🧑‍🎤',src:null,alt:'별빛 파란 머리'},
    'hat-wizard':{emoji:'🧙',src:null,alt:'마법사 모자'},'hat-pirate':{emoji:'🏴‍☠️',src:null,alt:'해적 모자'},'hat-flower':{emoji:'🌼',src:null,alt:'꽃 장식 모자'},'glasses-sun':{emoji:'🕶️',src:null,alt:'멋쟁이 선글라스'},'glasses-heart':{emoji:'💗',src:null,alt:'하트 안경'},
    'outfit-hoodie':{emoji:'🧥',src:null,alt:'편안한 후드'},'outfit-uniform':{emoji:'👔',src:null,alt:'학습마을 교복'},'outfit-wizard':{emoji:'🥻',src:null,alt:'별빛 마법사 옷'},'outfit-armor':{emoji:'🛡️',src:null,alt:'마을 수호자 갑옷'},
    'shoes-sneakers':{emoji:'👟',src:null,alt:'달리기 운동화'},'shoes-boots':{emoji:'🥾',src:null,alt:'탐험 장화'},'shoes-wing':{emoji:'🪽',src:null,alt:'바람 날개 신발'},'bag-art':{emoji:'🎨',src:null,alt:'미술 도구 가방'},'bag-rocket':{emoji:'🚀',src:null,alt:'로켓 가방'},
    'hand-sword':{emoji:'⚔️',src:null,alt:'용사의 검'},'hand-wand':{emoji:'🪄',src:null,alt:'별빛 지팡이'},'hand-book':{emoji:'📖',src:null,alt:'지혜의 책'},'hand-magnifier':{emoji:'🔎',src:null,alt:'탐정 돋보기'},'pet-dog':{emoji:'🐶',src:null,alt:'강아지 친구'},'pet-rabbit':{emoji:'🐰',src:null,alt:'토끼 친구'},'pet-dragon':{emoji:'🐲',src:null,alt:'꼬마 용 친구'},'pet-slime':{emoji:'🟢',src:null,alt:'말랑 슬라임 친구'}
  };
  function paint(element,spec){if(!element)return;element.replaceChildren();element.classList.toggle('image-asset',!!spec?.src);if(spec?.src){const img=document.createElement('img');img.src=spec.src;img.alt=spec.alt||'';img.draggable=false;element.appendChild(img)}else element.textContent=spec?.emoji||''}
  function base(id='student-default'){return BASES[id]||BASES['student-default']}
  function asset(id,fallback=''){if(!id)return{emoji:'',src:null,alt:''};return ASSETS[id]||{emoji:fallback,src:null,alt:id}}
  function paintBase(element,id='student-default'){paint(element,base(id));if(element)element.dataset.avatarBase=id}
  function paintItem(element,id,fallback=''){paint(element,asset(id,fallback));if(element)element.dataset.avatarItem=id||''}
  function setMotion(container,{moving=false,direction='down'}={}){
    if(!container)return;
    const dir=['up','down','left','right'].includes(direction)?direction:'down';
    container.dataset.motion=moving?'walk':'idle';
    container.dataset.direction=dir;
    container.classList.toggle('is-walking',!!moving);
    container.classList.toggle('is-idle',!moving);
    container.classList.toggle('facing-left',dir==='left');
    container.classList.toggle('facing-right',dir==='right');
    container.classList.toggle('facing-up',dir==='up');
    container.classList.toggle('facing-down',dir==='down');
  }
  return { BASES, ASSETS, base, asset, paint, paintBase, paintItem, setMotion };
})();
