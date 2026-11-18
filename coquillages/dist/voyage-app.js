import {COPY} from './voyage-copy.js?v=living-22';
import {VoyageRenderer} from './voyage-renderer.js?v=living-22';
import {SCENES,readRoute,routeUrl,positionAt,offsetFor,journeyHeight,formationAt,clamp,ease} from './voyage.js?v=living-22';
import {SeaSound} from './world.js?v=living-22';
const $=s=>document.querySelector(s),root=document.documentElement,host=$('#scene'),track=$('#scroll-track'),dialog=$('#sources');
const original=readRoute(location.href),reduced=matchMedia('(prefers-reduced-motion:reduce)');
let lang=original.lang,scene=original.scene,progress=original.at,depth=0,lastY=0,restoring=true,rendered='',phase=-1,ready=false,loadSerial=0,saveTimer,scrollFrame=0,paused=reduced.matches,sound=false,viewportHeight=innerHeight,previousScene='start';
const text=()=>COPY[lang],esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
const soundscape=new SeaSound();
const renderer=new VoyageRenderer($('#painted-world'),updateLabels);
const state=y=>({voyage:20,y,depth,previousScene});
const store=(y=scrollY)=>history.replaceState(state(y),'',routeUrl(location.href,scene,lang));
function copyInto(el,value){if(!el||el.textContent===value)return;const had=el.textContent;el.textContent=value;if(had&&!paused&&!reduced.matches){el.getAnimations().forEach(a=>a.cancel());el.animate([{opacity:.35},{opacity:1}],{duration:280,easing:'ease-out'});}}
function preferences(){const t=text();root.lang=lang;document.body.dataset.paused=String(paused);document.body.dataset.sound=sound?'on':'off';renderer.setActive(!paused);renderer.reduced=reduced.matches;
 $('#motion').setAttribute('aria-label',t.controls[paused?'resume':'pause']);$('#motion').setAttribute('aria-pressed',String(paused));$('#sound').setAttribute('aria-label',t.controls[sound?'soundOff':'soundOn']);$('#sound').setAttribute('aria-pressed',String(sound));$('#fullscreen').setAttribute('aria-label',t.controls.fullscreen);$('.languages').setAttribute('aria-label',t.controls.language);$('#progress').setAttribute('aria-label',t.controls.progress);$('#back span').textContent=t.controls.back;$('#advance span').textContent=t.controls.next;$('#close-sources').setAttribute('aria-label',t.controls.close);$('#retry').textContent=t.controls.retry;document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));}
function render(){const t=text(),actual=scene==='about'?previousScene:scene;document.body.dataset.scene=actual;preferences();
 if(scene==='about'){renderSources();if(!dialog.open)dialog.showModal();return;}
 if(dialog.open)dialog.close();
 if(rendered!==scene||host.dataset.lang!==lang){host.className='scene-'+scene;host.dataset.lang=lang;phase=-1;rendered=scene;const item=scene==='formation'?t.formation[0]:t[scene];
 if(scene==='ending'){host.innerHTML=`<div class="scene-copy"><h1 id="scene-title" tabindex="-1">${esc(item.title)}</h1><a class="ending-signature" href="https://salonformat.com">SALONFORMAT</a><div class="end-actions"><button class="text-button" data-action="restart">${esc(item.replay)}</button><button class="text-button" data-action="sources">${esc(item.sources)}</button></div></div>`;}
 else{host.innerHTML=`<div class="scene-copy"><h1 id="scene-title" tabindex="-1">${scene==='start'?'<span class="project-name">Coquillages</span>':''}${esc(item.title)}</h1><p id="scene-body">${esc(item.body)}</p>${scene==='start'?`<button class="primary" data-action="begin">${esc(t.start.action)}${arrow}</button><p class="intro-hint">${esc(t.start.hint)}</p>`:''}</div>`;}
 $('#progress').innerHTML=SCENES.map((id,i)=>`<a href="${routeUrl(location.href,id,lang)}" data-scene="${id}" aria-label="${esc(t.progressNames[i])}" ${id===scene?'aria-current="step"':''}></a>`).join('');
 $('#advance').hidden=scene==='start'||scene==='ending';prepare(scene);}
 update();}
async function prepare(id){const serial=++loadSerial;ready=false;host.dataset.ready='loading';let timeout=setTimeout(()=>{if(serial===loadSerial){$('#load-notice span').textContent=text().controls.loading;$('#load-notice').hidden=false;}},1200);
 try{await renderer.ensure(id);if(serial!==loadSerial)return;ready=true;host.dataset.ready='true';$('#load-notice').hidden=true;$('#retry').hidden=true;renderer.set(scene,progress);}
 catch{if(serial!==loadSerial)return;host.dataset.ready='error';$('#load-notice span').textContent=text().controls.loadError;$('#load-notice').hidden=false;$('#retry').hidden=false;}
 finally{clearTimeout(timeout);}}
function update(){const t=text();host.dataset.progress=progress.toFixed(4);const item=scene==='formation'?t.formation[formationAt(progress).phase]:t[scene];document.title='Coquillages — '+(item?.title||t.sources.title)+' — SALONFORMAT';
 if(scene==='formation'){const n=formationAt(progress).phase;if(n!==phase){copyInto($('#scene-title'),item.title);copyInto($('#scene-body'),item.body);phase=n;}}
 let opacity=1;if(scene==='start')opacity=1-ease((progress-.12)/.65);if(scene==='animal')opacity=1-ease((progress-.30)/.35);if(scene==='formation')opacity=1-ease((progress-.91)/.09);if(scene==='bivalve')opacity=1-ease((progress-.73)/.15);
 root.style.setProperty('--copy-opacity',String(opacity));$('#model-note').hidden=scene!=='formation';$('#model-note').textContent=t.labels.model;
 $('#painted-world').setAttribute('aria-label',item?.title||t.sources.title);renderer.set(scene,progress);}
function updateLabels(frame,poses){const labels=$('#anatomy-labels'),t=text();let points=[];
 const point=(key,x,y,dark=false)=>({key,x,y,dark});
 if(frame.scene==='formation'&&frame.section>.5&&poses.section){const p=poses.section,mobile=innerWidth<700,xy=(x,y)=>[p.x+x*p.s,p.y+y*p.s];
 let [x,y]=xy(mobile?1075:384,mobile?450:286);points.push(point('shell',x,y));
 [x,y]=xy(1260,810);points.push(point('mantle',x,y));
 if(frame.matrix>.08){[x,y]=xy(420,600);points.push(point('matrix',x,y,true));}
 if(frame.crystals>.08){[x,y]=xy(1120,625);points.push(point(frame.material>.3?'new':'crystals',x,y,true));}
 }
 if(frame.scene==='bivalve'&&frame.progress>.22&&frame.progress<.75&&poses.mussel){const p=poses.mussel;points.push(point('edge',p.x+845*p.s,p.y+370*p.s,true));}
 const key=points.map(p=>p.key).join('|')+'|'+lang;if(labels.dataset.key!==key){labels.dataset.key=key;labels.innerHTML=points.map(p=>`<span class="anatomy-label ${p.dark?'dark':''}" data-label="${p.key}">${esc(t.labels[p.key])}</span>`).join('');}
 for(const p of points){const el=labels.querySelector(`[data-label="${p.key}"]`);el.style.left=clamp(p.x,innerWidth<700?72:100,innerWidth-(innerWidth<700?72:100))+'px';el.style.top=clamp(p.y,80,innerHeight-110)+'px';const box=el.getBoundingClientRect(),copy=$('.scene-copy').getBoundingClientRect();if(box.left<copy.right+8&&box.right>copy.left-8&&box.top<copy.bottom+8&&box.bottom>copy.top-8)el.style.top=clamp(copy.bottom+box.height/2+14,80,innerHeight-110)+'px';}
 root.style.setProperty('--labels-opacity',String(frame.scene==='formation'?frame.section:frame.scene==='bivalve'?1:0));}
function go(id,at=0){if(id==='about'){previousScene=scene;store();scene='about';depth++;history.pushState(state(lastY),'',routeUrl(location.href,'about',lang));render();return;}
 const top=offsetFor(id,at,viewportHeight);window.scrollTo({top,behavior:reduced.matches||paused?'instant':'smooth'});}
function advance(){if(scene==='formation'){const next=[.28,.53,.81].find(p=>p>progress+.02);if(next!==undefined){go('formation',next);return;}}go(SCENES[Math.min(SCENES.indexOf(scene)+1,SCENES.length-1)]);}
function back(){if(depth>0){history.back();return;}if(scene==='about'){scene=previousScene;render();store();return;}if(scene!=='start'){go(SCENES[Math.max(0,SCENES.indexOf(scene)-1)]);return;}location.href='https://salonformat.com';}
function syncScroll(){scrollFrame=0;if(restoring||scene==='about')return;const y=scrollY,next=positionAt(y,viewportHeight);if(next.scene!==scene){history.replaceState(state(lastY),'',routeUrl(location.href,scene,lang));previousScene=scene;scene=next.scene;progress=next.progress;depth++;history.pushState(state(y),'',routeUrl(location.href,scene,lang));render();}else{progress=next.progress;update();}lastY=y;clearTimeout(saveTimer);saveTimer=setTimeout(()=>store(),180);}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(syncScroll);},{passive:true});
window.addEventListener('popstate',()=>{const route=readRoute(location.href);lang=route.lang;scene=route.scene;depth=history.state?.depth||0;previousScene=history.state?.previousScene||'start';const y=history.state?.voyage===20?history.state.y:offsetFor(scene,route.at,viewportHeight);restoring=true;scrollTo({top:y,behavior:'instant'});lastY=y;progress=positionAt(y,viewportHeight).progress;render();requestAnimationFrame(()=>restoring=false);});
window.addEventListener('resize',()=>{const value=scene==='about'?{scene:previousScene,progress:positionAt(lastY,viewportHeight).progress}:{scene,progress};restoring=true;viewportHeight=innerHeight;track.style.height=journeyHeight(viewportHeight)+'px';const y=offsetFor(value.scene,value.progress,viewportHeight);scrollTo({top:y,behavior:'instant'});lastY=y;renderer.invalidate();if(scene!=='about'){store(y);update();}requestAnimationFrame(()=>restoring=false);});
reduced.addEventListener('change',()=>{paused=reduced.matches;preferences();update();});
$('#motion').addEventListener('click',()=>{paused=!paused;preferences();update();});
$('#sound').addEventListener('click',async()=>{try{await soundscape.set(!sound);sound=!sound;preferences();}catch{$('#status').textContent=text().controls.soundOn;}});
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}});
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{lang=button.dataset.lang;store(lastY);render();}));
$('#back').addEventListener('click',back);$('#advance').addEventListener('click',advance);$('#retry').addEventListener('click',()=>prepare(scene));
$('#close-sources').addEventListener('click',back);dialog.addEventListener('cancel',event=>{event.preventDefault();back();});
document.addEventListener('click',event=>{const anchor=event.target.closest('[data-scene]');if(anchor?.matches('a')){event.preventDefault();go(anchor.dataset.scene);return;}const action=event.target.closest('[data-action]')?.dataset.action;if(action==='begin')go('animal');if(action==='restart')go('start');if(action==='sources')go('about');});
function renderSources(){const s=text().sources;$('#sources-copy').innerHTML=`<h1 id="source-title">${esc(s.title)}</h1><p>${esc(s.body)}</p><h2>${esc(s.research)}</h2><div class="source-links"><a href="https://www.whoi.edu/ocean-learning-hub/ocean-facts/how-are-seashells-made/" target="_blank" rel="noopener noreferrer">Woods Hole Oceanographic Institution · How are seashells made?</a><a href="https://doi.org/10.1093/bioinformatics/btz754" target="_blank" rel="noopener noreferrer">Sleight et al. (2020) · Shell matrix production and ion transportation</a><a href="https://doi.org/10.1111/brv.12640" target="_blank" rel="noopener noreferrer">Clark et al. (2020) · Deciphering mollusc shell production</a></div><p class="credit">${esc(s.credit)}</p>`;}
history.scrollRestoration='manual';track.style.height=journeyHeight(viewportHeight)+'px';const firstY=history.state?.voyage===20?history.state.y:offsetFor(scene,original.at,viewportHeight);lastY=firstY;progress=positionAt(firstY,viewportHeight).progress;
if(scene==='about'){previousScene=positionAt(firstY,viewportHeight).scene;renderer.set(previousScene,progress);renderer.ensure(previousScene).catch(()=>{});}
history.replaceState(state(firstY),'',routeUrl(location.href,scene,lang));render();scrollTo({top:firstY,behavior:'instant'});requestAnimationFrame(()=>restoring=false);document.fonts.ready.then(()=>renderer.invalidate());
