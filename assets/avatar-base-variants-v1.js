/* Base-character production gate.
 * Purchasable base variants stay disabled until they are newly produced from the approved master body.
 * Runtime pixel scanning/Canvas normalization is intentionally disabled.
 * Production character/outfit/pet PNGs must already be aligned on the shared 256x256 canvas.
 */
(() => {
  window.StudyVillageBaseVariantGate = Object.freeze({
    enabled: true,
    runtimeNormalizer: false,
    productionCanvas: 256,
  });
})();
