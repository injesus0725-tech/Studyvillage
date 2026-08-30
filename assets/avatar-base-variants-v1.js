/* Base-character production gate.
 * Purchasable base variants stay disabled until they are newly produced from the approved master body.
 * This file currently boots the shared outfit/pet normalizer only.
 */
(() => {
  if (!window.StudyVillageAvatarNormalizer && !document.querySelector('script[data-avatar-normalizer]')) {
    const script = document.createElement('script');
    script.src = '/assets/avatar-auto-normalize-v1.js?v=20260830d';
    script.dataset.avatarNormalizer = 'v1';
    document.head.appendChild(script);
  }
})();
