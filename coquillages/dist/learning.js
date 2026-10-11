export const SCENES=['start','animal','edge','growth','bivalve','transfer','ending'];
export function validScene(id){return id==='why'?'animal':SCENES.includes(id)?id:'start';}
export function validLanguage(lang){return ['de','fr','en'].includes(lang)?lang:'de';}
export function nextScene(id){return SCENES[Math.min(SCENES.indexOf(validScene(id))+1,SCENES.length-1)];}
export function previousScene(id){return SCENES[Math.max(SCENES.indexOf(validScene(id))-1,0)];}
export function readRoute(url){const u=new URL(url);const id=u.hash.replace('#','');return {scene:id==='about'?'about':validScene(id),lang:validLanguage(u.searchParams.get('lang'))};}
export function routeUrl(url,scene,lang){const u=new URL(url);u.hash=scene==='about'?'about':validScene(scene);u.searchParams.set('lang',validLanguage(lang));return u.href;}
export function clamp(value,min=0,max=1){return Math.max(min,Math.min(max,Number(value)||0));}

export function growthAssessment(place){return {correct:place==='edge',feedback:place==='edge'?'correct-feedback':'old-feedback'};}

export const DURATIONS={animal:10,edge:9,growth:16,bivalve:19,transfer:9};
export function automaticProgress(scene,elapsed){return scene==='growth'?clamp((elapsed-1)/13):scene==='bivalve'?clamp((elapsed-4)/13):0;}
export function shouldAdvance(scene,elapsed){return !!DURATIONS[scene]&&elapsed>=DURATIONS[scene];}
