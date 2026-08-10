/* v0.7.3 avatar renderer */
window.StudyVillageAvatar = (() => {
  const BASES = {
    'student-default': { emoji:'🧑‍🎓', src:null, alt:'기본 학생 캐릭터' },
    'student-boy': { emoji:'👦', src:null, alt:'소년 탐험가' },
    'student-girl': { emoji:'👧', src:null, alt:'소녀 탐험가' },
    'student-hero': { emoji:'🧑‍🚀', src:null, alt:'우주 탐험가' }
  };
  const ASSETS = {
    'cap-blue': { emoji:'🧢', src:null, alt:'파란 모자' },
    'crown-gold': { emoji:'👑', src:null, alt:'황금 왕관' },
    'glasses-round': { emoji:'👓', src:null, alt:'동그란 안경' },
    'backpack': { emoji:'🎒', src:null, alt:'모험 가방' },
    'pet-chick': { emoji:'🐣', src:null, alt:'병아리 친구' },
    'pet-cat': { emoji:'🐱', src:null, alt:'고양이 친구' }
  };
  function paint(element,spec){if(!element)return;element.replaceChildren();element.classList.toggle('image-asset',!!spec?.src);if(spec?.src){const img=document.createElement('img');img.src=spec.src;img.alt=spec.alt||'';img.draggable=false;element.appendChild(img)}else element.textContent=spec?.emoji||''}
  function base(id='student-default'){return BASES[id]||BASES['student-default']}
  function asset(id,fallback=''){if(!id)return{emoji:'',src:null,alt:''};return ASSETS[id]||{emoji:fallback,src:null,alt:id}}
  function paintBase(element,id='student-default'){paint(element,base(id))}
  function paintItem(element,id,fallback=''){paint(element,asset(id,fallback))}
  return { BASES, ASSETS, base, asset, paint, paintBase, paintItem };
})();
