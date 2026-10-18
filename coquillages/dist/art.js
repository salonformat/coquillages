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
const stageTransitions=new WeakMap();
export function drawPaintedGrowth(canvas,progress,kind='snail'){
  const {ctx,w,h}=drawingContext(canvas);if(!w||!h)return;
  const sequence=frames[kind],blend=frameBlend(progress),scale=Math.min(w/1536,h/1024),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  const points=kind==='snail'?[[585,390],[960,655],[1190,655]]:[[750,610],[930,640],[1190,650]];
  const from=points[blend.lower],to=points[blend.upper],target=[from[0]+(to[0]-from[0])*blend.mix,from[1]+(to[1]-from[1])*blend.mix];
  const selected=blend.mix<.5?blend.lower:blend.upper,image=artImage(sequence[selected].src);
  if(!image.complete||!image.naturalWidth)return;
  let state=stageTransitions.get(canvas);
  if(!state){state={selected,started:0,previous:null,raf:0};stageTransitions.set(canvas,state);}
  cancelAnimationFrame(state.raf);
  if(state.selected!==selected){
    const previous=document.createElement('canvas');previous.width=canvas.width;previous.height=canvas.height;
    // Render the preceding complete life stage at this same growth position.
    const old=artImage(sequence[state.selected].src),pc=previous.getContext('2d');pc.scale(canvas.width/w,canvas.height/h);
    paintStage(pc,old,state.selected);state.previous=previous;state.started=performance.now();state.selected=selected;
  }
  function paintStage(context,asset,idx){
    context.save();context.translate(ox,oy);context.scale(scale,scale);
    if(kind==='snail'){
      const ax=180,ay=100,sx=(target[0]-ax)/(points[idx][0]-ax),sy=(target[1]-ay)/(points[idx][1]-ay);
      context.translate(ax,ay);context.scale(sx,sy);context.drawImage(asset,-ax,-ay,1536,1024);
    }else{
      const ax=315,ay=578,stretch=(target[0]-ax)/(points[idx][0]-ax),frame=sequence[idx];
      context.translate(ax,ay);context.scale(stretch,stretch);context.drawImage(asset,frame.x-ax,frame.y-ay,1536,1024);
    }context.restore();
  }
  paintStage(ctx,image,selected);
  const elapsed=performance.now()-state.started;
  if(state.previous&&elapsed<140&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    ctx.save();ctx.globalAlpha=1-elapsed/140;ctx.drawImage(state.previous,0,0,w,h);ctx.restore();
    state.raf=requestAnimationFrame(()=>{if(canvas.isConnected)drawPaintedGrowth(canvas,progress,kind);});
  }else state.previous=null;
  return {x:ox+target[0]*scale,y:oy+target[1]*scale};
}
export function drawShell(canvas,progress){return drawPaintedGrowth(canvas,progress,'snail');}
export function drawMussel(canvas,progress){return drawPaintedGrowth(canvas,progress,'mussel');}
export async function readyGrowth(kind){await Promise.all(frames[kind].map(async f=>{const image=artImage(f.src);await image.decode();}));}

export function drawLivingSnail(canvas,time,active){
  const {ctx,w,h}=drawingContext(canvas),image=artImage('assets/snail.png');if(!image.complete||!image.naturalWidth)return;
  const scale=Math.min(w/1640,h/1120),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  // Keep the complete painted contour intact, including the shell/body junction.
  // A gentle whole-body drift avoids cutting the raster into independently moving strips.
  const drift=active?Math.sin(time*.65)*5:0,bob=active?Math.sin(time*.9)*2:0;
  ctx.save();ctx.translate(w/2+drift,h/2+bob);ctx.rotate(active?Math.sin(time*.55)*.004:0);
  ctx.drawImage(image,ox-w/2,oy-h/2,1536*scale,1024*scale);ctx.restore();
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
