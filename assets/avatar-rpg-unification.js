/* RPG mini-me unification: fixed base face, lightweight expression overlays, one visual scale. */
(() => {
  const renderer = window.StudyVillageAvatar;
  if (!renderer?.ASSETS) return;
  const frame = body => `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
  const skin = '#f2bf98', clearEyes = `<ellipse fill="${skin}" cx="116" cy="60" rx="8" ry="7"/><ellipse fill="${skin}" cx="140" cy="60" rx="8" ry="7"/>`, clearMouth = `<ellipse fill="${skin}" cx="128" cy="75" rx="12" ry="7"/>`, cheeks = '<ellipse fill="#ee9d98" opacity=".55" cx="107" cy="70" rx="6" ry="3"/><ellipse fill="#ee9d98" opacity=".55" cx="149" cy="70" rx="6" ry="3"/>', ink = 'fill="none" stroke="#493935" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  Object.assign(renderer.ASSETS, {
    'face-round': { emoji: '' }, 'face-soft': { emoji: '' }, 'face-brave': { emoji: '' }, 'face-oval': { emoji: '' }, 'face-square': { emoji: '' }, 'face-warm': { emoji: '' },
    'expression-smile': { emoji: '' },
    'expression-calm': { svg: frame(`${clearEyes}${clearMouth}${cheeks}<g ${ink}><path d="M110 60q6 5 12 0M134 60q6 5 12 0M122 75q6 3 12 0"/></g>`) },
    'expression-sparkle': { svg: frame(`${clearEyes}${clearMouth}${cheeks}<g fill="#493935"><path d="M116 51l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5zm24 0l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"/></g><g ${ink}><path d="M121 74q7 7 14 0"/></g>`) }
  });
  const panel = document.querySelector('#customize-panel'), headers = () => window.StudyVillageAuth?.authHeaders?.() || {};
  let state = null;
  async function loadExpressions() { if (!panel || panel.dataset.mode === 'shop') return; try { const response = await fetch('/api/player/me', { headers: headers(), cache: 'no-store' }), data = await response.json(); if (!response.ok || !data.player) return; state = data.player; renderExpressions(); } catch {} }
  function renderExpressions() {
    let section = panel.querySelector('#rpg-expression-picker');
    if (!section) { section = document.createElement('section'); section.id = 'rpg-expression-picker'; section.className = 'inventory-group rpg-expression-picker'; panel.querySelector('#inventory-list')?.before(section); }
    const choices = (state?.inventory || []).filter(item => item.slot === 'expression' && item.unlocked && ['expression-smile','expression-calm','expression-sparkle'].includes(item.id));
    section.innerHTML = '<h3>표정 <small>같은 얼굴 위에서 표정만 바뀝니다</small></h3><div class="inventory-items"></div>';
    const list = section.querySelector('.inventory-items');
    for (const item of choices) { const button = document.createElement('button'); button.type = 'button'; button.className = `inventory-item expression-choice ${state.equipment?.expression === item.id ? 'selected' : ''}`; button.innerHTML = `<span class="expression-mini-preview"><i class="expression-mini-base"></i><i class="expression-mini-layer"></i></span><strong>${item.name}</strong>`; renderer.paintAvatarBase(button.querySelector('.expression-mini-base'), state.baseCharacter || 'student-boy'); renderer.paintItem(button.querySelector('.expression-mini-layer'), item.id); button.onclick = () => saveExpression(item.id, button); list.appendChild(button); }
  }
  async function saveExpression(expression, button) {
    if (!state || button.disabled) return; button.disabled = true; const equipment = { ...state.equipment, face: 'face-round', expression };
    try { const response = await fetch('/api/player/me/equipment', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers() }, body: JSON.stringify({ baseCharacter: state.baseCharacter || 'student-boy', equipment }) }), data = await response.json(); if (!response.ok || !data.ok) throw new Error(); state = data.player || { ...state, equipment }; for (const host of [document.querySelector('#player-expression'), document.querySelector('#preview-expression')]) renderer.paintItem(host, expression); renderExpressions(); window.dispatchEvent(new Event('studyvillage:ranking-refresh')); }
    catch { panel.querySelector('#customize-message').textContent = '표정을 저장하지 못했어요. 잠시 후 다시 눌러 주세요.'; }
    finally { button.disabled = false; }
  }
  document.querySelector('#customize-button')?.addEventListener('click', () => setTimeout(loadExpressions, 0));
  window.addEventListener('studyvillage:player-confirmed', () => setTimeout(loadExpressions, 0));
})();
