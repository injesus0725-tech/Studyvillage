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
    approved: Object.freeze([]),
  });
})();
