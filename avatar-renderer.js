/* V1 modular mini-avatar renderer: one 96x144 full-body canvas for every wearable layer. */
window.StudyVillageAvatar=(()=>{
  const frame=body=>`<svg viewBox="0 0 96 144" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="geometricPrecision">${body}</svg>`;
  const stroke='stroke="#684b43" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"';
  const body=(skin='#ffd2ad',shirt='#e8f0f5')=>frame(`<g ${stroke}><path fill="${skin}" d="M27 32q1-20 21-20t21 20v19q0 18-21 18T27 51z"/><path fill="${skin}" d="M43 67h10v8H43zM22 78q0-5 5-5h4v31h-9zm43-5h4q5 0 5 5v26h-9zM34 106h12v23H34zm16 0h12v23H50z"/><path fill="${shirt}" d="M31 71q17-5 34 0l2 38H29z"/><path fill="#554844" d="M31 125h16v11H28q-3-5 3-11zm18 0h16q6 6 3 11H49z"/></g>`);
  const hairSvg=(kind='short',color='#5b3c2e')=>{const shapes={short:'<path d="M25 39Q22 12 48 9q25 1 23 29l-7-8-5 7-9-11-8 11-8-8-5 10z"/>',bob:'<path d="M23 42Q21 10 48 8t26 34v25l-10 5V38l-7-9-9 10-9-10-7 10v35l-10-7z"/>',pony:'<path d="M25 39Q22 11 48 8t23 31l-7-9-5 8-11-12-9 12-8-8-3 9z"/><path d="M68 22q18-2 17 15-1 13-14 17l-5-9q13-4 7-15z"/>',wave:'<path d="M21 43Q20 9 48 7t28 36l-7-6-5 9-8-13-9 11-9-11-8 13v35l-9 7z"/>'};return frame(`<g fill="${color}" ${stroke}>${shapes[kind]||shapes.short}</g>`)};
  const simple=(bodyMarkup)=>({svg:frame(`<g ${stroke}>${bodyMarkup}</g>`)});
  const BASES={
    'student-default':{svg:body('#ffd2ad','#dbeaf5'),alt:'남자 캐릭터'},
    'student-boy':{svg:body('#ffd2ad','#dbeaf5'),alt:'남자 캐릭터'},
    'student-girl':{svg:body('#ffd2ad','#f4dfe9'),alt:'여자 캐릭터'}
  };
  const INTERNAL_BASES=BASES;
  const ASSETS={
    'hair-short':{svg:hairSvg('short','#5b3c2e')},'hair-bob':{svg:hairSvg('bob','#70462f')},'hair-ponytail':{svg:hairSvg('pony','#6a4330')},'hair-blue':{svg:hairSvg('short','#354d78')},
    'cap-blue':simple('<path fill="#355f91" d="M27 29q3-16 21-16t22 16z"/><path fill="#294f79" d="M47 29h31q-8 7-29 5z"/>'),
    'crown-gold':simple('<path fill="#e2b94e" d="M28 31l2-18 11 8 7-15 8 15 11-8 2 18z"/><circle fill="#8b56bb" cx="48" cy="22" r="3"/>'),
    'leaf-cap':simple('<path fill="#5f8f58" d="M25 29q5-17 23-17 17 0 23 17z"/><path fill="#9bc67c" d="M48 13Q55 1 69 5 62 17 49 19z"/>'),
    'scholar-cap':simple('<path fill="#52658b" d="M19 20L48 8l29 12-29 12z"/><path fill="#d5b65a" d="M31 25h34v9H31z"/>'),
    'glasses-round':{svg:frame('<g fill="#dceef588" stroke="#5c4b44" stroke-width="1.8"><circle cx="37" cy="45" r="7"/><circle cx="59" cy="45" r="7"/><path d="M44 44h8"/></g>')},
    'explorer-goggles':{svg:frame('<g fill="#b9dce288" stroke="#445a62" stroke-width="2"><path d="M27 39h19v12H31q-5-3-4-12zm23 0h19q1 9-4 12H50z"/><path d="M46 43h4"/></g>')},
    'star-monocle':{svg:frame('<g fill="none" stroke="#8a7346" stroke-width="2"><circle cx="59" cy="44" r="8"/><path d="M66 50q5 12 2 25"/></g>')},
    'backpack':simple('<path fill="#805338" d="M67 76q10-8 21 0v34H67z"/><path fill="#d1a34e" d="M71 88h13v8H71z"/>'),
    'field-satchel':simple('<path fill="#8b6545" d="M65 86h25v25H65z"/><path fill="#d4aa50" d="M75 95h6v5h-6z"/>'),
    'book-pack':simple('<path fill="#3f6490" d="M68 78h22v34H68z"/><path fill="#e5bd58" d="M70 89h18v6H70z"/>'),
    'pet-chick':simple('<circle fill="#efd45a" cx="77" cy="118" r="17"/><path fill="#ef9240" d="M73 119h9l-5 6z"/><circle fill="#333" cx="71" cy="113" r="2"/><circle fill="#333" cx="82" cy="113" r="2"/>'),
    'pet-cat':simple('<path fill="#ca8e62" d="M61 108l7-18 10 11 11-11 7 18-4 30H65z"/><circle fill="#333" cx="72" cy="113" r="2"/><circle fill="#333" cx="84" cy="113" r="2"/>'),
    'pet-owl':simple('<path fill="#8e704d" d="M61 108q16-25 33 0v30H61z"/><circle fill="#f0d273" cx="71" cy="115" r="6"/><circle fill="#f0d273" cx="84" cy="115" r="6"/>'),
    'pet-fox':simple('<path fill="#d77943" d="M61 107l5-18 12 11 12-11 6 18-6 31H67z"/><path fill="#f9e7d4" d="M66 116l12 12 12-12-4 17H70z"/>')
  };
  function paint(element,spec){if(!element)return;element.replaceChildren();element.classList.toggle('svg-asset',!!spec?.svg);element.classList.toggle('image-asset',!!spec?.src);if(spec?.svg){element.innerHTML=spec.svg;return}if(spec?.src){const img=document.createElement('img');img.src=spec.src;img.alt=spec.alt||'';img.draggable=false;element.appendChild(img);return}element.textContent=spec?.emoji||''}
  const base=id=>BASES[id]||BASES['student-boy'];
  const asset=(id,fallback='')=>id?(ASSETS[id]||{emoji:fallback,alt:id}):{emoji:'',alt:''};
  function paintBase(element,id='student-boy'){paint(element,base(id));const hair=document.createElement('span');hair.className='base-default-hair';hair.innerHTML=id==='student-girl'?hairSvg('bob','#70462f'):hairSvg('short','#5b3c2e');element.appendChild(hair)}
  function paintAvatarBase(element,id='student-boy'){paint(element,INTERNAL_BASES[id]||INTERNAL_BASES['student-boy'])}
  function paintHair(element,id,baseId='student-boy'){if(id&&ASSETS[id])paint(element,ASSETS[id]);else paint(element,{svg:baseId==='student-girl'?hairSvg('bob','#70462f'):hairSvg('short','#5b3c2e')})}
  function paintItem(element,id,fallback=''){paint(element,asset(id,fallback))}
  function setMotion(container,{moving=false,direction='down'}={}){if(!container)return;const dir=['up','down','left','right'].includes(direction)?direction:'down';container.dataset.motion=moving?'walk':'idle';container.dataset.direction=dir;container.classList.toggle('is-walking',!!moving);container.classList.toggle('is-idle',!moving);container.classList.toggle('facing-left',dir==='left');container.classList.toggle('facing-right',dir==='right');container.classList.toggle('facing-up',dir==='up');container.classList.toggle('facing-down',dir==='down')}
  return{BASES,INTERNAL_BASES,ASSETS,base,asset,paint,paintBase,paintAvatarBase,paintHair,paintItem,setMotion};
})();
