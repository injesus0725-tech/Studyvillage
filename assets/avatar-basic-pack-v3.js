/* StudyVillage lightweight avatar basics packs v3+v4: bold silhouettes for tiny on-screen characters. */
(()=>{
  const renderer=window.StudyVillageAvatar;if(!renderer?.ASSETS)return;
  const frame=body=>`<svg viewBox="0 0 96 144" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="geometricPrecision">${body}</svg>`;
  const stroke='stroke="#684b43" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"';
  const svg=body=>frame(`<g ${stroke}>${body}</g>`);
  Object.assign(renderer.ASSETS,{
    'hair-mohawk':{svg:svg('<path fill="#353239" d="M32 36q1-16 7-19l4 8 5-18 5 18 6-10 5 22-7-6-9 7-9-7z"/>')},
    'hair-braid':{svg:svg('<path fill="#70462f" d="M24 40Q22 12 48 9t23 31l-8-9-7 8-9-11-9 11-8-9z"/><path fill="#70462f" d="M68 31q10 10 2 20 10 9 1 18 9 8 1 18l-7-5q7-6 0-12 8-7 0-14 7-8 0-15z"/>')},
    'hat-cat-ears':{svg:svg('<path fill="#54505d" d="M28 29l3-18 12 10h10l12-10 3 18z"/><path fill="#d88ca4" d="M33 17l6 7h-8zm30 0-6 7h8z"/>')},
    'hat-headphones':{svg:frame('<g fill="none" stroke="#445a78" stroke-width="4"><path d="M28 35q0-24 20-24t20 24"/><rect fill="#547da7" x="22" y="32" width="10" height="20" rx="5"/><rect fill="#547da7" x="64" y="32" width="10" height="20" rx="5"/></g>')},
    'glasses-red':{svg:frame('<g fill="#f5d9dd66" stroke="#a9464d" stroke-width="1.8"><circle cx="37" cy="45" r="7"/><circle cx="59" cy="45" r="7"/><path d="M44 44h8M30 42l-6-2m42 2 6-2"/></g>')},
    'outfit-sport-yellow':{svg:svg('<path fill="#d9b84c" d="M29 73l9-6h20l9 6-3 36H32z"/><path fill="#f3f0e7" d="M46 68h4v41h-4zM31 88h34v4H31z"/>')},
    'outfit-cardigan-pink':{svg:svg('<path fill="#cf7791" d="M29 73l9-6h20l9 6-3 36H32z"/><path fill="#f4eadf" d="M42 69h12l-3 40h-6z"/><circle fill="#d5b257" cx="48" cy="87" r="2"/><circle fill="#d5b257" cx="48" cy="98" r="2"/>')},
    'bottom-jogger-gray':{svg:svg('<path fill="#666b72" d="M29 102h38l-3 29H52l-4-18-4 18H32z"/><path fill="#44494f" d="M30 103h36v5H30zM32 127h12v4H32zm20 0h12v4H52z"/>')},
    'shoes-sneakers-green':{svg:svg('<path fill="#f6f2e8" d="M28 122h18v13H24q-5-5 4-13zm22 0h18q9 8 4 13H50z"/><path fill="#4d8a67" d="M30 122h14v7H27zm23 0h14l3 7H53z"/>')},
    'bag-school-navy':{svg:svg('<path fill="#465e7e" d="M68 78h22v33H68z"/><path fill="#d2b25c" d="M72 85h14v8H72z"/><path fill="none" d="M72 79q7-12 14 0"/>')},
    'hand-camera':{svg:svg('<rect fill="#41464e" x="5" y="82" width="31" height="21" rx="4"/><circle fill="#9ec2d7" cx="20" cy="93" r="7"/><rect fill="#c49b45" x="10" y="78" width="10" height="6" rx="2"/>')},
    'hand-microphone':{svg:svg('<circle fill="#59606a" cx="14" cy="79" r="7"/><path fill="#3d4249" d="M12 84h5l13 20-5 3z"/><path fill="#b99a47" d="M21 95l5-3 3 5-5 3z"/>')},
    'pet-penguin':{svg:svg('<ellipse fill="#343b48" cx="78" cy="118" rx="17" ry="20"/><ellipse fill="#f4eee3" cx="78" cy="122" rx="11" ry="14"/><path fill="#e7ad42" d="M74 115h9l-5 6z"/><circle fill="#f4eee3" cx="72" cy="110" r="2"/><circle fill="#f4eee3" cx="84" cy="110" r="2"/>')},
    'pet-bee':{svg:svg('<ellipse fill="#e2b94c" cx="79" cy="118" rx="17" ry="13"/><path fill="#3c3b3c" d="M69 108h5v20h-5zm11-3h5v25h-5z"/><ellipse fill="#dff4f7" cx="70" cy="102" rx="9" ry="6"/><ellipse fill="#dff4f7" cx="89" cy="102" rx="9" ry="6"/>')},
    'pet-turtle':{svg:svg('<ellipse fill="#66865f" cx="77" cy="122" rx="18" ry="12"/><circle fill="#79a06f" cx="94" cy="120" r="7"/><path fill="#4d6d49" d="M63 121q14-18 28 0-14 15-28 0z"/><circle fill="#2f382f" stroke="none" cx="96" cy="119" r="1.5"/>')},
    'hair-spiky-brown':{svg:svg('<path fill="#5b3c2e" d="M24 40Q21 16 32 13l3-9 7 7 6-9 6 9 8-7 2 10q9 5 8 26l-8-9-8 8-9-11-9 11-7-8z"/>')},
    'hair-shoulder-wave':{svg:svg('<path fill="#7a4d3d" d="M22 43Q20 10 48 8t27 35v35l-9 6V39l-9-10-9 11-9-11-8 10v45l-9-6z"/><path fill="none" d="M24 52q-4 10 2 18m46-18q4 10-2 18"/>')},
    'hat-visor-orange':{svg:svg('<path fill="#d77c3f" d="M30 23q5-10 18-10t18 10H30z"/><path fill="#bd6132" d="M26 23h44q8 2 11 6-12 4-33 1-13-2-22-7z"/>')},
    'hat-beret-purple':{svg:svg('<path fill="#795b94" d="M27 28q4-16 21-16t21 16z"/><path fill="#5f4778" d="M25 28h46v5H25z"/><path fill="none" d="M48 12q-2-6 3-8"/>')},
    'glasses-star':{svg:frame('<g fill="#f1d15f99" stroke="#7a6142" stroke-width="1.6"><path d="M37 36l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/><path d="M59 36l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/><path d="M44 44h8"/></g>')},
    'outfit-polo-green':{svg:svg('<path fill="#5d8b68" d="M30 72l8-5h20l8 5 7 8-7 7-2-6 1 28H31l1-28-2 6-7-7z"/><path fill="#f0eadb" d="M43 67h10l-2 12h-6z"/>')},
    'outfit-overalls-blue':{svg:svg('<path fill="#e8ddc9" d="M31 70h34l-2 38H33z"/><path fill="#4d739e" d="M36 78h24l3 31H33z"/><path fill="none" d="M38 68v15m20-15v15"/><circle fill="#d6ad55" cx="39" cy="81" r="2"/><circle fill="#d6ad55" cx="57" cy="81" r="2"/>')},
    'bottom-leggings-black':{svg:svg('<path fill="#2f3137" d="M31 102h34l-3 30H50l-2-20-2 20H34z"/>')},
    'shoes-runners-purple':{svg:svg('<path fill="#6f5a95" d="M28 123h18v12H24q-5-5 4-12zm22 0h18q9 7 4 12H50z"/><path fill="#f3efe7" d="M24 132h22v4H23zm26 0h22v4H50z"/>')},
    'bag-tote-cream':{svg:svg('<path fill="#eadcbf" d="M67 85h23v27H67z"/><path fill="none" d="M71 86q2-14 8-14t8 14"/><path fill="#b68d54" d="M73 95h11v4H73z"/>')},
    'hand-brush':{svg:svg('<path fill="#9a6b45" d="M17 75l5-2 10 29-5 2z"/><path fill="#d2b078" d="M14 70l9-3 2 9-9 3z"/>')},
    'hand-flashlight':{svg:svg('<path fill="#4b5868" d="M12 86h11l5 22H17z"/><path fill="#d9c45a" d="M11 81h13v8H11z"/><path fill="#fff2a8" d="M24 81l13-8v16z"/>')},
    'pet-koala':{svg:svg('<circle fill="#9ba2a7" cx="78" cy="118" r="17"/><circle fill="#858c91" cx="65" cy="107" r="8"/><circle fill="#858c91" cx="91" cy="107" r="8"/><ellipse fill="#d9dde0" cx="78" cy="122" rx="10" ry="9"/><ellipse fill="#45484b" cx="78" cy="118" rx="4" ry="5"/><circle fill="#333" cx="72" cy="113" r="2"/><circle fill="#333" cx="84" cy="113" r="2"/>')},
    'pet-duck':{svg:svg('<ellipse fill="#ead45a" cx="78" cy="121" rx="17" ry="14"/><circle fill="#ead45a" cx="78" cy="108" r="12"/><path fill="#e79242" d="M84 110h12l-10 6z"/><circle fill="#333" cx="74" cy="106" r="2"/>')},
    'pet-star':{svg:svg('<path fill="#e8c857" d="M78 98l7 13 14 2-10 10 3 14-14-7-13 7 3-14-11-10 15-2z"/><circle fill="#574b3f" cx="73" cy="119" r="1.8"/><circle fill="#574b3f" cx="83" cy="119" r="1.8"/><path fill="none" d="M74 126q4 3 8 0"/>')}
  });
})();
