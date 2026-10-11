import {clamp} from './learning.js';

const cache=new Map();
export function artImage(src){
  if(!cache.has(src)){const image=new Image();image.src=src;image.onload=()=>window.dispatchEvent(new Event('artready'));cache.set(src,image);}
  return cache.get(src);
}
function drawingContext(canvas){const box=canvas.getBoundingClientRect(),w=box.width||canvas.width,h=box.height||canvas.height,dpr=box.width?Math.min(devicePixelRatio||1,2):1;const width=Math.round(w*dpr),height=Math.round(h*dpr);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return{ctx,w,h};}
const frames={
  snail:[{src:'assets/snail-young.png',x:0,y:0},{src:'assets/snail-middle.png',x:0,y:0},{src:'assets/snail.png',x:0,y:0}],
  mussel:[{src:'assets/mussel-young.png',x:-105,y:-38},{src:'assets/mussel-middle.png',x:-125,y:18},{src:'assets/mussel.png',x:0,y:0}]
};
export function frameBlend(progress){
  const p=clamp(progress);
  if(p<.30)return{lower:0,upper:0,mix:0};
  if(p<.35)return{lower:0,upper:1,mix:(p-.30)/.05};
  if(p<.65)return{lower:1,upper:1,mix:0};
  if(p<.70)return{lower:1,upper:2,mix:(p-.65)/.05};
  return{lower:2,upper:2,mix:0};
}
export function drawPaintedGrowth(canvas,progress,kind='snail'){
  const {ctx,w,h}=drawingContext(canvas);if(!w||!h)return;
  const sequence=frames[kind],blend=frameBlend(progress),scale=Math.min(w/1536,h/1024),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  const paint=(frame,alpha)=>{const image=artImage(frame.src);if(!image.complete||!image.naturalWidth)return false;ctx.globalAlpha=alpha;ctx.drawImage(image,ox+frame.x*scale,oy+frame.y*scale,1536*scale,1024*scale);return true;};
  paint(sequence[blend.lower],1-blend.mix);if(blend.upper!==blend.lower)paint(sequence[blend.upper],blend.mix);ctx.globalAlpha=1;
  // The apex is a fixed piece of the original drawing, never enlarged.
  if(kind==='snail'){
    const core=artImage('assets/snail-shell.png');if(core.complete&&core.naturalWidth)ctx.drawImage(core,0,0,410,265,ox,oy,410*scale,265*scale);
  }
  const idx=blend.mix>.5?blend.upper:blend.lower;
  const aperture=kind==='snail'?[[585,390],[960,655],[1190,655]][idx]:[[750,610],[930,640],[1190,650]][idx];
  return {x:ox+aperture[0]*scale,y:oy+aperture[1]*scale};
}
export function drawShell(canvas,progress){return drawPaintedGrowth(canvas,progress,'snail');}
export function drawMussel(canvas,progress){return drawPaintedGrowth(canvas,progress,'mussel');}
export async function readyGrowth(kind){await Promise.all(frames[kind].map(async f=>{const image=artImage(f.src);await image.decode();}));}

export function drawLivingSnail(canvas,time,active){
  const {ctx,w,h}=drawingContext(canvas),image=artImage('assets/snail.png');if(!image.complete||!image.naturalWidth)return;
  const scale=Math.min(w/1640,h/1120),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  const walk=active?Math.sin(time*.32)*9:0;ctx.drawImage(image,ox+walk,oy,1536*scale,1024*scale);
  if(!active)return;
  // Animate only a small soft-body region of the SAME original drawing.
  // No generated replacement body and no disjoint collage parts.
  ctx.clearRect(ox+walk+760*scale,oy+660*scale,776*scale,364*scale);
  for(let y=660;y<1024;y+=6){const fade=Math.sin(Math.PI*(y-660)/364),shift=Math.sin(time*2.6+(y-660)*.009)*3.5*fade;ctx.drawImage(image,760,y,776,Math.min(6,1024-y),ox+walk+(760+shift)*scale,oy+y*scale,776*scale,Math.min(6,1024-y)*scale);}
}

export function drawClosedMussel(canvas){
  const {ctx,w,h}=drawingContext(canvas),image=artImage('assets/mussel-closed.png');if(!image.complete||!image.naturalWidth)return;
  const scale=Math.min(w/1536,h/1024),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  const initial=.55;ctx.drawImage(image,ox+(315-350*initial)*scale,oy+(578-590*initial)*scale,1536*initial*scale,1024*initial*scale);
}
