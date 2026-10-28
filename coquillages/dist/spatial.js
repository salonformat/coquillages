import {cameraAt} from './camera.js?v=release-17';
import {artImage,drawShell,drawMussel} from './art.js?v=release-17';
export class SpatialJourney{
 constructor(canvas,button){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.button=button;this.scene='start';this.progress=0;this.time=0;this.inspection=0;this.targetInspection=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.buffers=new Map();this.ready=false;
  this.loaded=Promise.all(['snail-entry.webp','snail-shell.webp'].map(name=>artImage('assets/'+name).decode())).then(()=>{this.ready=true;this.draw();});
 }
 async ensure(scene){await this.loaded;if(['animal','edge','growth','bivalve'].includes(scene))await artImage('assets/snail.webp').decode();if(['animal','edge','growth','bivalve'].includes(scene))await artImage('assets/snail-shell.webp').decode();if(scene==='bivalve')await artImage('assets/mussel.webp').decode();}
 set(scene,progress,time=0){
  const sameScene=this.scene===scene;this.scene=scene;this.time=time;
  if(scene==='start'&&progress>.1)artImage('assets/snail.webp');
  if(this.reduced||!sameScene||!['start','animal','bivalve'].includes(scene)){cancelAnimationFrame(this.glideFrame);this.glideFrame=0;this.progress=progress;this.targetProgress=progress;this.draw();return;}
  this.targetProgress=progress;
  if(this.glideFrame)return;
  let last=performance.now();
  const glide=now=>{const dt=Math.min(64,now-last);last=now;const difference=this.targetProgress-this.progress;
   this.progress+=difference*(1-Math.exp(-dt/55));
   if(Math.abs(difference)<.0001){this.progress=this.targetProgress;this.glideFrame=0;this.draw();return;}
   this.draw();this.glideFrame=requestAnimationFrame(glide);
  };this.glideFrame=requestAnimationFrame(glide);
 }

 draw(){
  if(!this.ready)return;const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5);
  if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);}
  const ctx=this.ctx;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const state=cameraAt(this.scene,this.progress,w,h,{reduced:this.reduced,inspection:this.inspection});this.state=state;
  for(const kind of ['snail','mussel']){
   const view=state[kind];if(view.alpha<.001)continue;const full=kind==='snail'&&view.body>.999?(this.scene==='start'&&this.progress<=.1?null:artImage('assets/snail.webp')):null;const living=full?.complete&&full.naturalWidth?full:artImage('assets/snail-entry.webp');const source=kind==='snail'&&view.body>.999?living:artImage('assets/'+(kind==='mussel'?'mussel.webp':'snail-shell.webp'));if(!source.complete||!source.naturalWidth)continue;ctx.save();ctx.globalAlpha=view.alpha;ctx.translate(view.tx,view.ty);ctx.scale(view.s,view.s);
   if(kind==='snail'&&view.body>.999){ctx.drawImage(living,77,68,1536,1024);}
   else{
    let buffer=this.buffers.get(kind);if(!buffer){buffer={canvas:document.createElement('canvas'),amount:-1};buffer.canvas.width=1760;buffer.canvas.height=1160;this.buffers.set(kind,buffer);}
    if(buffer.amount!==view.material){(kind==='snail'?drawShell:drawMussel)(buffer.canvas,view.material);buffer.amount=view.material;}
    ctx.drawImage(buffer.canvas,0,0);
    if(kind==='snail'&&view.body>0){ctx.globalAlpha=view.alpha*view.body;ctx.drawImage(living,77,68,1536,1024);}
   }ctx.restore();
  }
  const v=state.mussel;this.button.hidden=!state.inspectionVisible;
  if(state.inspectionVisible){this.button.style.left=(v.tx+375*v.s)+'px';this.button.style.top=(v.ty+158*v.s)+'px';this.button.style.width=1000*v.s+'px';this.button.style.height=855*v.s+'px';}
  this.canvas.dataset.camera=JSON.stringify(state);
  this.canvas.dispatchEvent(new CustomEvent('camera-frame',{detail:state}));
 }
}
