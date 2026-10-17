
function random(seed){const n=Math.sin(seed*127.1+311.7)*43758.5453;return n-Math.floor(n);}
function context(canvas){const box=canvas.getBoundingClientRect(),w=box.width||canvas.width,h=box.height||canvas.height,dpr=box.width?Math.min(devicePixelRatio||1,2):1;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);return {ctx,w,h};}

const rimCache=new WeakMap();
export function drawTransfer(canvas,image,progress=1){
  if(!image?.complete||!image.naturalWidth)return;
  if(!rimCache.has(image)){
    const sample=document.createElement('canvas');sample.width=image.naturalWidth;sample.height=image.naturalHeight;const source=sample.getContext('2d',{willReadFrequently:true});source.drawImage(image,0,0);const pixels=source.getImageData(0,0,sample.width,sample.height).data,points=[];
    for(let x=Math.floor(sample.width*.2);x<sample.width*.8;x+=4){let y=sample.height-1;while(y>sample.height*.6&&pixels[(y*sample.width+x)*4+3]<190)y--;if(y>sample.height*.6)points.push([x,y]);}rimCache.set(image,points);
  }
  const {ctx,w,h}=context(canvas),scale=Math.min(w/image.naturalWidth,h/image.naturalHeight),ox=(w-image.naturalWidth*scale)/2,oy=(h-image.naturalHeight*scale)/2,points=rimCache.get(image),count=Math.floor(points.length*Math.max(0,Math.min(1,progress)));
  if(count<2)return;ctx.strokeStyle='#ffdda4';ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.slice(0,count).forEach(([x,y],i)=>{i?ctx.lineTo(ox+x*scale,oy+y*scale+2):ctx.moveTo(ox+x*scale,oy+y*scale+2);});ctx.stroke();
}

export class Ocean{
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.active=true;this.scene='start';this.fish=new Image();this.fish.src='assets/fish.png';this.fish.onload=()=>this.draw();this.particles=Array.from({length:46},(_,i)=>({x:random(i),y:random(i+100),size:random(i+200)*1.6+.5,speed:random(i+300)*.005+.002}));this.time=0;this.last=0;this.resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);this.w=innerWidth;this.h=innerHeight;canvas.width=this.w*dpr;canvas.height=this.h*dpr;this.ctx.setTransform(dpr,0,0,dpr,0,0);this.draw();};window.addEventListener('resize',this.resize);this.resize();this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);}
  setActive(active){this.active=active;this.draw();}
  setScene(scene){this.scene=scene;this.draw();}
  frame(now){const dt=Math.min(now-this.last,50);this.last=now;if(this.active&&!document.hidden){this.time+=dt/1000;this.draw();}requestAnimationFrame(this.frame);}
  draw(){
    const ctx=this.ctx;ctx.clearRect(0,0,this.w,this.h);
    for(const [i,p]of this.particles.entries()){const y=(p.y-this.time*p.speed+10)%1,x=(p.x+this.time*.006+Math.sin(this.time*.3+i)*.008)%1;ctx.fillStyle=`rgba(219,236,224,${.1+random(i+600)*.3})`;ctx.beginPath();ctx.ellipse(x*this.w,y*this.h,p.size,p.size*.55,-.7,0,Math.PI*2);ctx.fill();}
    if(!this.fish.complete||!this.fish.naturalWidth)return;
    const close=this.scene==='edge'||this.scene==='growth',count=close?2:6;
    for(let i=0;i<count;i++){
      const direction=i%3===0?-1:1,size=(innerWidth<701?65:90)+random(i+710)*70,speed=12+random(i+720)*20;
      const travel=this.w+size*2,position=(random(i+740)*travel+this.time*speed)%travel;
      const x=direction===1?position-size:this.w-position+size;
      const lane=[.20,.76,.87,.31,.69,.16][i],y=this.h*lane+Math.sin(this.time*.5+i)*9;
      ctx.save();ctx.translate(x,y);ctx.scale(direction,1);ctx.globalAlpha=close?.22:.28+random(i+780)*.34;
      const scale=size/this.fish.naturalWidth,height=this.fish.naturalHeight;
      // Bend only the tail of the pencil drawing; its body remains intact.
      for(let sx=0;sx<this.fish.naturalWidth;sx+=24){const sw=Math.min(24,this.fish.naturalWidth-sx),tail=Math.max(0,1-sx/(this.fish.naturalWidth*.34)),bend=Math.sin(this.time*4.5+i+sx*.02)*tail*5;ctx.drawImage(this.fish,sx,0,sw,height,sx*scale,bend*scale,sw*scale,height*scale);}
      ctx.restore();
    }
  }
}

export class SeaSound{
  async set(active){
    if(!active){if(this.ctx)await this.ctx.suspend();return;}
    if(!this.ctx){
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('Audio unavailable');this.ctx=new Audio();
      const length=this.ctx.sampleRate*6,buffer=this.ctx.createBuffer(1,length,this.ctx.sampleRate),channel=buffer.getChannelData(0);let last=0;
      for(let i=0;i<length;i++){const white=Math.random()*2-1;last=(last+.02*white)/1.02;channel[i]=last*3;}
      const source=this.ctx.createBufferSource();source.buffer=buffer;source.loop=true;
      const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=550;const gain=this.ctx.createGain();gain.gain.value=.1;
      source.connect(filter);filter.connect(gain);gain.connect(this.ctx.destination);source.start();
      const lfo=this.ctx.createOscillator(),depth=this.ctx.createGain();lfo.frequency.value=.08;depth.gain.value=.025;lfo.connect(depth);depth.connect(gain.gain);lfo.start();
    }
    await this.ctx.resume();
  }
}
