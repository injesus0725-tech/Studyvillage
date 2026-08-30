/* StudyVillage automatic avatar asset normalizer.
 * Future PNGs may have different transparent margins. Runtime measures alpha pixels
 * and remaps every production asset into one 256x256 master coordinate system.
 * Per-item x/y/scale exceptions are intentionally forbidden.
 */
(()=>{
  const MASTER_SIZE=256;
  const RULES={
    outfit:{centerX:128,bottomY:246,maxHeight:180,maxWidth:248},
    pet:{centerX:180,bottomY:246,maxHeight:112,maxWidth:96}
  };
  const processed=new WeakMap();

  function slotFor(host){
    const id=String(host?.dataset?.avatarItem||'');
    if(id.startsWith('outfit-'))return'outfit';
    if(id.startsWith('pet-'))return'pet';
    return'';
  }

  function alphaMetrics(img){
    const w=img.naturalWidth||0,h=img.naturalHeight||0;
    if(!w||!h)return null;
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return null;
    try{ctx.drawImage(img,0,0,w,h)}catch(_){return null}
    let data;try{data=ctx.getImageData(0,0,w,h).data}catch(_){return null}
    let minX=w,minY=h,maxX=-1,maxY=-1,count=0;
    const columns=new Uint32Array(w);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>8){
      if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
      columns[x]++;count++;
    }
    if(maxX<minX||!count)return null;
    let acc=0,medianX=minX;
    for(let x=minX;x<=maxX;x++){acc+=columns[x];if(acc>=count/2){medianX=x;break}}
    return{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,maxX,maxY,medianX,sourceW:w,sourceH:h};
  }

  function normalizedDataUrl(img,rule){
    const m=alphaMetrics(img);if(!m)return'';
    const out=document.createElement('canvas');out.width=MASTER_SIZE;out.height=MASTER_SIZE;
    const ctx=out.getContext('2d');if(!ctx)return'';
    ctx.imageSmoothingEnabled=false;
    const scale=Math.min(rule.maxHeight/m.h,rule.maxWidth/m.w);
    const dx=Math.round(rule.centerX-m.medianX*scale);
    const dy=Math.round(rule.bottomY-m.maxY*scale);
    ctx.drawImage(img,dx,dy,m.sourceW*scale,m.sourceH*scale);
    return out.toDataURL('image/png');
  }

  function normalize(img){
    const host=img?.parentElement,slot=slotFor(host);if(!slot)return;
    const original=img.dataset.avatarNormalizeSource||img.currentSrc||img.src;
    if(!original||(original.startsWith('data:image/png;base64,')&&img.dataset.avatarNormalized==='true'))return;
    if(processed.get(img)===original)return;processed.set(img,original);
    const run=()=>{
      if(img.dataset.avatarNormalized==='true'&&img.dataset.avatarNormalizeSource===original)return;
      const data=normalizedDataUrl(img,RULES[slot]);if(!data)return;
      img.dataset.avatarNormalizeSource=original;img.dataset.avatarNormalized='true';
      img.style.setProperty('width','100%','important');
      img.style.setProperty('height','100%','important');
      img.style.setProperty('object-fit','contain','important');
      img.style.setProperty('transform','none','important');
      img.style.setProperty('clip-path','none','important');
      img.src=data;
    };
    if(img.complete&&img.naturalWidth)run();else img.addEventListener('load',run,{once:true});
  }

  function scan(root=document){
    if(root instanceof HTMLImageElement)normalize(root);
    if(root?.matches?.('[data-avatar-item^="outfit-"],[data-avatar-item^="pet-"]'))root.querySelectorAll?.(':scope > img').forEach(normalize);
    root.querySelectorAll?.('[data-avatar-item^="outfit-"] > img,[data-avatar-item^="pet-"] > img').forEach(normalize);
  }

  const observer=new MutationObserver(records=>records.forEach(record=>{
    if(record.type==='attributes'){scan(record.target);return;}
    record.addedNodes.forEach(node=>{if(node.nodeType===1)scan(node)});
  }));
  function start(){
    scan(document);
    observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-avatar-item']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.StudyVillageAvatarNormalizer={MASTER_SIZE,RULES,scan};
})();
