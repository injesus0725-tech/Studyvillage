/* Purchasable base-character variants. These keep the same body/outfit anchor contract; only the base art changes. */
(() => {
  const renderer = window.StudyVillageAvatar;
  if (!renderer?.BASES || !renderer?.INTERNAL_BASES) return;
  const variants = {
    'character-boy-02': { src: '/assets/avatar-rpg/character-boy-02.png', alt: '남자 기본 캐릭터 2' },
    'character-boy-03': { src: '/assets/avatar-rpg/character-boy-03.png', alt: '남자 기본 캐릭터 3' },
    'character-boy-04': { src: '/assets/avatar-rpg/character-boy-04.png', alt: '남자 기본 캐릭터 4' },
    'character-boy-05': { src: '/assets/avatar-rpg/character-boy-05.png', alt: '남자 기본 캐릭터 5' },
    'character-girl-02': { src: '/assets/avatar-rpg/character-girl-02.png', alt: '여자 기본 캐릭터 2' },
    'character-girl-03': { src: '/assets/avatar-rpg/character-girl-03.png', alt: '여자 기본 캐릭터 3' },
    'character-girl-04': { src: '/assets/avatar-rpg/character-girl-04.png', alt: '여자 기본 캐릭터 4' },
    'character-girl-05': { src: '/assets/avatar-rpg/character-girl-05.png', alt: '여자 기본 캐릭터 5' }
  };
  Object.assign(renderer.BASES, variants);
  Object.assign(renderer.INTERNAL_BASES, variants);
})();
