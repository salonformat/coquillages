import {rimAt,accretionStrip} from './accretion.js?v=release-19';
import {clamp} from './learning.js?v=release-19';

const cache=new Map();
export function artImage(src){
  if(!cache.has(src)){const image=new Image();image.src=src;image.onload=()=>window.dispatchEvent(new Event('artready'));cache.set(src,image);}
  return cache.get(src);
}
function drawingContext(canvas){const box=canvas.getBoundingClientRect(),w=box.width||canvas.width,h=box.height||canvas.height,dpr=box.width?Math.min(devicePixelRatio||1,2):1;const width=Math.round(w*dpr),height=Math.round(h*dpr);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return{ctx,w,h};}
const growthSources={snail:'assets/snail-shell.webp',mussel:'assets/mussel.webp'};
const growthDetails=new Map();
function prepareAccretion(image,kind){
 if(growthDetails.has(kind))return growthDetails.get(kind);
 const sample=document.createElement('canvas');sample.width=1536;sample.height=1024;const context=sample.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0,1536,1024);const pixels=context.getImageData(0,0,1536,1024).data;
 const solid=(x,y)=>x>=0&&x<1536&&y>=0&&y<1024&&pixels[(Math.round(y)*1536+Math.round(x))*4+3]>180&&pixels[(Math.round(y)*1536+Math.round(x))*4]+pixels[(Math.round(y)*1536+Math.round(x))*4+1]+pixels[(Math.round(y)*1536+Math.round(x))*4+2]>480;
 let rims=[];
 if(kind==='snail'){
   const lip=[];for(let y=625;y<=749;y+=2){let x=1390;while(x>1000&&!solid(x,y))x--;if(x>1000)lip.push([x,y]);}rims=[lip];
 }else{
   // Ray-cast the actual painted contours, separately for the two open valves.
   for(const [cx,cy,upper] of [[830,300,true],[810,760,false]]){
     const radii=[];for(let i=0;i<360;i++){const angle=i*Math.PI/180,dx=Math.cos(angle),dy=Math.sin(angle);let last=0;for(let r=0;r<900;r+=1){const x=cx+dx*r,y=cy+dy*r;if(x<0||x>=1536||y<0||y>=1024||upper&&y>574||!upper&&y<581)break;if(solid(x,y))last=r;}radii.push(last);}
     // Remove pigment-grain outliers from the measured silhouette. This is a
     // fixed spatial smoothing pass, not a time-varying deformation.
     const median=radii.map((_,i)=>Array.from({length:21},(_,j)=>radii[(i+j-10+360)%360]).sort((a,b)=>a-b)[10]);
     const smooth=median.map((_,i)=>Array.from({length:15},(_,j)=>median[(i+j-7+360)%360]).reduce((a,b)=>a+b,0)/15);
     const rim=smooth.map((r,i)=>[cx+Math.cos(i*Math.PI/180)*r,cy+Math.sin(i*Math.PI/180)*r]);rim.push(rim[0]);rims.push(rim);
   }
 }
 // The original chalk/paper texture supplies the new material as well.
 const texture=document.createElement('canvas');texture.width=texture.height=96;texture.getContext('2d').drawImage(image,kind==='snail'?650:720,kind==='snail'?420:260,96,96,0,0,96,96);
 const result={rims,texture};growthDetails.set(kind,result);return result;
}
function trace(ctx,points,close=false){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(close)ctx.closePath();}
const fixedPaintings=new WeakMap();
function fixedPainting(canvas,image,w,h,scale,ox,oy){
 const key=image.src+':'+canvas.width+':'+canvas.height;let cached=fixedPaintings.get(canvas);if(cached?.key===key)return cached;
 const base=document.createElement('canvas'),mask=document.createElement('canvas');base.width=mask.width=canvas.width;base.height=mask.height=canvas.height;
 const bc=base.getContext('2d',{willReadFrequently:true});bc.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);bc.translate(ox,oy);bc.scale(scale,scale);bc.drawImage(image,0,0,1536,1024);
 const pixels=bc.getImageData(0,0,base.width,base.height);for(let i=0;i<pixels.data.length;i+=4){pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=0;pixels.data[i+3]=pixels.data[i+3]>=140?255:0;}mask.getContext('2d').putImageData(pixels,0,0);
 cached={key,base,mask};fixedPaintings.set(canvas,cached);return cached;
}
export function drawPaintedGrowth(canvas,progress,kind='snail'){
 const {ctx,w,h}=drawingContext(canvas),image=artImage(growthSources[kind]);if(!image.complete||!image.naturalWidth)return;
 // One fixed viewport transform for every scroll position. Never scale, warp,
 // replace or cross-fade previously deposited material.
 const scale=Math.min(w/1760,h/1160),ox=(w-1536*scale)/2-35*scale,oy=(h-1024*scale)/2;
 const {rims,texture}=prepareAccretion(image,kind),p=clamp(progress),fixed=fixedPainting(canvas,image,w,h,scale,ox,oy);
 ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
 if(p>0){
   ctx.fillStyle=ctx.createPattern(texture,'repeat');
   for(const rim of rims){trace(ctx,accretionStrip(rim,p,kind),true);ctx.fill();
     trace(ctx,rimAt(rim,p,kind));ctx.strokeStyle='#4478b4';ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha=Math.min(1,p*40);ctx.stroke();ctx.globalAlpha=1;
   }
 }
 // The complete original sits above its new edge, at the identical size and
 // location in every frame. This also preserves its original hand-drawn lines.
 ctx.restore();ctx.save();ctx.setTransform(1,0,0,1,0,0);
 // Exclude existing painted material from the new layer, even where the source
 // uses translucent pigment. Then composite the exact cached old painting.
 if(p>0){ctx.globalCompositeOperation='destination-out';ctx.drawImage(fixed.mask,0,0);ctx.globalCompositeOperation='source-over';}
 ctx.drawImage(fixed.base,0,0);ctx.restore();
 return {scale,ox,oy};
}
export function drawShell(canvas,progress){return drawPaintedGrowth(canvas,progress,'snail');}
export function drawMussel(canvas,progress){return drawPaintedGrowth(canvas,progress,'mussel');}
export async function readyGrowth(kind){await artImage(growthSources[kind]).decode();}

export function drawLivingSnail(canvas,time,active){
  const {ctx,w,h}=drawingContext(canvas),image=artImage('assets/snail.webp');if(!image.complete||!image.naturalWidth)return;
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
  const {ctx,w,h}=drawingContext(canvas),image=artImage('assets/snail-shell.webp');if(!image.complete||!image.naturalWidth)return;
  const scale=Math.min(w/1640,h/1120),ox=(w-1536*scale)/2,oy=(h-1024*scale)/2;
  if(!shellPaper.has(image.src)){
    const paper=document.createElement('canvas'),ink=document.createElement('canvas');paper.width=ink.width=1536;paper.height=ink.height=1024;const base=paper.getContext('2d');base.drawImage(image,0,0,1536,1024);base.globalCompositeOperation='source-in';base.fillStyle='#f3eddf';base.fillRect(0,0,1536,1024);base.globalCompositeOperation='source-over';base.globalAlpha=.16;base.drawImage(image,0,0,1536,1024);shellPaper.set(image.src,{paper,ink});
  }
  const {paper,ink}=shellPaper.get(image.src),brush=ink.getContext('2d');brush.globalCompositeOperation='source-over';brush.clearRect(0,0,1536,1024);brush.drawImage(image,0,0,1536,1024);
  const cut=clamp(progress)*2560,mask=brush.createLinearGradient(cut/2-85,cut/2-85,cut/2+85,cut/2+85);mask.addColorStop(0,'rgba(0,0,0,1)');mask.addColorStop(1,'rgba(0,0,0,0)');brush.globalCompositeOperation='destination-in';brush.fillStyle=mask;brush.fillRect(0,0,1536,1024);
  ctx.drawImage(paper,ox,oy,1536*scale,1024*scale);ctx.drawImage(ink,ox,oy,1536*scale,1024*scale);
}
