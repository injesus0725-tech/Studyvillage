/* StudyVillage lightweight avatar basics pack v3: bold silhouettes for tiny on-screen characters. */
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
    'pet-penguin':{svg:svg('<ellipse fill="#343b48" cx="81" cy="120" rx="14" ry="17"/><ellipse fill="#f4eee3" cx="81" cy="123" rx="9" ry="11"/><path fill="#e7ad42" d="M77 117h8l-4 5z"/><circle fill="#f4eee3" cx="76" cy="113" r="2"/><circle fill="#f4eee3" cx="86" cy="113" r="2"/>')},
    'pet-bee':{svg:svg('<ellipse fill="#e2b94c" cx="82" cy="119" rx="13" ry="10"/><path fill="#3c3b3c" d="M74 111h4v16h-4zm9-2h4v20h-4z"/><ellipse fill="#dff4f7" cx="75" cy="107" rx="7" ry="5"/><ellipse fill="#dff4f7" cx="90" cy="107" rx="7" ry="5"/>')},
    'pet-turtle':{svg:svg('<ellipse fill="#66865f" cx="81" cy="124" rx="15" ry="10"/><circle fill="#79a06f" cx="96" cy="122" r="6"/><path fill="#4d6d49" d="M70 123q11-15 22 0-11 13-22 0z"/><circle fill="#2f382f" stroke="none" cx="98" cy="121" r="1.5"/>')}
  });
})();
