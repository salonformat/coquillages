import {clamp,ease,lerp,viewAt} from './voyage.js?v=mobile-sea-23';
const W=1536,H=1024;
const images=new Map();
export function imageAsset(name){
 if(images.has(name))return images.get(name);
 const image=new Image();image.decoding='async';const ready=new Promise((resolve,reject)=>{image.onload=()=>image.decode().then(()=>resolve(image),()=>resolve(image));image.onerror=()=>{images.delete(name);reject(new Error(name));};});image.src='assets/'+name;
 const item={image,ready};images.set(name,item);return item;
}
const available=name=>{const item=images.get(name);return item?.image.complete&&item.image.naturalWidth?item.image:null;};
const random=n=>{const v=Math.sin(n*127.1+17.7)*43758.545;return v-Math.floor(v);};
const sourceEdges=[[0,450],[250,485],[500,515],[750,552],[1000,576],[1250,581],[1536,580]];
const floorEdges=[[0,663],[180,667],[350,694],[520,685],[700,722],[950,694],[1200,704],[1536,666]];
const lineAt=(points,x)=>{let i=1;while(i<points.length-1&&x>points[i][0])i++;const a=points[i-1],b=points[i];return lerp(a[1],b[1],clamp((x-a[0])/(b[0]-a[0])));};
function gapPath(ctx){ctx.beginPath();sourceEdges.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));[...floorEdges].reverse().forEach(([x,y])=>ctx.lineTo(x,y));ctx.closePath();}
export class VoyageRenderer{
 constructor(canvas,onFrame){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.onFrame=onFrame;this.scene='start';this.progress=0;this.target=0;this.time=0;this.active=!matchMedia('(prefers-reduced-motion:reduce)').matches;this.reduced=!this.active;this.last=0;this.lastPaint=0;this.dirty=true;this.mobilePlate=new Map();this.w=innerWidth;this.h=innerHeight;this.raf=requestAnimationFrame(t=>this.frame(t));imageAsset('fish.webp').ready.then(()=>this.invalidate()).catch(()=>{});}
 async ensure(scene){
 const ocean=innerWidth<700?'atlantic-v2-small.webp':'atlantic-v2.webp';
 const list=scene==='start'?[ocean]:scene==='animal'?['atlantic-v2.webp','mantle-section-v2.webp']:scene==='formation'?['mantle-section-v2.webp','protein-framework-v2.webp','crystal-cluster-v2.webp']:scene==='bivalve'?['mussel-v2.webp']:['open-water-v2.webp'];
 await Promise.all(list.map(name=>imageAsset(name).ready));this.dirty=true;this.draw();
 if(scene==='animal')this.prefetch('formation');if(scene==='formation')this.prefetch('bivalve');if(scene==='bivalve')this.prefetch('ending');
 }
 prefetch(scene){const names={formation:['mantle-section-v2.webp','protein-framework-v2.webp','crystal-cluster-v2.webp'],bivalve:['mussel-v2.webp'],ending:['open-water-v2.webp']};for(const name of names[scene]||[])imageAsset(name).ready.then(()=>this.invalidate()).catch(()=>{});}
 invalidate(){this.dirty=true;}
 set(scene,progress){if(this.scene!==scene){this.scene=scene;this.progress=progress;}this.target=progress;if(this.reduced||!this.active||scene==='formation')this.progress=progress;this.dirty=true;this.draw();}
 setActive(active){this.active=active;this.dirty=true;}
 frame(now){const dt=Math.min(60,now-(this.last||now));this.last=now;const moving=Math.abs(this.target-this.progress)>.00005;if(moving){this.progress=lerp(this.progress,this.target,1-Math.exp(-dt/60));this.dirty=true;}if(this.active&&!document.hidden)this.time+=dt/1000;
 const ambient=this.scene!=='formation'&&this.active&&!document.hidden;
 if((this.dirty||ambient)&&now-this.lastPaint>=32){this.draw();this.lastPaint=now;}this.raf=requestAnimationFrame(t=>this.frame(t));}
 size(){this.w=innerWidth;this.h=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);if(this.canvas.width!==Math.round(this.w*d)||this.canvas.height!==Math.round(this.h*d)){this.canvas.width=Math.round(this.w*d);this.canvas.height=Math.round(this.h*d);}this.ctx.setTransform(d,0,0,d,0,0);}
 cover(image,zoom=1,fx=.5,fy=.5){const s=Math.max(this.w/W,this.h/H)*zoom;const x=clamp(this.w*.5-fx*W*s,this.w-W*s,0),y=clamp(this.h*.5-fy*H*s,this.h-H*s,0);this.ctx.drawImage(image,x,y,W*s,H*s);return{s,x,y};}
 mobileImage(image,key){if(this.mobilePlate.has(key))return this.mobilePlate.get(key);const c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d');ctx.drawImage(image,0,0,W,H);ctx.globalCompositeOperation='destination-in';const g=ctx.createLinearGradient(0,0,0,220);g.addColorStop(0,'transparent');g.addColorStop(.85,'#000');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);this.mobilePlate.set(key,c);return c;}
 mobilePose(focus=.69,zoom=1){const s=this.w*1.65/W*zoom;return{s,x:this.w*.5-focus*W*s,y:this.h+20-H*s};}
 mobileWorld(image,kind){
 const key=kind+'|'+image.src+'|'+this.w+'x'+this.h;if(this.portraitWorld?.key===key)return this.portraitWorld;
 const canvas=document.createElement('canvas');canvas.width=this.w*2;canvas.height=this.h*2;const c=canvas.getContext('2d'),ratio=image.naturalWidth/W;
 const crop=kind==='mussel'?[750,100,460,260]:[180,5,400,250];c.drawImage(image,...crop.map(n=>n*ratio),0,0,canvas.width,canvas.height);
 const base=this.mobilePose(kind==='mussel'?.33:.69,kind==='mussel'?1.08:1);if(kind==='mussel')base.y-=20;
 c.drawImage(this.mobileImage(image,kind+'|'+image.src),base.x*2,base.y*2,W*base.s*2,H*base.s*2);
 return this.portraitWorld={key,canvas,base};
 }
 paintMobileWorld(image,kind,zoom,amount=0){
 const world=this.mobileWorld(image,kind),base=world.base;
 const opening={x:base.x+W*.81*base.s,y:base.y+H*.65*base.s};
 const fx=lerp(this.w*.5,opening.x,amount),fy=lerp(this.h*.5,opening.y,amount);
 const x=clamp(this.w*.5-fx*zoom,this.w-this.w*zoom,0),y=clamp(this.h*.5-fy*zoom,this.h-this.h*zoom,0);
 this.ctx.drawImage(world.canvas,x,y,this.w*zoom,this.h*zoom);
 return{s:base.s*zoom,x:x+base.x*zoom,y:y+base.y*zoom};
 }
 paintOcean(v){const image=available('atlantic-v2.webp')||available('atlantic-v2-small.webp');if(!image)return;
 if(this.w>=700){this.oceanPose=this.cover(image,v.zoom,v.focusX,v.focusY);}
 else{const q=this.scene==='animal'?ease(v.progress):0,zoom=this.scene==='animal'?lerp(1.12,3.5,q):v.zoom;this.oceanPose=this.paintMobileWorld(image,'ocean',zoom,q);}
 if(!this.reduced&&this.oceanPose&&v.section<.85)this.animateSnail(image,this.oceanPose);
 this.atmosphere(this.scene==='animal'?1-ease(v.progress/.18):1-v.section);
 }
 animateSnail(image,pose){
 // A continuous deformation field gently moves the head and feelers.
 // It falls to zero at every patch edge, keeping the painted place connected.
 const ctx=this.ctx,left=1100,top=590,width=410,height=230,cols=10,rows=6;
 const point=(x,y)=>{const u=(x-left)/width,v=(y-top)/height,edge=Math.sin(Math.PI*u)*Math.sin(Math.PI*v),head=Math.exp(-Math.pow((x-1380)/145,2)-Math.pow((y-705)/100,2));return[x+Math.sin(this.time*.72)*4.2*edge*head,y+Math.sin(this.time*.88+.4)*5.2*edge*head];};
 const triangle=(src,dst)=>{const [a,b,c]=src,[d,e,f]=dst,den=a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]);const coef=k=>[(d[k]*(b[1]-c[1])+e[k]*(c[1]-a[1])+f[k]*(a[1]-b[1]))/den,(d[k]*(c[0]-b[0])+e[k]*(a[0]-c[0])+f[k]*(b[0]-a[0]))/den,(d[k]*(b[0]*c[1]-c[0]*b[1])+e[k]*(c[0]*a[1]-a[0]*c[1])+f[k]*(a[0]*b[1]-b[0]*a[1]))/den];const x=coef(0),y=coef(1);ctx.save();ctx.beginPath();ctx.moveTo(...d);ctx.lineTo(...e);ctx.lineTo(...f);ctx.closePath();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(image,0,0,image.naturalWidth,image.naturalHeight,0,0,W,H);ctx.restore();};
 ctx.save();ctx.translate(pose.x,pose.y);ctx.scale(pose.s,pose.s);
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=[left+x*width/cols,top+y*height/rows],b=[a[0]+width/cols,a[1]],c=[b[0],a[1]+height/rows],d=[a[0],c[1]];triangle([a,b,c],[point(...a),point(...b),point(...c)]);triangle([a,c,d],[point(...a),point(...c),point(...d)]);}
 ctx.restore();
 }
 sectionPose(){const s=Math.max(this.w/W,this.h/H);return{s,x:(this.w-W*s)/2,y:(this.h-H*s)/2};}
 paintSection(v){const image=available('mantle-section-v2.webp');if(!image){this.paintOcean({...v,zoom:3.6,focusX:.81,focusY:.65});return;}
 const ctx=this.ctx,p=this.sectionPose();ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.s,p.s);ctx.drawImage(image,0,0,W,H);
 const matrix=available('protein-framework-v2.webp'),crystal=available('crystal-cluster-v2.webp');const rim=this.shellRim(image);ctx.save();this.interfacePath(ctx,rim);ctx.clip();
 if(matrix&&v.matrix>0){ctx.save();ctx.beginPath();ctx.rect(0,430,W*v.matrix,310);ctx.clip();ctx.globalAlpha=.68;ctx.drawImage(matrix,0,465,W,260);ctx.restore();}
 if(crystal&&v.crystals>0){for(let row=0;row<2;row++)for(let i=0;i<7;i++){const seed=row*7+i,x=30+i*224+(row?75:0)+random(seed+31)*30,width=145+random(seed+6)*65,height=width/2,y=lineAt(rim,x)+12+row*57+random(seed+9)*13;
 const amount=clamp((v.crystals-(i*.068+row*.09))/.46);if(amount<=0)continue;ctx.save();ctx.translate(x+width/2,y+height/2);ctx.rotate((random(seed+27)-.5)*.25);if(seed%3===0)ctx.scale(-1,1);ctx.beginPath();ctx.rect(-width/2-4,-height/2-4,width+8,(height+8)*amount);ctx.clip();ctx.globalAlpha=.85;ctx.drawImage(crystal,-width/2,-height/2,width,height);ctx.restore();}}
 if(v.material>0){ctx.save();ctx.beginPath();rim.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));[...rim].reverse().forEach(([x,y])=>ctx.lineTo(x,y+(54+Math.sin(x*.023)*5)*v.material));ctx.closePath();ctx.clip();ctx.drawImage(image,580,250,900,180,0,400,1536,240);ctx.restore();}

 ctx.restore();ctx.restore();this.macroPose=p;
 }
 shellRim(image){if(this.rim)return this.rim;const c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,W,H);const data=ctx.getImageData(0,0,W,H).data,points=[];for(let x=0;x<W;x+=4){let end=350;for(let y=350;y<620;y++){const n=(y*W+x)*4;if(data[n]>120&&data[n+1]>140&&data[n]+data[n+1]+data[n+2]>480)end=y;}points.push([x,end+2]);}const smoothed=points.map(([x,y],i)=>[x,points.slice(Math.max(0,i-2),Math.min(points.length,i+3)).reduce((n,p)=>n+p[1],0)/points.slice(Math.max(0,i-2),Math.min(points.length,i+3)).length]);smoothed.push([W,smoothed.at(-1)[1]]);this.rim=smoothed;return smoothed;}
 interfacePath(ctx,rim){ctx.beginPath();rim.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));[...floorEdges].reverse().forEach(([x,y])=>ctx.lineTo(x,y));ctx.closePath();}
 paintMussel(v){const image=available('mussel-v2.webp');if(!image)return;const ctx=this.ctx;let pose;
 if(this.w>=700){pose=this.cover(image,lerp(1.08,1,ease(clamp(v.progress/.74))),.48,.54);}
 else{pose=this.paintMobileWorld(image,'mussel',lerp(1.08,1,ease(clamp(v.progress/.74))));}
 this.musselPose=pose;this.atmosphere(.55);
 const amount=ease((v.progress-.20)/.45);if(amount>0){ctx.save();ctx.translate(pose.x,pose.y);ctx.scale(pose.s,pose.s);ctx.lineWidth=2.5;ctx.lineCap='round';ctx.strokeStyle='rgba(255,246,217,.70)';
 const paths=[[[100,637],[190,460],[410,333],[660,280],[795,305],[835,366],[790,447],[650,513]],[[103,660],[270,740],[500,812],[720,811],[860,760],[890,703],[795,634]]];
 for(const points of paths){const curve=[];for(let i=0;i<points.length-1;i++){const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],d=points[Math.min(points.length-1,i+2)];for(let j=0;j<12;j++){const t=j/12,tt=t*t,ttt=tt*t;curve.push([0,1].map(k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*tt+(-a[k]+3*b[k]-3*c[k]+d[k])*ttt)));}}curve.push(points.at(-1));const n=Math.max(2,Math.floor(curve.length*amount));ctx.beginPath();curve.slice(0,n).forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();}ctx.restore();}
 }
 paintSea(v){const image=available('open-water-v2.webp');if(!image)return;this.cover(image,1.04,.5,.43);this.atmosphere(1);}
 atmosphere(amount){if(amount<.01)return;const ctx=this.ctx,w=this.w,h=this.h;ctx.save();ctx.globalAlpha=amount;
 const beam=ctx.createLinearGradient(w*.52,0,w*.85,h);beam.addColorStop(0,'rgba(228,241,255,.075)');beam.addColorStop(.5,'rgba(225,238,255,.03)');beam.addColorStop(1,'rgba(225,238,255,0)');ctx.fillStyle=beam;ctx.beginPath();const shift=Math.sin(this.time*.16)*w*.012;ctx.moveTo(w*.68+shift,0);ctx.lineTo(w*.84+shift,0);ctx.lineTo(w*.46+shift,h);ctx.lineTo(w*.31+shift,h);ctx.closePath();ctx.fill();
 const fish=available('fish.webp'),count=this.scene==='animal'||this.scene==='formation'?0:this.scene==='bivalve'?2:4;if(fish)for(let i=0;i<count;i++){const size=(w<700?48:82)*(1+random(i+5)*.4),direction=i%2?-1:1;let x=((random(i+14)*(w+size*2)+this.time*(16+i*3))%(w+size*2))-size;if(direction<0)x=w-x;const y=h*(this.scene==='bivalve'?[.13,.20][i]:[.15,.23,.70,.83][i])+Math.sin(this.time*.4+i)*7;ctx.save();ctx.translate(x,y);ctx.scale(direction,1+Math.sin(this.time*1.4+i)*.035);ctx.globalAlpha=amount*(.18+i*.045);ctx.drawImage(fish,-size/2,-size/4,size,size/2);ctx.restore();}
 ctx.restore();}
 draw(){this.size();const ctx=this.ctx,v=viewAt(this.scene,this.progress);ctx.fillStyle='#103f89';ctx.fillRect(0,0,this.w,this.h);
 if(this.scene==='start'||this.scene==='animal'){this.paintOcean(v);if(v.section>0){ctx.save();ctx.globalAlpha=v.section;this.paintSection(v);ctx.restore();}}
 else if(this.scene==='formation'){this.paintSection(v);if(v.mussel>0){ctx.save();ctx.globalAlpha=v.mussel;this.paintMussel({...v,progress:0});ctx.restore();}}
 else if(this.scene==='bivalve'){this.paintMussel(v);if(v.sea>0){ctx.save();ctx.globalAlpha=v.sea;this.paintSea(v);ctx.restore();}}
 else this.paintSea(v);
 this.canvas.dataset.frame=JSON.stringify(v);this.dirty=false;this.onFrame?.(v,{section:this.macroPose,mussel:this.musselPose});}
}
