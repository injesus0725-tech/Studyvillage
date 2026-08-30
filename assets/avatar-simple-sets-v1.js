/* StudyVillage simple avatar sets v1. One fixed 96x144 canvas: hair + full outfit + side friend/effect. */
(()=>{const r=window.StudyVillageAvatar;if(!r?.ASSETS)return;const frame=b=>`<svg viewBox="0 0 96 144" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${b}</svg>`,stroke='stroke="#684b43" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"',svg=b=>({svg:frame(`<g ${stroke}>${b}</g>`)});
const hairs={
'hair-choco-wave':['#68483e','wave'],'hair-honey-short':['#c68b4b','short'],'hair-berry-bob':['#9b526d','bob'],'hair-mint-wave':['#5f9c8c','wave'],'hair-night-short':['#354967','short'],'hair-rose-pony':['#a95d76','pony'],'hair-silver-wave':['#a7a8b4','wave'],'hair-sky-bob':['#6299bb','bob']};
const hairShape=(color,kind)=>{const d={short:'M25 39Q22 12 48 9q25 1 23 29l-7-8-5 7-9-11-8 11-8-8-5 10z',bob:'M23 42Q21 10 48 8t26 34v23l-10 5V38l-7-9-9 10-9-10-7 10v31l-10-5z',pony:'M25 39Q22 11 48 8t23 31l-7-9-5 8-11-12-9 12-8-8-3 9z M68 22q18-2 17 15-1 13-14 17l-5-9q13-4 7-15z',wave:'M21 43Q20 9 48 7t28 36l-7-6-5 9-8-13-9 11-9-11-8 13z'}[kind];return svg(`<path fill="${color}" d="${d}"/>`)};for(const [id,[c,k]] of Object.entries(hairs))r.ASSETS[id]=hairShape(c,k);
const set=(main,accent,extra='')=>svg(`<path fill="${main}" d="M28 72l10-6h20l10 6-4 35H32z"/><path fill="${accent}" d="M38 68h20l-3 15H41zM31 101h34v7H31z"/><path fill="#45516a" d="M31 106h34l-3 23H51l-3-15-3 15H34z"/><path fill="#f5f0e8" d="M28 126h18v9H24q-4-5 4-9zm23 0h17q9 6 4 9H51z"/>${extra}`);
Object.assign(r.ASSETS,{
'outfit-campus-navy':set('#3d5877','#e9d79b'),
'outfit-hoodie-mint':set('#69a994','#e8d26e','<path fill="#467a6d" d="M36 69q12 14 24 0l3 8-15 9-15-9z"/>'),
'outfit-sport-sky':set('#64a6cf','#f5f5ef','<path fill="#fff" d="M45 78h6v18h-6z"/>'),
'outfit-overall-yellow':set('#e0b64e','#557ea4','<path fill="#557ea4" d="M37 72h22v31H37z"/>'),
'outfit-raincoat':set('#e9c94f','#f5e48d','<path fill="#e9c94f" d="M31 68q17-12 34 0l-7 9H38z"/>'),
'outfit-pajama-bear':set('#b88d68','#ead5b8','<circle fill="#b88d68" cx="38" cy="70" r="5"/><circle fill="#b88d68" cx="58" cy="70" r="5"/>'),
'outfit-cat-hood':set('#786b8f','#d8c8e8','<path fill="#786b8f" d="M32 72l5-12 8 10m19 2-5-12-8 10z"/>'),
'outfit-dino-hood':set('#5f9d69','#d8d35d','<path fill="#d8d35d" d="M46 68l3-10 4 10 4-8 3 12z"/>'),
'outfit-chef':set('#f3eee4','#d95d5d','<path fill="#fff" d="M35 68q-3-10 5-10 8-8 16 0 9 0 5 10z"/>'),
'outfit-scientist':set('#edf2f4','#55a2b5','<path fill="#55a2b5" d="M45 78h6v24h-6z"/><circle fill="#dc6b74" cx="58" cy="88" r="3"/>'),
'outfit-artist':set('#f0dfc7','#dc6c77','<path fill="#6e9ec5" d="M36 80h6v6h-6z"/><path fill="#e2b650" d="M53 91h7v7h-7z"/>'),
'outfit-detective':set('#9b7652','#d9bd79','<path fill="#6b513e" d="M32 71h32v5H32z"/><circle fill="none" cx="71" cy="89" r="8"/><path fill="none" d="M66 95l-9 12"/>'),
'outfit-soccer':set('#4d83b7','#f1d75a','<path fill="#fff" d="M44 78h8v15h-8z"/><circle fill="#eee" cx="73" cy="112" r="9"/>'),
'outfit-rockstar':set('#3e4354','#d45d72','<ellipse fill="#b96845" cx="19" cy="96" rx="11" ry="15"/><path fill="#85533b" d="M24 86l17-27 5 3-17 29z"/>'),
'outfit-ninja':set('#343a48','#8d3e55','<path fill="#343a48" d="M31 69h34l-7 10H38z"/><path fill="#8d3e55" d="M62 76l15 27-5 3-16-25z"/>'),
'outfit-knight-sword':set('#73869a','#d3b24f','<path fill="#b9c6d2" d="M26 73l12-9 5 14-13 10zm44 0-12-9-5 14 13 10z"/><path fill="#c7d1dc" d="M73 72h4v38h-4z"/><path fill="#d2ad48" d="M67 82h16v4H67z"/>'),
'outfit-wizard-wand':set('#5b4a91','#d0b455','<path fill="#d0b455" d="M75 69h3v42h-3z"/><path fill="#f1df73" d="M77 62l3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"/>'),
'outfit-space':set('#e6e8e9','#4d8fb8','<path fill="#4d8fb8" d="M39 73h18v18H39z"/><circle fill="#79c9dc" cx="48" cy="82" r="6"/>'),
'outfit-prince':set('#426ba0','#e2bd55','<path fill="#e2bd55" d="M36 70l4-9 8 6 8-6 4 9z"/>'),
'outfit-princess':set('#bd6f9b','#ead075','<path fill="#d98eb5" d="M28 100h40l8 32H20z"/><path fill="#ead075" d="M36 70l4-9 8 6 8-6 4 9z"/>')
});
const side=(text)=>({emoji:text});Object.assign(r.ASSETS,{'pet-side-flower':side('🌸'),'pet-side-snow':side('❄️'),'pet-side-lightning':side('⚡'),'pet-side-crown':side('👑'),'pet-side-stars':side('✨'),'pet-side-confetti':side('🎉'),'pet-side-bubble':side('🫧'),'pet-side-moonstar':side('🌙')});
})();