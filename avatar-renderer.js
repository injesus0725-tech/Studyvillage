/* v1 accessory standard: all avatar items use stable slots, anchors, scale, offsets, and layers. */
window.StudyVillageAvatar = (() => {
  const BASES = {
    'student-default': { emoji:'🧍', src:null, alt:'기본 학생 캐릭터' },
    'student-boy': { emoji:'🧍‍♂️', src:null, alt:'소년 탐험가' },
    'student-girl': { emoji:'🧍‍♀️', src:null, alt:'소녀 탐험가' }
  };
  const SLOT_DEFAULTS=Object.freeze({
    hat:{anchor:'head',scale:1,offsetX:0,offsetY:0,layer:50},
    glasses:{anchor:'eyes',scale:1,offsetX:0,offsetY:0,layer:60},
    bag:{anchor:'back',scale:1,offsetX:0,offsetY:0,layer:20},
    pet:{anchor:'pet-right',scale:1,offsetX:0,offsetY:0,layer:15},
    hand:{anchor:'hand-right',scale:1,offsetX:0,offsetY:0,layer:70},
    shoes:{anchor:'feet',scale:1,offsetX:0,offsetY:0,layer:40}
  });
  const item=(emoji,alt,slot,extra={})=>({emoji,src:null,alt,slot,...SLOT_DEFAULTS[slot],...extra});
  const ASSETS = {
    'cap-blue': item('🧢','파란 모자','hat'),
    'crown-gold': item('👑','황금 왕관','hat',{scale:.92,offsetY:-1}),
    'glasses-round': item('👓','동그란 안경','glasses',{scale:.92}),
    'backpack': item('🎒','모험 가방','bag',{scale:.9,offsetX:-1}),
    'pet-chick': item('🐣','병아리 친구','pet',{scale:.86}),
    'pet-cat': item('🐱','고양이 친구','pet',{scale:.92}),
    'leaf-cap': item('🍃','새싹 탐험모','hat',{scale:.88,offsetY:-1}),
    'scholar-cap': item('🎓','별빛 학사모','hat',{scale:.9,offsetY:-1}),
    'explorer-goggles': item('🥽','숲빛 고글','glasses',{scale:.9}),
    'star-monocle': item('🔭','별 관측경','glasses',{scale:.82,offsetX:3}),
    'field-satchel': item('🧰','탐험 도구 가방','bag',{scale:.84,offsetX:-1,offsetY:1}),
    'book-pack': item('📚','책마루 가방','bag',{scale:.82,offsetX:-1}),
    'pet-owl': item('🦉','부엉이 친구','pet',{scale:.92}),
    'pet-fox': item('🦊','여우 친구','pet',{scale:.94})
  };
  function paint(element,spec){if(!element)return;element.replaceChildren();element.classList.toggle('image-asset',!!spec?.src);if(spec?.src){const img=document.createElement('img');img.src=spec.src;img.alt=spec.alt||'';img.draggable=false;element.appendChild(img)}else element.textContent=spec?.emoji||''}
  function base(id='student-default'){return BASES[id]||BASES['student-default']}
  function asset(id,fallback=''){if(!id)return{emoji:'',src:null,alt:'',slot:null};return ASSETS[id]||{emoji:fallback,src:null,alt:id,slot:null,anchor:null,scale:1,offsetX:0,offsetY:0,layer:30}}
  function placement(id){const spec=asset(id);return{slot:spec.slot||null,anchor:spec.anchor||null,scale:Number(spec.scale)||1,offsetX:Number(spec.offsetX)||0,offsetY:Number(spec.offsetY)||0,layer:Number(spec.layer)||30}}
  function applyPlacement(element,id){if(!element)return;const p=placement(id);element.dataset.avatarSlot=p.slot||'';element.dataset.avatarAnchor=p.anchor||'';element.style.setProperty('--sv-item-scale',String(p.scale));element.style.setProperty('--sv-item-x',`${p.offsetX}px`);element.style.setProperty('--sv-item-y',`${p.offsetY}px`);element.style.zIndex=String(p.layer)}
  function paintBase(element,id='student-default'){const safeId=BASES[id]?id:'student-default';paint(element,base(safeId));if(element)element.dataset.avatarBase=safeId}
  function paintItem(element,id,fallback=''){paint(element,asset(id,fallback));if(element){element.dataset.avatarItem=id||'';applyPlacement(element,id)}}
  function setMotion(container,{moving=false,direction='down'}={}){if(!container)return;const dir=['up','down','left','right'].includes(direction)?direction:'down';container.dataset.motion=moving?'walk':'idle';container.dataset.direction=dir;container.classList.toggle('is-walking',!!moving);container.classList.toggle('is-idle',!moving);container.classList.toggle('facing-left',dir==='left');container.classList.toggle('facing-right',dir==='right');container.classList.toggle('facing-up',dir==='up');container.classList.toggle('facing-down',dir==='down')}
  return { BASES, SLOT_DEFAULTS, ASSETS, base, asset, placement, applyPlacement, paint, paintBase, paintItem, setMotion };
})();
