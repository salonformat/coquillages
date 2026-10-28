import {SpatialJourney} from './spatial.js?v=release-18';
import {paintPostcard} from './postcard.js?v=release-18';
import {CONTENT} from './content.js?v=release-18';
import {SCENES,readRoute,routeUrl,nextScene,previousScene,clamp} from './learning.js?v=release-18';
import {journeyHeight,positionAt,offsetFor} from './journey.js?v=release-18';
import {Ocean,SeaSound} from './world.js?v=release-18';
import {artImage} from './art.js?v=release-18';
import {PaintedWater} from './immersion.js?v=release-18';
const $=s=>document.querySelector(s),sceneElement=$('#scene'),aboutElement=$('#about'),track=$('#scroll-track');
const initial=readRoute(location.href);let lang=initial.lang,scene=initial.scene,progress=0,lastScene='start',routeDepth=0,ready=false,sound=false,ambientPaused=matchMedia('(prefers-reduced-motion: reduce)').matches,restoring=false,lastY=0,saveTimer,scrollFrame=0,viewportHeight=innerHeight,renderedScene=null,inspectionOpen=false,inspectionAmount=0,ambientTime=0;

const motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
const spatial=new SpatialJourney($('#journey-stage'),$('#inspect-mussel'));
const ocean=new Ocean($('#water')),seaSound=new SeaSound(),paintedWater=new PaintedWater($('#ocean'));
const c=()=>CONTENT[lang],escape=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
const button=(text,action,kind='primary')=>`<button class="${kind}" data-action="${action}">${escape(text)}${kind==='primary'?arrow:''}</button>`;
const announce=text=>{$('#status').textContent=text;};
const routeState=y=>({coquillages:true,journey:3,depth:routeDepth,y,lastScene});
function storePosition(y=window.scrollY){if(scene!=='about')history.replaceState(routeState(y),'',routeUrl(location.href,scene,lang));}
function applyPreferences(){const t=c(),active=!ambientPaused;document.documentElement.lang=lang;document.body.dataset.motion=active?'on':'off';ocean.setActive(active);paintedWater.setActive(active);$('#motion').setAttribute('aria-label',t.controls[active?'movement-off':'movement-on']);$('#motion').setAttribute('aria-pressed',String(!active));$('#sound').setAttribute('aria-label',t.controls[sound?'sound-off':'sound-on']);$('#sound').setAttribute('aria-pressed',String(sound));$('#fullscreen').setAttribute('aria-label',t.controls.fullscreen);$('#back span').textContent=t.controls.back;$('#home').textContent=t.controls.home;$('#advance').textContent=t.controls.next;$('#advance').hidden=scene==='start'||scene==='ending'||scene==='about';$('.languages').setAttribute('aria-label',t.controls.language);$('#progress').setAttribute('aria-label',t.controls.progress);document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));}
function updateTrack(){viewportHeight=innerHeight;track.style.height=journeyHeight(viewportHeight)+'px';}
function go(id,{at=0,replace=false}={}){
  if(motion&&!replace&&id!=='about'&&scene!=='about'&&id!==scene){window.scrollTo({top:offsetFor(id,at,viewportHeight),behavior:'smooth'});return;}
  clearTimeout(saveTimer);if(scene!=='about'){lastScene=scene;storePosition();}
  const y=id==='about'?lastY:offsetFor(id,at,viewportHeight);scene=id;progress=at;
  if(!replace)routeDepth++;
  history[replace?'replaceState':'pushState'](routeState(y),'',routeUrl(location.href,id,lang));
  restoring=true;if(id!=='about'){window.scrollTo({top:y,behavior:'instant'});lastY=y;}render(true);requestAnimationFrame(()=>{restoring=false;});
}
function back(){if(routeDepth>0)history.back();else if(scene==='about')go(lastScene,{replace:true});else if(scene!=='start')go(previousScene(scene),{at:.78,replace:true});else location.href='https://salonformat.com';}
window.addEventListener('popstate',()=>{clearTimeout(saveTimer);const route=readRoute(location.href);lang=route.lang;scene=route.scene;routeDepth=history.state?.depth||0;lastScene=history.state?.lastScene||'start';const y=history.state?.journey===3?history.state.y:offsetFor(scene,0,innerHeight);restoring=true;window.scrollTo({top:y,behavior:'instant'});lastY=y;progress=scene==='about'?0:positionAt(y,viewportHeight).progress;render(true);requestAnimationFrame(()=>{restoring=false;});});
history.scrollRestoration='manual';
function syncScroll(){scrollFrame=0;if(restoring||scene==='about')return;const y=window.scrollY,next=positionAt(y,viewportHeight);if(next.scene!==scene){history.replaceState(routeState(lastY),'',routeUrl(location.href,scene,lang));lastScene=scene;scene=next.scene;progress=next.progress;routeDepth++;history.pushState(routeState(y),'',routeUrl(location.href,scene,lang));render(false);}else{progress=next.progress;updateProgress();updateDrawing();}lastY=y;clearTimeout(saveTimer);saveTimer=setTimeout(()=>storePosition(),180);}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(syncScroll);},{passive:true});
$('#back').addEventListener('click',back);$('#home').addEventListener('click',()=>go('start'));$('#advance').addEventListener('click',()=>go(nextScene(scene)));
$('#motion').addEventListener('click',()=>{ambientPaused=!ambientPaused;applyPreferences();});
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;history.replaceState(routeState(lastY),'',routeUrl(location.href,scene,lang));render(false);}));
$('#sound').addEventListener('click',async()=>{try{await seaSound.set(!sound);sound=!sound;applyPreferences();}catch{announce(c().ui.audioUnavailable);}});
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{announce(c().ui.fullscreenUnavailable);}});
window.addEventListener('pointermove',e=>{if(!motion||ambientPaused)return;document.documentElement.style.setProperty('--px',(e.clientX/innerWidth-.5).toFixed(3));document.documentElement.style.setProperty('--py',(e.clientY/innerHeight-.5).toFixed(3));},{passive:true});
async function prepare(id){try{await spatial.ensure(id);if(id==='ending')await Promise.all(['ocean-minimal.jpg','snail-shell.webp','fish.webp'].map(name=>artImage('assets/'+name).decode()));if(scene===id){ready=true;sceneElement.dataset.ready='true';updateDrawing();}}catch{if(scene===id){sceneElement.dataset.ready='error';announce(c().journey.loadError);}}}

function render(focus=false){if(renderedScene!==scene){$('#experience').scrollTop=0;renderedScene=scene;}ready=false;sceneElement.dataset.ready='loading';const t=c(),s=t[scene],index=SCENES.indexOf(scene);document.body.dataset.scene=scene;paintedWater.setScene(scene);ocean.setScene(scene);applyPreferences();document.title=(s?.title||t.controls['source-title'])+' — SALONFORMAT';$('#progress').innerHTML=SCENES.map((id,i)=>`<a href="${routeUrl(location.href,id,lang)}" data-scene="${id}" ${id===scene?'aria-current="step"':''} class="${i<index?'done':''}" aria-label="${escape(t.ui.progressNames[i])}"></a>`).join('');if(scene==='about'){spatial.set('about',0);sceneElement.hidden=true;aboutElement.hidden=false;$('#journey-hint').hidden=true;renderAbout();return;}sceneElement.hidden=false;aboutElement.hidden=true;let copy='',stage='';const title=`<h1 id="scene-title" tabindex="-1">${escape(s.title)}</h1>`;
if(scene==='start'){copy=`${title}<p class="intro-learning">${escape(s.body)}</p><p class="intro-reward">${escape(s.reward)}</p><p class="journey-hint">${escape(t.journey.startHint)}</p><div class="actions">${button(s.action,'begin')}</div>`;}
if(scene==='animal'||scene==='edge'){copy=`${title}<p id="scene-body"></p>`;}
if(scene==='growth'){copy=`<h1 id="scene-title" class="sr-only" tabindex="-1">${escape(s.title)}</h1><p id="scene-body"></p><p class="model-note">${escape(s['model-note'])}</p>`;}
if(scene==='bivalve'){copy=`${title}<p id="scene-body"></p><p class="model-note">${escape(t.growth['model-note'])}</p>`;}
if(scene==='ending'){copy=`${title}<p>${escape(s.body)}</p><div class="actions"><a class="primary" href="assets/postcard-${lang}.gif" download="salonformat-meer-${lang}.gif">${escape(s.download)}${arrow}</a>${button(s.replay,'restart','secondary')}${button(s.sources,'about','text-button')}</div><p class="postcard-format">${escape(t.postcard.format)}</p>`;stage=`<canvas id="postcard" role="img" aria-label="${escape(t.postcard.label)}"></canvas>`;}

sceneElement.className='scene-'+scene;sceneElement.innerHTML=`<div class="scene-copy">${copy}</div><div class="stage" ${''}>${stage}<span class="art-loading">${escape(t.controls.loading)}</span></div>`;updateProgress();prepare(scene);if(focus){$('#scene-title').focus({preventScroll:true});$('#experience').scrollTop=0;}}
function setCopy(element,value){
 if(!element||element.textContent===value)return;
 const hadText=Boolean(element.textContent);element.textContent=value;
 if(hadText&&motion&&!ambientPaused){element.getAnimations().forEach(animation=>animation.cancel());element.animate([{opacity:.22,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'});}
}
function updateProgress(){
 const t=c(),text=$('#scene-body');sceneElement.dataset.progress=progress.toFixed(4);let body='';
 if(scene==='animal')body=progress<.32?t.animal.body:t.why.body;
 if(scene==='edge')body=t.mechanism[Math.min(3,Math.floor(progress*4))].body;
 if(scene==='growth')body=progress<.72?t.growth.instruction:t.growth.after;
 if(scene==='bivalve')body=progress<.60?t.bivalve.body:t.bivalve.after;
 setCopy(text,body);
 const heading=$('#scene-title');if(scene==='edge')setCopy(heading,t.mechanism[Math.min(3,Math.floor(progress*4))].title);if(scene==='animal')setCopy(heading,progress<.32?t.animal.title:t.why.title);
 const hint=$('#journey-hint');hint.hidden=scene==='start'||scene==='ending'||scene==='about';hint.textContent=t.journey[scene+'Hint']||'';
 $('#scene-time').style.setProperty('--progress',String((SCENES.indexOf(scene)+progress)/SCENES.length));
 const fade=scene==='start'?1-Math.min(1,Math.max(0,(progress-.1)/.6)):scene==='animal'?1-Math.min(1,Math.max(0,(progress-.62)/.18)):scene==='bivalve'?(1-Math.min(1,Math.max(0,(progress-.8)/.2))):1;
 document.documentElement.style.setProperty('--copy-opacity',String(motion?fade:1));
 $('#inspect-mussel').setAttribute('aria-expanded',String(inspectionOpen));$('#inspect-mussel').setAttribute('aria-label',t.journey[inspectionOpen?'inspectFar':'inspectNear']);$('#inspect-mussel span').textContent=t.camera[inspectionOpen?'far':'near'];
 $('#journey-stage').setAttribute('aria-label',t[scene]?.title||t.controls['source-title']);
}
function updateDrawing(){
 if(!ready)return;spatial.inspection=inspectionAmount;spatial.set(scene,progress,ambientTime);
 const card=$('#postcard');if(card){const box=card.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),width=Math.round(box.width*dpr),height=Math.round(box.height*dpr);if(card.width!==width||card.height!==height){card.width=width;card.height=height;}paintPostcard(card.getContext('2d'),{water:artImage('assets/ocean-minimal.jpg'),shell:artImage('assets/snail-shell.webp'),fish:artImage('assets/fish.webp')},ambientTime,c().postcard);}
}
$('#journey-stage').addEventListener('camera-frame',event=>{
 const state=event.detail;const x=-state.pan*innerWidth*.07,y=state.depth*30-state.lift*90;
 document.documentElement.style.setProperty('--world-x',x+'px');document.documentElement.style.setProperty('--world-y',y+'px');document.documentElement.style.setProperty('--world-zoom',String(1.14+state.depth*.07));
 document.documentElement.style.setProperty('--foreground-y',(state.depth*80-state.lift*160)+'px');document.documentElement.style.setProperty('--observation-focus',String(state.focus));document.documentElement.style.setProperty('--foreground-opacity',String(.5*(1-state.focus)*(1-state.lift)));
 if(paintedWater.setFocus)paintedWater.setFocus(state.focus);ocean.focus=state.focus;
 if(scene==='bivalve')paintedWater.setScene(progress>.82?'ending':'bivalve');
});
$('#inspect-mussel').addEventListener('click',()=>{inspectionOpen=!inspectionOpen;if(!motion)inspectionAmount=inspectionOpen?1:0;updateProgress();updateDrawing();});
let last=performance.now(),lastDraw=0;function tick(now){const dt=Math.max(0,Math.min((now-last)/1000,.1));last=now;if(!document.hidden){if(motion&&!ambientPaused)ambientTime+=dt;const target=inspectionOpen&&scene==='bivalve'?1:0,difference=target-inspectionAmount;if(Math.abs(difference)>.001)inspectionAmount+=difference*Math.min(1,dt*9);else inspectionAmount=target;if(ready&&now-lastDraw>30&&((scene==='ending'&&motion&&!ambientPaused)||Math.abs(difference)>.001)){updateDrawing();lastDraw=now;}}requestAnimationFrame(tick);}requestAnimationFrame(tick);
window.addEventListener('resize',()=>{const state=positionAt(window.scrollY,viewportHeight);restoring=true;updateTrack();if(scene!=='about'){const changed=scene!==state.scene;scene=state.scene;progress=state.progress;const y=offsetFor(scene,progress,viewportHeight);window.scrollTo({top:y,behavior:'instant'});lastY=y;if(changed)render(false);else updateProgress();storePosition(y);}updateDrawing();requestAnimationFrame(()=>{restoring=false;});});window.addEventListener('artready',updateDrawing);
document.addEventListener('click',event=>{const anchor=event.target.closest('a[data-scene]');if(anchor){event.preventDefault();go(anchor.dataset.scene);return;}const action=event.target.closest('[data-action]')?.dataset.action;if(action==='begin')go('animal');if(action==='restart'){inspectionOpen=false;inspectionAmount=0;go('start');}if(action==='about')go('about');if(action==='close-about')back();});
function renderAbout(){const t=c();aboutElement.innerHTML=`<h1 id="about-title" tabindex="-1">${escape(t.controls['source-title'])}</h1><p>${escape(t.controls['model-description'])}</p><h2>${escape(t.ui.research)}</h2><div class="source-links"><a href="https://www.whoi.edu/ocean-learning-hub/ocean-facts/how-are-seashells-made/" target="_blank" rel="noopener noreferrer">Woods Hole Oceanographic Institution · How are seashells made?</a><a href="https://oumnh.web.ox.ac.uk/node/4303936" target="_blank" rel="noopener noreferrer">Oxford University Museum of Natural History · Shell variation in molluscs</a><a href="https://doi.org/10.1111/brv.12640" target="_blank" rel="noopener noreferrer">Clark et al. (2020) · Deciphering mollusc shell production</a></div><p class="sources-footer">${escape(t.ui.credits)}</p><div class="actions">${button(t.controls.back,'close-about')}</div>`;}

updateTrack();
const initialY=history.state?.journey===3&&Number.isFinite(history.state.y)?history.state.y:offsetFor(scene,0,innerHeight);
progress=scene==='about'?0:positionAt(initialY,viewportHeight).progress;lastY=initialY;history.replaceState(routeState(initialY),'',routeUrl(location.href,scene,lang));restoring=true;render(false);window.scrollTo({top:initialY,behavior:'instant'});requestAnimationFrame(()=>{restoring=false;});document.fonts.ready.then(updateDrawing);
