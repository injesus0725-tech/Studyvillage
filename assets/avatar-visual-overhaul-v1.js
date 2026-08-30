/* Distinct full-body special characters for the tiny StudyVillage avatar canvas. */
(()=>{
  const r=window.StudyVillageAvatar;if(!r?.BASES||!r?.INTERNAL_BASES)return;
  const frame=body=>`<svg viewBox="0 0 96 144" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="geometricPrecision">${body}</svg>`;
  const ink='#684b43',stroke=`stroke="${ink}" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"`;
  const face=()=>`<path fill="#f2bf98" d="M29 29Q30 12 48 12t19 17v20q-1 18-19 18T29 49z"/><ellipse fill="#493935" stroke="none" cx="38" cy="43" rx="2" ry="3"/><ellipse fill="#493935" stroke="none" cx="58" cy="43" rx="2" ry="3"/><path fill="none" d="M43 56q5 4 10 0"/>`;
  const hair=(gender,color,kind)=>{
    const boy={short:`<path fill="${color}" d="M25 39Q22 11 48 9t23 30l-8-9-6 8-9-11-9 11-8-8-3 9z"/>`,spike:`<path fill="${color}" d="M24 40Q21 17 32 13l3-9 7 7 6-9 6 9 8-7 2 10q9 6 8 26l-8-9-8 8-9-11-9 11-7-8z"/>`,side:`<path fill="${color}" d="M25 39Q24 12 48 10t23 28l-7-7-7 8-8-12-10 12-8-8-3 8z"/><path fill="none" d="M31 22q14-8 31-2"/>`};
    const girl={bob:`<path fill="${color}" d="M23 42Q21 10 48 8t26 34v24l-10 5V39l-7-9-9 10-9-10-7 10v31l-10-5z"/>`,pony:`<path fill="${color}" d="M25 39Q22 11 48 8t23 31l-7-9-5 8-11-12-9 12-8-8-3 8z"/><path fill="${color}" d="M68 22q18-2 17 15-1 13-14 17l-5-9q13-4 7-15z"/>`,wave:`<path fill="${color}" d="M22 43Q20 9 48 7t27 36v35l-9 6V39l-9-10-9 11-9-11-8 10v45l-9-6z"/>`};
    const map=gender==='girl'?girl:boy;return map[kind]||map[Object.keys(map)[0]];
  };
  const body=(style,p,a)=>{
    const arms=`<path fill="#f2bf98" d="M22 78q0-5 6-5h4v30H22zm42-5h4q6 0 6 5v25H64z"/>`,legs=`<path fill="#f2bf98" d="M35 106h11v22H35zm15 0h11v22H50z"/><path fill="#4c4747" d="M31 125h16v11H27q-3-5 4-11zm18 0h16q7 6 3 11H49z"/>`;
    const styles={
      scout:`<path fill="${p}" d="M30 70h36l4 39H26z"/><path fill="${a}" d="M31 82h34v6H31zM45 70h6v39h-6z"/><path fill="#6d5037" d="M27 100h42v7H27z"/><rect fill="#d6b45a" x="45" y="101" width="7" height="5"/>`,
      scholar:`<path fill="${p}" d="M29 72l10-5h18l10 5-3 37H32z"/><path fill="#f3ebd8" d="M39 68l9 15 9-15-2 18H41z"/><path fill="${a}" d="M46 80h4l2 19-4 5-4-5z"/><path fill="none" d="M48 84v24M34 93h8m12 0h8"/>`,
      runner:`<path fill="${p}" d="M29 71h38l4 38H25z"/><path fill="#f4efe3" d="M46 70h4v39h-4zM28 90h40v5H28z"/><path fill="${a}" d="M31 72h8v37h-8zm26 0h8v37h-8z"/>`,
      mage:`<path fill="${p}" d="M30 68h36l11 46H19z"/><path fill="${a}" d="M38 68l10 15 10-15 8 8-18 18-18-18z"/><path fill="#d8b85c" d="M47 84h2v29h-2z"/><path fill="#e8d66d" d="M43 95l5-6 5 6-5 6z"/>`,
      knight:`<path fill="#34445b" d="M29 73l10-8h18l10 8-4 37H33z"/><path fill="${p}" d="M23 76l14-11 5 14-12 9zm50 0L59 65l-5 14 12 9z"/><path fill="#cbd4de" d="M40 68l8 11 8-11 5 38H35z"/><path fill="${a}" d="M34 96h28v7H34zM46 79h4v17h-4z"/>`,
      ranger:`<path fill="${p}" d="M30 70h36l3 39H27z"/><path fill="${a}" d="M30 70l-9 16 10 7 7-18zm36 0 9 16-10 7-7-18z"/><path fill="#6c4c35" d="M27 96h42v7H27z"/><path fill="#d7b35b" d="M45 97h7v5h-7z"/>`,
      bard:`<path fill="#f0e4d0" d="M30 70h36l2 39H28z"/><path fill="${p}" d="M31 73h12l5 35H31zm34 0H53l-5 35h17z"/><path fill="${a}" d="M29 88h39v7H29z"/><path fill="#d9b65d" d="M42 68h12l-6 12z"/>`,
      hero:`<path fill="${p}" d="M29 70h38l7 43H22z"/><path fill="${a}" d="M28 72l20 15 20-15-5 15-15 10-15-10z"/><path fill="#d6b45a" d="M46 83h4v30h-4zM29 101h38v6H29z"/>`,
      guardian:`<path fill="#596675" d="M29 69h38l8 45H21z"/><path fill="${p}" d="M33 70h10l5 39 5-39h10l5 39H28z"/><path fill="${a}" d="M28 92h40v7H28z"/><path fill="#dce3e8" d="M39 68l9 12 9-12-3 19H42z"/>`
    };return `${arms}${styles[style]||styles.scout}${legs}`;
  };
  const themes=[
    ['02','scout','#79513c','#d3ad59','#5b3c2e','short','bob'],
    ['03','scholar','#405c82','#b79042','#654535','side','bob'],
    ['04','runner','#5f8a66','#e6c656','#70462f','short','pony'],
    ['05','mage','#4f65a0','#836ab5','#294f79','side','wave'],
    ['06','knight','#8796a9','#d7b74d','#c79648','spike','pony'],
    ['07','ranger','#4f7a58','#b28a45','#476b3f','side','wave'],
    ['08','bard','#7e5b94','#d38d70','#78506e','short','bob'],
    ['09','hero','#a64c43','#d5aa52','#b34d43','spike','pony'],
    ['10','guardian','#768393','#d3b85e','#bfc3c8','side','wave']
  ];
  for(const [n,style,p,a,h,boyHair,girlHair] of themes){for(const gender of ['boy','girl']){const id=`character-${gender}-${n}`,svg=frame(`<g ${stroke}>${body(style,p,a)}${face()}${hair(gender,h,gender==='girl'?girlHair:boyHair)}</g>`),spec={svg,alt:`${style} special character`};r.BASES[id]=spec;r.INTERNAL_BASES[id]=spec}}
})();
