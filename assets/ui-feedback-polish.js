/* 2026-08-27 classroom feedback pass: separate shop/wardrobe, stable admin order, discovery sounds. */
(() => {
  const panel = document.querySelector('#customize-panel');
  const wardrobeButton = document.querySelector('#customize-button');
  const shopButton = document.querySelector('#shop-button');
  if (panel && wardrobeButton && shopButton) {
    const badge = panel.querySelector('.record-badge');
    const title = panel.querySelector('.record-header h2');
    const baseGroup = panel.querySelector('#base-character-list')?.closest('.inventory-group');
    const wardrobe = panel.querySelector('#inventory-list');
    const shop = panel.querySelector('.student-shop');
    const message = panel.querySelector('#customize-message');
    const save = panel.querySelector('#customize-save');
    const setMode = mode => {
      panel.dataset.mode = mode;
      const shopping = mode === 'shop';
      if (badge) badge.textContent = shopping ? '별 상점' : '내 옷장';
      if (title) title.textContent = shopping ? '⭐ 필요한 아이템 고르기' : '👕 내 캐릭터 꾸미기';
      if (baseGroup) baseGroup.hidden = shopping;
      if (wardrobe) wardrobe.hidden = shopping;
      if (message) message.hidden = shopping;
      if (save) save.hidden = shopping;
      if (shop) shop.hidden = !shopping;
    };
    wardrobeButton.addEventListener('click', () => setMode('wardrobe'), true);
    shopButton.addEventListener('click', () => {
      setMode('shop');
      panel.hidden = false;
      window.dispatchEvent(new Event('studyvillage:shop-refresh'));
      requestAnimationFrame(() => setMode('shop'));
    });
    setMode('wardrobe');
  }

  const app = document.querySelector('#admin-app');
  if (app) {
    let arranging = false;
    const arrange = () => {
      if (arranging) return;
      arranging = true;
      const header = app.querySelector(':scope > header');
      const nav = app.querySelector(':scope > .admin-quick-nav');
      const summary = app.querySelector(':scope > .summary');
      if (header && app.firstElementChild !== header) app.prepend(header);
      if (nav && header?.nextElementSibling !== nav) header.after(nav);
      if (summary && (nav || header)?.nextElementSibling !== summary) (nav || header).after(summary);
      arranging = false;
    };
    new MutationObserver(arrange).observe(app, { childList: true });
    arrange();
  }

  const played = new WeakSet();
  const playDiscovery = root => {
    for (const card of root.querySelectorAll?.('.sv2-card') || []) {
      if (played.has(card)) continue;
      const text = card.textContent || '';
      let sound = '';
      if (text.includes('별빛 천사')) sound = 'angel';
      else if (/악당|유령|고블린|도둑/.test(text)) sound = 'villain';
      else if (card.classList.contains('sv2-reward') || text.includes('발견!')) sound = 'reward';
      else if (text.includes('무언가 나타납니다')) sound = 'mystery';
      if (sound) {
        played.add(card);
        window.StudyVillageSound?.play(sound);
      }
    }
  };
  new MutationObserver(records => records.forEach(record => playDiscovery(record.target)))
    .observe(document.body, { childList: true, subtree: true });
})();
