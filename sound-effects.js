/* StudyVillage V1 classroom-friendly sound effects (no external audio files). */
(()=>{
  const STORAGE_KEY='studyvillage-sound-enabled-v1';
  let context=null,enabled=localStorage.getItem(STORAGE_KEY)!=='false',lastTap=0;
  const patterns={
    tap:[[420,.035,'sine',.035]],enter:[[392,.06,'sine',.045],[523,.09,'sine',.05]],
    correct:[[523,.07,'sine',.055],[659,.08,'sine',.06],[784,.12,'sine',.055]],wrong:[[260,.09,'triangle',.045],[196,.15,'triangle',.04]],
    reward:[[587,.07,'sine',.055],[740,.07,'sine',.06],[880,.15,'sine',.055]],danger:[[180,.1,'sawtooth',.035],[135,.18,'sawtooth',.03]],
    angel:[[659,.09,'sine',.04],[880,.12,'sine',.055],[1047,.18,'sine',.05]],villain:[[196,.09,'square',.03],[155,.12,'sawtooth',.035],[116,.22,'sawtooth',.025]],mystery:[[330,.08,'sine',.025],[494,.12,'triangle',.035],[392,.18,'sine',.03]],
    complete:[[392,.07,'sine',.05],[523,.08,'sine',.055],[659,.08,'sine',.06],[784,.18,'sine',.055]],
    levelup:[[523,.07,'sine',.055],[659,.07,'sine',.06],[784,.07,'sine',.065],[1047,.24,'sine',.06]]
  };
  function audio(){const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return null;context=context||new Audio();if(context.state==='suspended')context.resume().catch(()=>{});return context}
  function play(kind='tap'){if(!enabled)return false;try{const ctx=audio(),notes=patterns[kind]||patterns.tap;if(!ctx)return false;let at=ctx.currentTime+.008;notes.forEach(([frequency,duration,type,volume])=>{const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,at);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(at);oscillator.stop(at+duration+.02);at+=Math.max(.045,duration*.7)});return true}catch{return false}}
  function updateToggle(){const button=document.querySelector('#sound-toggle');if(!button)return;button.textContent=enabled?'🔊 소리':'🔇 소리';button.title=enabled?'효과음 끄기':'효과음 켜기';button.setAttribute('aria-pressed',String(enabled))}
  function setEnabled(value){enabled=Boolean(value);localStorage.setItem(STORAGE_KEY,String(enabled));updateToggle();if(enabled)play('correct')}
  function install(){const hud=document.querySelector('.hud-right');if(hud&&!document.querySelector('#sound-toggle')){const button=document.createElement('button');button.id='sound-toggle';button.type='button';button.className='record-button';button.onclick=()=>setEnabled(!enabled);hud.insertBefore(button,hud.querySelector('#customize-button'));updateToggle()}
    document.addEventListener('pointerdown',()=>{if(enabled)audio()},{once:true,passive:true});
    document.addEventListener('click',event=>{const button=event.target.closest?.('button');if(!button||button.id==='sound-toggle'||button.disabled)return;const now=Date.now();if(now-lastTap<80)return;lastTap=now;if(button.matches('.quiz-option,.library-option,.sv2-options button,[data-submit]'))return;play(button.closest('.building-interior,.sv2-hub')?'enter':'tap')},true)
  }
  window.StudyVillageSound={play,setEnabled,isEnabled:()=>enabled,storageKey:STORAGE_KEY};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
