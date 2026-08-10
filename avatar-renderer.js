/* v0.7.2 avatar renderer
   Rendering is intentionally data-driven. Today assets use emoji fallbacks.
   Later, set `src` to a PNG/SVG path and the game/customizer can render real artwork
   without changing inventory, unlock, or equipment logic. */
window.StudyVillageAvatar = (() => {
  const BASE = { id:'student-default', emoji:'🧑‍🎓', src:null, alt:'학생 캐릭터' };
  const ASSETS = {
    'cap-blue': { emoji:'🧢', src:null, alt:'파란 모자' },
    'crown-gold': { emoji:'👑', src:null, alt:'황금 왕관' },
    'glasses-round': { emoji:'👓', src:null, alt:'동그란 안경' },
    'backpack': { emoji:'🎒', src:null, alt:'모험 가방' },
    'pet-chick': { emoji:'🐣', src:null, alt:'병아리 친구' },
    'pet-cat': { emoji:'🐱', src:null, alt:'고양이 친구' }
  };

  function asset(id, fallback='') {
    if (!id) return { emoji:'', src:null, alt:'' };
    return ASSETS[id] || { emoji:fallback, src:null, alt:id };
  }

  function paint(element, spec) {
    if (!element) return;
    element.replaceChildren();
    element.classList.toggle('image-asset', !!spec?.src);
    if (spec?.src) {
      const img=document.createElement('img');
      img.src=spec.src; img.alt=spec.alt||''; img.draggable=false;
      element.appendChild(img);
    } else {
      element.textContent=spec?.emoji||'';
    }
  }

  function paintBase(element) { paint(element, BASE); }
  function paintItem(element, id, fallback='') { paint(element, asset(id,fallback)); }

  return { BASE, ASSETS, asset, paint, paintBase, paintItem };
})();
