/* StudyVillage V1 classroom-friendly sound effects (no external audio files). */
(()=>{
  const STORAGE_KEY='studyvillage-sound-enabled-v1';
  let context=null,enabled=localStorage.getItem(STORAGE_KEY)!=='false',lastTap=0;
  const patterns={
    tap:[[440,.035,'sine',.025]],enter:[[392,.07,'triangle',.04],[523,.12,'sine',.05]],pop:[[150,.035,'square',.05],[420,.045,'triangle',.055],[820,.09,'sine',.045]],
    correct:[[659,.11,'sine',.055],[784,.13,'sine',.06],[1047,.27,'triangle',.065]],wrong:[[330,.18,'sawtooth',.04],[247,.22,'sawtooth',.045],[165,.36,'triangle',.04]],
    reward:[[523,.08,'triangle',.045],[659,.1,'sine',.055],[784,.12,'sine',.06],[1047,.25,'sine',.055]],danger:[[196,.15,'sawtooth',.04],[147,.2,'sawtooth',.04],[98,.32,'triangle',.035]],
    mystery:[[294,.1,'sine',.03],[440,.13,'triangle',.04],[370,.1,'sine',.03],[587,.25,'sine',.045]],magic:[[392,.08,'triangle',.04],[523,.09,'sine',.05],[659,.1,'triangle',.055],[988,.23,'sine',.05]],
    angel:[[659,.15,'sine',.035],[880,.17,'sine',.05],[1047,.2,'sine',.055],[1319,.38,'sine',.04]],wizard:[[330,.07,'triangle',.04],[494,.08,'sine',.045],[659,.09,'triangle',.05],[988,.25,'sine',.045]],
    robot:[[220,.06,'square',.025],[440,.05,'square',.025],[330,.06,'square',.025],[660,.13,'square',.025]],dragon:[[147,.12,'sawtooth',.04],[220,.13,'triangle',.045],[330,.17,'sawtooth',.04],[440,.26,'triangle',.04]],
    owl:[[392,.16,'sine',.04],[330,.16,'sine',.04],[523,.26,'triangle',.045]],fox:[[587,.07,'triangle',.04],[784,.09,'sine',.05],[698,.08,'triangle',.045],[988,.2,'sine',.045]],
    ghost:[[494,.13,'sine',.03],[370,.15,'sine',.035],[277,.24,'triangle',.04]],goblin:[[233,.09,'square',.03],[175,.11,'sawtooth',.035],[262,.08,'square',.03],[131,.25,'triangle',.035]],villain:[[196,.11,'square',.03],[155,.16,'sawtooth',.04],[116,.3,'triangle',.035]],
    complete:[[392,.08,'triangle',.045],[523,.1,'sine',.055],[659,.11,'triangle',.06],[784,.13,'sine',.06],[1047,.28,'sine',.055]],levelup:[[523,.08,'triangle',.055],[659,.09,'sine',.06],[784,.1,'triangle',.065],[1047,.12,'sine',.065],[1319,.32,'sine',.055]]
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
