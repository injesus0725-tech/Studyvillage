/* v0.9 stabilization: full-body avatar renderer with three accessory-friendly bases. */
window.StudyVillageAvatar = (() => {
  const BASES = {
    'student-default': { emoji:'🧍', src:null, alt:'기본 학생 캐릭터' },
    'student-boy': { emoji:'🧍‍♂️', src:null, alt:'소년 탐험가' },
    'student-girl': { emoji:'🧍‍♀️', src:null, alt:'소녀 탐험가' }
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
    'pet-fox': { emoji:'🦊', src:null, alt:'여우 친구' }
  };
  function paint(element,spec){if(!element)return;element.replaceChildren();element.classList.toggle('image-asset',!!spec?.src);if(spec?.src){const img=document.createElement('img');img.src=spec.src;img.alt=spec.alt||'';img.draggable=false;element.appendChild(img)}else element.textContent=spec?.emoji||''}
  function base(id='student-default'){return BASES[id]||BASES['student-default']}
  function asset(id,fallback=''){if(!id)return{emoji:'',src:null,alt:''};return ASSETS[id]||{emoji:fallback,src:null,alt:id}}
  function paintBase(element,id='student-default'){const safeId=BASES[id]?id:'student-default';paint(element,base(safeId));if(element)element.dataset.avatarBase=safeId}
  function paintItem(element,id,fallback=''){paint(element,asset(id,fallback));if(element)element.dataset.avatarItem=id||''}
  function setMotion(container,{moving=false,direction='down'}={}){if(!container)return;const dir=['up','down','left','right'].includes(direction)?direction:'down';container.dataset.motion=moving?'walk':'idle';container.dataset.direction=dir;container.classList.toggle('is-walking',!!moving);container.classList.toggle('is-idle',!moving);container.classList.toggle('facing-left',dir==='left');container.classList.toggle('facing-right',dir==='right');container.classList.toggle('facing-up',dir==='up');container.classList.toggle('facing-down',dir==='down')}
  return { BASES, ASSETS, base, asset, paint, paintBase, paintItem, setMotion };
})();
