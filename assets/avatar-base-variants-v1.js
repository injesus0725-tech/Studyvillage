/* Base-character production gate.
 * Approved variants are baked from a complete legacy head and the fixed production body.
 * Runtime pixel scanning/Canvas normalization is intentionally disabled.
 * Production character/outfit/pet PNGs must already be aligned on the shared 256x256 canvas.
 */
(() => {
  window.StudyVillageBaseVariantGate = Object.freeze({
    enabled: true,
    runtimeNormalizer: false,
    productionCanvas: 256,
    headSocketY: 89,
    centerX: 128,
    footY: 237,
    approved: Object.freeze(['character-boy-02','character-boy-03','character-boy-04','character-boy-05','character-girl-02','character-girl-03','character-girl-04','character-girl-05']),
  });
})();
