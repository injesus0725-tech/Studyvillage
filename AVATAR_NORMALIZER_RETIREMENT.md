# Avatar runtime normalizer retirement

The legacy `assets/avatar-auto-normalize-v1.js` path is retained only as an inert compatibility stub while old verification contracts still read the file.

Production contract:
- 256x256 fixed transparent canvas.
- Outfit body is authored against the base character neck line and sole line.
- Outfit body must fully cover the default clothing silhouette with a small safety overlap.
- Weapons, bows, capes, hats, shoulders, and other external decoration do not participate in alignment calculations.
- Actual face/eyes/mouth must remain unobstructed unless the item design intentionally requires otherwise.
- Runtime performs no alpha-bound scan, Canvas/getImageData normalization, data-URL rewriting, automatic crop/trim, or MutationObserver alignment.
- Finished production PNG is rendered directly at 0,0.

The compatibility stub must not be loaded by the game. Remove the stub after all legacy self-tests have been migrated to assert this production contract directly.
