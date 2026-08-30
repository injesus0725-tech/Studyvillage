/* Readable collectible details for the 96x144 mini-avatar canvas. */
(()=>{
const r=window.StudyVillageAvatar;if(!r?.ASSETS)return;
const add=(id,svg)=>{const a=r.ASSETS[id];if(a?.svg)a.svg=a.svg.replace('</g></svg>',`${svg}</g></svg>`)};
const M={
tie:`<path fill="#f6efdf" d="M39 68l9 14 9-14-2 18H41z"/><path fill="#c69e43" d="M46 80h4l2 18-4 6-4-6z"/>`,
hood:`<path fill="#314b58" d="M34 69q14 19 28 0l5 8-19 13-19-13z"/><path fill="none" d="M43 84v20m10-20v20"/>`,
stripe:`<path fill="#fff9" d="M29 83h38v7H29zM30 98h36v6H30z"/>`,
overall:`<path fill="#527aa0" d="M36 76h24v31H36zM36 68h6v14h-6zm18 0h6v14h-6z"/><circle fill="#e7c65b" cx="40" cy="79" r="2"/><circle fill="#e7c65b" cx="56" cy="79" r="2"/>`,
apron:`<path fill="#f8f0df" d="M38 76h20l7 35H31z"/><path fill="none" d="M38 84H27m31 0h11"/>`,
coat:`<path fill="#edf3f1" d="M29 70h38l4 42H25z"/><path fill="#55a1ad" d="M46 70h4v42h-4z"/><circle fill="#456b76" cx="55" cy="88" r="2"/><circle fill="#456b76" cx="55" cy="98" r="2"/>`,
armor:`<path fill="#aebcca" d="M23 74l14-10 6 15-14 10zm50 0L59 64l-6 15 14 10z"/><path fill="#dce5ec" d="M39 68l9 13 9-13 5 35H34z"/>`,
cape:`<path fill="#7f3650" d="M30 70L16 112l18-8 14 15 14-15 18 8-14-42-18 16z" opacity=".9"/>`,
skirt:`<path fill="#d98bab" d="M31 101h34l9 29H22z"/><path fill="#f5d675" d="M30 101h36v7H30z"/>`,
robe:`<path fill="#59488e" d="M29 69h38l11 62H18z"/><path fill="#29234e" d="M37 68l11 16 11-16 9 9-20 18-20-18z"/>`,
belt:`<path fill="#604938" d="M28 97h40v8H28z"/><rect fill="#e1bd54" x="44" y="98" width="9" height="6"/>`,
jersey:`<path fill="#fff9" d="M42 74h12v24H42z"/><path fill="none" stroke-width="3" d="M35 74v28m26-28v28"/>`,
kimono:`<path fill="#f1e8d8" d="M38 68l10 15 11-15 7 7-18 19-18-19z"/><path fill="#d8b450" d="M31 92h34v9H31z"/>`,
guitar:`<ellipse fill="#bd6842" cx="18" cy="101" rx="12" ry="16"/><circle fill="#4a3530" cx="18" cy="101" r="4"/><path fill="#875039" d="M23 90l18-31 6 3-18 34z"/>`,
sword:`<path fill="#dce8f0" d="M75 67h5v45h-5z"/><path fill="#e8c45b" d="M68 80h19v5H68z"/><path fill="#6f4b37" d="M74 111h7v13h-7z"/>`,
wand:`<path fill="#d0b354" d="M76 70h4v44h-4z"/><path fill="#f2dc6b" d="M78 57l4 9 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1z"/>`,
bow:`<path fill="none" stroke="#8a5a37" stroke-width="3" d="M77 67q18 22 0 47M77 67v47"/><path fill="#d9c25c" d="M63 88h26v3H63z"/>`,
camera:`<rect fill="#343b44" x="68" y="84" width="24" height="18" rx="3"/><circle fill="#79b6cb" cx="80" cy="93" r="6"/><path fill="#d8b650" d="M72 79h9v6h-9z"/>`,
ball:`<circle fill="#e17643" cx="78" cy="99" r="13"/><path fill="none" d="M65 99h26M78 86v26M68 90l20 18m0-18-20 18"/>`,
wing:`<path fill="#bce4df" d="M31 75Q8 63 13 96q12 3 23-8m29-13q23-12 18 21-12 3-23-8z" opacity=".88"/>`,
dragon:`<path fill="#477b67" d="M30 80L9 69l9 23-13 7 27 8m34-27 21-11-9 23 13 7-27 8z"/>`,
palette:`<path fill="#ddb873" d="M10 88q18-11 28 3 6 10-7 10-6 0-5 8-13 2-20-7-5-8 4-14z"/><circle fill="#d85b62" cx="15" cy="94" r="2"/><circle fill="#4e93bd" cx="22" cy="91" r="2"/><circle fill="#69a060" cx="29" cy="94" r="2"/>`};
const outfits={
'campus-navy':['tie'],'hoodie-mint':['hood'],'sport-sky':['stripe'],'overall-yellow':['overall'],raincoat:['stripe','hood'],'pajama-bear':['hood'],'cat-hood':['hood','tie'],'dino-hood':['hood','stripe'],chef:['apron'],scientist:['coat'],artist:['apron','palette'],detective:['cape','belt'],soccer:['jersey'],rockstar:['belt','guitar'],ninja:['belt','sword'],'knight-sword':['armor','sword'],'wizard-wand':['robe','wand'],space:['coat','cape'],prince:['cape','tie'],princess:['cape','skirt'],'school-beige':['tie'],denim:['overall'],baseball:['jersey'],basketball:['jersey','ball'],doctor:['coat','tie'],firefighter:['stripe','belt'],pilot:['tie','cape'],sailor:['stripe','tie'],fairy:['skirt','wing'],dragon:['armor','dragon'],'winter-coat':['hood','stripe'],'summer-marine':['stripe','tie'],'hanbok-blue':['kimono'],'hanbok-pink':['kimono','skirt'],archer:['belt','bow'],pirate:['cape','sword'],baker:['apron','hood'],vet:['coat','tie'],gardener:['overall','belt'],photographer:['belt','camera']};
for(const[n,parts]of Object.entries(outfits))add(`outfit-${n}`,parts.map(x=>M[x]).join(''));

const petMarks={
maltese:`<circle fill="#fffaf2" cx="71" cy="104" r="6"/><circle fill="#fffaf2" cx="89" cy="104" r="6"/>`,'poodle-brown':`<circle fill="#b77a58" cx="70" cy="103" r="7"/><circle fill="#b77a58" cx="90" cy="103" r="7"/>`,corgi:`<path fill="#f4dfbd" d="M71 103l9 7 9-7-3 12H74z"/>`,shiba:`<path fill="#f1d9b8" d="M72 102l8 7 8-7-3 12H75z"/>`,retriever:`<path fill="#d29a53" d="M68 127q-14 7-7 11 10 2 19-8z"/>`,pomeranian:`<circle fill="#e8b878" cx="80" cy="112" r="15"/>`,husky:`<path fill="#eef1f2" d="M70 101l10 9 10-9-4 15H74z"/><circle fill="#6fc5e3" cx="76" cy="111" r="2.5"/><circle fill="#6fc5e3" cx="85" cy="111" r="2.5"/>`,dalmatian:`<circle fill="#55545a" cx="72" cy="104" r="4"/><circle fill="#55545a" cx="89" cy="123" r="4"/>`,beagle:`<path fill="#f0d2ad" d="M74 100h12v14H74z"/>`,schnauzer:`<path fill="#ddd9d1" d="M69 115h22l-5 12-6-5-6 5z"/>`,bulldog:`<path fill="#e6cdb8" d="M68 107h24v15H68z"/>`,
'cat-cheese':`<path fill="#a96335" d="M71 102h18v4H71z"/>`,'cat-tuxedo':`<path fill="#f2eee7" d="M73 101h14v15H73z"/>`,'cat-tabby':`<path fill="#4f5050" d="M71 100h18v3H71zm3 6h12v3H74z"/>`,'cat-calico':`<path fill="#ce744b" d="M68 104q6-11 12 1v9H69zm14-9q9 0 11 11l-9 4z"/>`,'cat-black':`<path fill="#806c9b" d="M73 102h14v4H73z"/>`,'cat-white':`<path fill="#d7c5d4" d="M73 101h14v5H73z"/>`,'cat-gray':`<path fill="#4e555d" d="M72 101h16v3H72z"/>`,'cat-cream':`<path fill="#f2e4cf" d="M74 115h12v14H74z"/>`,
'rabbit-pink':`<ellipse fill="#e9a9ba" cx="75" cy="98" rx="2" ry="12"/><ellipse fill="#e9a9ba" cx="87" cy="98" rx="2" ry="12"/>`,'rabbit-brown':`<path fill="#d6a681" d="M72 116h16v10H72z"/>`,'hamster-gold':`<circle fill="#d49b51" cx="69" cy="106" r="6"/><circle fill="#d49b51" cx="91" cy="106" r="6"/>`,otter:`<path fill="#805d49" d="M68 127q-15 7-7 12 11 2 20-9z"/>`,'penguin-blue':`<path fill="#eef2f2" d="M72 103h16l4 26H68z"/><path fill="#e7a849" d="M77 116h7l-4 5z"/>`,'panda-baby':`<circle fill="#30333a" cx="70" cy="103" r="6"/><circle fill="#30333a" cx="90" cy="103" r="6"/><ellipse fill="#30333a" cx="75" cy="112" rx="4" ry="5"/><ellipse fill="#30333a" cx="86" cy="112" rx="4" ry="5"/>`,'fox-snow':`<path fill="#a9bed0" d="M70 128q-16 3-11 11 13 5 24-8z"/>`,'dragon-green':`<path fill="#79b98b" d="M69 113l-14-8 6 17 8 5m22-14 14-8-6 17-8 5z"/>`,'dragon-blue':`<path fill="#78b4d2" d="M69 113l-14-8 6 17 8 5m22-14 14-8-6 17-8 5z"/>`,chick:`<path fill="#e68c3d" d="M76 115h9l-5 5z"/>`,hedgehog:`<path fill="#5d493c" d="M66 113l4-15 5 8 5-15 6 15 7-10 2 19z"/>`,squirrel:`<circle fill="#ad683f" cx="94" cy="116" r="12"/><circle fill="#e4aa6b" cx="94" cy="116" r="6"/>`,frog:`<circle fill="#5fa557" cx="71" cy="102" r="7"/><circle fill="#5fa557" cx="89" cy="102" r="7"/>`,owl:`<circle fill="#e1c96e" cx="75" cy="112" r="6"/><circle fill="#e1c96e" cx="86" cy="112" r="6"/><path fill="#e49b3e" d="M77 119h7l-4 5z"/>`};
for(const[n,mark]of Object.entries(petMarks))add(`pet-${n}`,mark);
})();
