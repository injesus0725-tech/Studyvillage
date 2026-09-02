/* Electron-safe teacher input dialog. Browser prompt() is unavailable in the portable app. */
(()=>{
  let active=false;
  const queue=[];
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function next(){
    if(active||!queue.length)return;
    active=true;
    const {message,defaultValue,options,resolve}=queue.shift();
    const overlay=document.createElement('div');
    overlay.dataset.adminInputDialog='true';
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(18,35,28,.48);display:grid;place-items:center;padding:18px';
    const multiline=options.multiline??(String(message).includes('\n')&&options.type!=='number');
    const type=options.type||(/비밀번호|비번/.test(message)?'password':'text');
    overlay.innerHTML=`<section role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title" style="width:min(520px,100%);max-height:88vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.28);padding:22px"><h2 id="admin-dialog-title" style="margin:0 0 12px;font-size:1.25rem">${esc(options.title||'교사용 입력')}</h2><p style="white-space:pre-wrap;line-height:1.55;margin:0 0 14px;color:#334b40">${esc(message)}</p>${multiline?'<textarea data-dialog-input rows="5" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #9fb4a7;border-radius:10px;font:inherit;resize:vertical"></textarea>':`<input data-dialog-input type="${esc(type)}" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #9fb4a7;border-radius:10px;font:inherit">`}<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button type="button" data-dialog-cancel style="padding:9px 16px">취소</button><button type="button" data-dialog-ok style="padding:9px 16px">확인</button></div></section>`;
    document.body.appendChild(overlay);
    const input=overlay.querySelector('[data-dialog-input]');
    input.value=String(defaultValue??'');
    if(type==='number'){input.inputMode='numeric';input.pattern='[0-9]*';input.min=String(options.min??0);if(options.max!=null)input.max=String(options.max)}
    if(options.placeholder)input.placeholder=options.placeholder;
    let closed=false;
    const focusInput=()=>{if(closed||!input.isConnected)return;input.focus({preventScroll:true})};
    const close=value=>{if(closed)return;closed=true;document.removeEventListener('keydown',onKey,true);window.removeEventListener('focus',focusInput);overlay.remove();active=false;resolve(value);next()};
    const onKey=event=>{if(event.key==='Escape'){event.preventDefault();close(null)}else if(event.key==='Enter'&&(!multiline||!event.shiftKey)){event.preventDefault();close(input.value)}};
    overlay.querySelector('[data-dialog-cancel]').addEventListener('click',()=>close(null));
    overlay.querySelector('[data-dialog-ok]').addEventListener('click',()=>close(input.value));
    overlay.addEventListener('pointerdown',event=>{if(event.target===overlay)return;requestAnimationFrame(focusInput)},true);
    overlay.addEventListener('click',event=>{if(event.target===overlay)close(null);else if(!event.target.closest('button'))focusInput()});
    document.addEventListener('keydown',onKey,true);
    window.addEventListener('focus',focusInput);
    input.setAttribute('autofocus','');
    for(const delay of [0,60,180,400])setTimeout(()=>{focusInput();if(delay===0)input.select()},delay);
  }
  window.StudyVillageAdminDialog={ask(message,defaultValue='',options={}){return new Promise(resolve=>{queue.push({message,defaultValue,options,resolve});next()})}};
})();
