export const VERSION='mobile-ready-24';
export const LANGUAGES=['de','fr','en'];
export const SCENES=['start','animal','formation','bivalve','ending'];
export const CHAPTERS=[
 {id:'start',start:0,length:1.2},
 {id:'animal',start:1.2,length:1.8},
 {id:'formation',start:3,length:3.6},
 {id:'bivalve',start:6.6,length:1.6},
 {id:'ending',start:8.2,length:1}
];
export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,Number(v)||0));
export const ease=v=>{const p=clamp(v);return p*p*(3-2*p);};
export const lerp=(a,b,p)=>a+(b-a)*p;
export function canonicalScene(id){return ({edge:'formation',growth:'formation',why:'animal',transfer:'bivalve'})[id]||(SCENES.includes(id)||id==='about'?id:'start');}
export function readRoute(href){const url=new URL(href);const old=url.hash.slice(1);return{scene:canonicalScene(old),lang:LANGUAGES.includes(url.searchParams.get('lang'))?url.searchParams.get('lang'):'de',at:old==='growth'?.70:0};}
export function routeUrl(href,scene,lang){const url=new URL(href);url.hash=canonicalScene(scene);url.searchParams.set('lang',lang);return url.href;}
export const journeyHeight=h=>(CHAPTERS.at(-1).start+CHAPTERS.at(-1).length+1)*h;
export function positionAt(y,h){const units=Math.max(0,y)/Math.max(1,h);const chapter=CHAPTERS.findLast(c=>units>=c.start-.0001)||CHAPTERS[0];return{scene:chapter.id,progress:clamp((units-chapter.start)/chapter.length)};}
export function offsetFor(id,at,h){const c=CHAPTERS.find(c=>c.id===canonicalScene(id))||CHAPTERS[0];return(c.start+clamp(at,0,.999)*c.length)*h;}
export function formationAt(progress){const p=clamp(progress);return{matrix:ease((p-.10)/.26),crystals:ease((p-.35)/.35),material:ease((p-.68)/.20),phase:p<.25?0:p<.49?1:p<.77?2:3};}
export function viewAt(scene,progress){const p=clamp(progress);const f=formationAt(scene==='formation'?p:scene==='bivalve'?1:0);let ocean=0,section=0,mussel=0,sea=0,zoom=1,focusX=.5,focusY=.5,arrival=0;
 if(scene==='start'){ocean=1;zoom=lerp(1,1.12,ease(p));focusX=lerp(.5,.56,ease(p));focusY=lerp(.5,.55,ease(p));}
 if(scene==='animal'){const q=ease(p);zoom=lerp(1.12,3.6,q);focusX=lerp(.56,.81,q);focusY=lerp(.55,.65,q);arrival=ease((p-.70)/.30);ocean=1-arrival;section=arrival;}
 if(scene==='formation'){const out=ease((p-.92)/.08);section=1-out;mussel=out;}
 if(scene==='bivalve'){const out=ease((p-.78)/.22);mussel=1-out;sea=out;}
 if(scene==='ending'||scene==='about')sea=1;
 return{scene,progress:p,ocean,section,mussel,sea,zoom,focusX,focusY,arrival,...f};
}
