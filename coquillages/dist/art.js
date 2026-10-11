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
  const p=clamp(progress);if(p===0)return{lower:0,upper:0,mix:0};if(p===.5)return{lower:1,upper:1,mix:0};if(p===1)return{lower:2,upper:2,mix:0};
  return p<.5?{lower:0,upper:1,mix:p*2}:{lower:1,upper:2,mix:(p-.5)*2};
}
export function drawPaintedGrowth(canvas,progress,kind='snail'){
  const {ctx,w,h}=drawingContext(canvas);if(!w||!h)return;
  const sequence=frames[kind],blend=frameBlend(progress),scale=Math.min(w/1536,h/1024),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  const points=kind==='snail'?[[585,390],[960,655],[1190,655]]:[[750,610],[930,640],[1190,650]];
  const from=points[blend.lower],to=points[blend.upper],target=[from[0]+(to[0]-from[0])*blend.mix,from[1]+(to[1]-from[1])*blend.mix];
  const paint=(idx,alpha)=>{
    const frame=sequence[idx],image=artImage(frame.src);if(!image.complete||!image.naturalWidth)return;
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(ox,oy);ctx.scale(scale,scale);
    if(kind==='snail'){
      // Interpolate the painted growing region. The original early tip stays fixed.
      const ax=410,ay=265,sx=(target[0]-ax)/(points[idx][0]-ax),sy=(target[1]-ay)/(points[idx][1]-ay);
      ctx.drawImage(image,0,0,ax,ay,0,0,ax,ay);
      ctx.drawImage(image,ax,0,1536-ax,ay,ax,0,(1536-ax)*sx,ay);
      ctx.drawImage(image,0,ay,ax,1024-ay,0,ay,ax,(1024-ay)*sy);
      ctx.drawImage(image,ax,ay,1536-ax,1024-ay,ax,ay,(1536-ax)*sx,(1024-ay)*sy);
    }else{
      const ax=315,ay=578,stretch=(target[0]-ax)/(points[idx][0]-ax);
      ctx.translate(ax,ay);ctx.scale(stretch,stretch);ctx.drawImage(image,frame.x-ax,frame.y-ay,1536,1024);
    }
    ctx.restore();
  };
  paint(blend.mix<.5?blend.lower:blend.upper,1);
  return {x:ox+target[0]*scale,y:oy+target[1]*scale};
}
export function drawShell(canvas,progress){return drawPaintedGrowth(canvas,progress,'snail');}
export function drawMussel(canvas,progress){return drawPaintedGrowth(canvas,progress,'mussel');}
export async function readyGrowth(kind){await Promise.all(frames[kind].map(async f=>{const image=artImage(f.src);await image.decode();}));}

export function drawLivingSnail(canvas,time,active){
  const {ctx,w,h}=drawingContext(canvas),image=artImage('assets/snail.png');if(!image.complete||!image.naturalWidth)return;
  const scale=Math.min(w/1640,h/1120),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  const walk=active?Math.min(Math.max(0,(w-1440*scale)/2-4),Math.sin(time*.7)*18+Math.min(time*3,24)):0;ctx.drawImage(image,ox+walk,oy,1536*scale,1024*scale);
  if(!active)return;
  // Animate only a small soft-body region of the SAME original drawing.
  // No generated replacement body and no disjoint collage parts.
  ctx.clearRect(ox+walk+760*scale,oy+660*scale,776*scale,364*scale);
  for(let y=660;y<1024;y+=6){const fade=Math.sin(Math.PI*(y-660)/364),shift=Math.sin(time*2.6+(y-660)*.009)*(canvas.matches(":hover")?38:30)*fade;ctx.drawImage(image,760,y,776,Math.min(6,1024-y),ox+walk+(760+shift)*scale,oy+y*scale,776*scale,Math.min(6,1024-y)*scale);}
}

export function drawClosedMussel(canvas){
  const {ctx,w,h}=drawingContext(canvas),image=artImage('assets/mussel-closed.png');if(!image.complete||!image.naturalWidth)return;
  const scale=Math.min(w/1536,h/1024),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  const initial=.55;ctx.drawImage(image,ox+(315-350*initial)*scale,oy+(578-590*initial)*scale,1536*initial*scale,1024*initial*scale);
}

const shellPaper=new Map();
export function drawShellLayers(canvas,progress){
  const {ctx,w,h}=drawingContext(canvas),image=artImage('assets/snail-shell.png');if(!image.complete||!image.naturalWidth)return;
  const scale=Math.min(w/1640,h/1120),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  if(!shellPaper.has(image.src)){
    const paper=document.createElement('canvas'),ink=document.createElement('canvas');paper.width=ink.width=1536;paper.height=ink.height=1024;const base=paper.getContext('2d');base.drawImage(image,0,0,1536,1024);base.globalCompositeOperation='source-in';base.fillStyle='#f3eddf';base.fillRect(0,0,1536,1024);base.globalCompositeOperation='source-over';base.globalAlpha=.16;base.drawImage(image,0,0,1536,1024);shellPaper.set(image.src,{paper,ink});
  }
  const {paper,ink}=shellPaper.get(image.src),brush=ink.getContext('2d');brush.globalCompositeOperation='source-over';brush.clearRect(0,0,1536,1024);brush.drawImage(image,0,0,1536,1024);
  const cut=clamp(progress)*2560,mask=brush.createLinearGradient(cut/2-85,cut/2-85,cut/2+85,cut/2+85);mask.addColorStop(0,'rgba(0,0,0,1)');mask.addColorStop(1,'rgba(0,0,0,0)');brush.globalCompositeOperation='destination-in';brush.fillStyle=mask;brush.fillRect(0,0,1536,1024);
  ctx.drawImage(paper,ox,oy,1536*scale,1024*scale);ctx.drawImage(ink,ox,oy,1536*scale,1024*scale);
}
