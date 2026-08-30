/* StudyVillage automatic avatar asset normalizer.
 * Goal: future PNGs can have arbitrary transparent margins; runtime crops alpha bounds
 * and remaps every production slot into one shared master coordinate system.
 * No per-item x/y/scale corrections are allowed here.
 */
(()=>{
  const MASTER_SIZE=256;
  const RULES={
    outfit:{x:24,y:70,w:208,h:176},
    pet:{x:145,y:126,w:92,h:116}
  };
  const processed=new WeakMap();

  function slotFor(host){
    const id=String(host?.dataset?.avatarItem||'');
    if(id.startsWith('outfit-'))return'outfit';
    if(id.startsWith('pet-'))return'pet';
    return'';
  }

  function alphaBounds(img){
    const w=img.naturalWidth||0,h=img.naturalHeight||0;
    if(!w||!h)return null;
    const canvas=document.createElement('canvas');
    canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    if(!ctx)return null;
    try{ctx.drawImage(img,0,0,w,h)}catch(_){return null}
    let data;
    try{data=ctx.getImageData(0,0,w,h).data}catch(_){return null}
    let minX=w,minY=h,maxX=-1,maxY=-1;
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        if(data[(y*w+x)*4+3]>8){
          if(x<minX)minX=x;if(x>maxX)maxX=x;
          if(y<minY)minY=y;if(y>maxY)maxY=y;
        }
      }
    }
    return maxX<minX?null:{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
  }

  function normalizedDataUrl(img,rule){
    const b=alphaBounds(img);if(!b)return'';
    const out=document.createElement('canvas');out.width=MASTER_SIZE;out.height=MASTER_SIZE;
    const ctx=out.getContext('2d');if(!ctx)return'';
    ctx.imageSmoothingEnabled=false;
    const scale=Math.min(rule.w/b.w,rule.h/b.h);
    const dw=Math.max(1,Math.round(b.w*scale));
    const dh=Math.max(1,Math.round(b.h*scale));
    const dx=Math.round(rule.x+(rule.w-dw)/2);
    const dy=Math.round(rule.y+rule.h-dh);
    ctx.drawImage(img,b.x,b.y,b.w,b.h,dx,dy,dw,dh);
    return out.toDataURL('image/png');
  }

  function normalize(img){
    const host=img?.parentElement;const slot=slotFor(host);if(!slot)return;
    const original=img.dataset.avatarNormalizeSource||img.currentSrc||img.src;
    if(!original||original.startsWith('data:image/png;base64,')&&img.dataset.avatarNormalized==='true')return;
    if(processed.get(img)===original)return;
    processed.set(img,original);
    const run=()=>{
      if(img.dataset.avatarNormalized==='true'&&img.dataset.avatarNormalizeSource===original)return;
      const data=normalizedDataUrl(img,RULES[slot]);if(!data)return;
      img.dataset.avatarNormalizeSource=original;
      img.dataset.avatarNormalized='true';
      img.src=data;
    };
    if(img.complete&&img.naturalWidth)run();else img.addEventListener('load',run,{once:true});
  }

  function scan(root=document){
    if(root instanceof HTMLImageElement)normalize(root);
    root.querySelectorAll?.('[data-avatar-item^="outfit-"] > img,[data-avatar-item^="pet-"] > img').forEach(normalize);
  }

  const observer=new MutationObserver(records=>{
    records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)scan(node)}));
  });
  function start(){scan(document);observer.observe(document.documentElement,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.StudyVillageAvatarNormalizer={MASTER_SIZE,RULES,scan};
})();
