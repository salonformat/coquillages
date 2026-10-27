import {cameraAt} from './camera.js';
import {artImage,drawShell,drawMussel} from './art.js';
export class SpatialJourney{
 constructor(canvas,button){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.button=button;this.scene='start';this.progress=0;this.time=0;this.inspection=0;this.targetInspection=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.buffers=new Map();this.ready=false;
  this.loaded=Promise.all(['snail.png','snail-shell.png','mussel.png'].map(name=>artImage('assets/'+name).decode())).then(()=>{this.ready=true;this.draw();});
 }
 set(scene,progress,time=0){this.scene=scene;this.progress=progress;this.time=time;this.draw();}
 draw(){
  if(!this.ready)return;const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5);
  if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);}
  const ctx=this.ctx;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const state=cameraAt(this.scene,this.progress,w,h,{reduced:this.reduced,inspection:this.inspection});this.state=state;
  for(const kind of ['snail','mussel']){
   const view=state[kind];if(view.alpha<.001)continue;ctx.save();ctx.globalAlpha=view.alpha;ctx.translate(view.tx,view.ty);ctx.scale(view.s,view.s);
   if(kind==='snail'&&view.body>.999){ctx.drawImage(artImage('assets/snail.png'),77,68,1536,1024);}
   else{
    let buffer=this.buffers.get(kind);if(!buffer){buffer={canvas:document.createElement('canvas'),amount:-1};buffer.canvas.width=1760;buffer.canvas.height=1160;this.buffers.set(kind,buffer);}
    if(buffer.amount!==view.material){(kind==='snail'?drawShell:drawMussel)(buffer.canvas,view.material);buffer.amount=view.material;}
    ctx.drawImage(buffer.canvas,0,0);
    if(kind==='snail'&&view.body>0){ctx.globalAlpha=view.alpha*view.body;ctx.drawImage(artImage('assets/snail.png'),77,68,1536,1024);}
   }ctx.restore();
  }
  const v=state.mussel;this.button.hidden=!state.inspectionVisible;
  if(state.inspectionVisible){this.button.style.left=(v.tx+375*v.s)+'px';this.button.style.top=(v.ty+158*v.s)+'px';this.button.style.width=1000*v.s+'px';this.button.style.height=855*v.s+'px';}
  this.canvas.dataset.camera=JSON.stringify(state);
  this.canvas.dispatchEvent(new CustomEvent('camera-frame',{detail:state}));
 }
}
