/* Full-body replacement pass for the three premium legacy outfits.
   These occupy one outfit slot but visually replace torso, bottoms and shoes on the shared 96x144 canvas. */
(()=>{
  const r=window.StudyVillageAvatar;if(!r?.ASSETS)return;
  const frame=body=>`<svg viewBox="0 0 96 144" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="geometricPrecision">${body}</svg>`;
  const stroke='stroke="#684b43" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"';
  r.ASSETS['outfit-uniform']={alt:'학습마을 교복 전신',svg:frame(`<g ${stroke}><path fill="#2f5278" d="M28 72l10-5h20l10 5-3 34H31z"/><path fill="#f7f1df" d="M38 68l10 14 10-14-2 17H40z"/><path fill="#c59d47" d="M46 80h4l2 17-4 5-4-5z"/><path fill="#22384f" d="M31 102h34l-2 27H51l-3-17-3 17H33z"/><path fill="#f7f3ea" d="M29 126h17v9H24q-4-5 5-9zm22 0h17q9 6 4 9H51z"/><path fill="none" d="M48 83v23M34 91h8m12 0h8"/></g>`) };
  r.ASSETS['outfit-wizard']={alt:'별빛 마법사 전신',svg:frame(`<g ${stroke}><path fill="#4e3f89" d="M29 69h38l10 58H19z"/><path fill="#2b2452" d="M37 68l11 15 11-15 8 8-19 18-19-18z"/><path fill="#9b7ad5" d="M28 96h40l5 28H23z"/><path fill="#d7b75a" d="M47 84h2v40h-2zM27 108h42v5H27z"/><path fill="#efe9ff" d="M42 93l6-7 6 7-6 7zM34 116l3-4 3 4-3 4zm24 3 3-4 3 4-3 4z"/><path fill="#392f67" d="M25 125h20v10H20q-3-6 5-10zm26 0h20q8 5 4 10H51z"/></g>`) };
  r.ASSETS['outfit-armor']={alt:'마을 수호자 갑옷 전신',svg:frame(`<g ${stroke}><path fill="#36475c" d="M29 72l9-7h20l9 7-4 34H33z"/><path fill="#91a3b8" d="M23 74l14-10 5 15-13 10zm50 0L59 64l-5 15 13 10z"/><path fill="#dce4ec" d="M39 68l9 12 9-12 5 36H34z"/><path fill="#5b6d84" d="M32 102h32l-2 27H51l-3-17-3 17H34z"/><path fill="#c59e43" d="M33 96h30v7H33zM46 80h4v16h-4z"/><path fill="#77899d" d="M28 124h18v11H23q-4-6 5-11zm22 0h18q9 6 4 11H50z"/><path fill="#b9c7d5" d="M37 72l11 9 11-9-4 17H41z"/><path fill="#d6b34d" d="M43 88l5-5 5 5-5 5z"/></g>`) };
})();
