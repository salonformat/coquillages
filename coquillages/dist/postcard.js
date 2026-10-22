export const POSTCARD_DURATION=6;
export function paintPostcard(ctx,assets,time,text){
 const {width:w,height:h}=ctx.canvas,t=(time%POSTCARD_DURATION)/POSTCARD_DURATION,phase=t*Math.PI*2;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#0b4575';ctx.fillRect(0,0,w,h);
 const bg=assets.water,cover=Math.max(w/bg.width,h/bg.height)*1.04,bw=bg.width*cover,bh=bg.height*cover;
 ctx.drawImage(bg,(w-bw)/2+Math.sin(phase)*w*.006,(h-bh)/2+Math.cos(phase)*h*.004,bw,bh);
 const veil=ctx.createLinearGradient(0,0,0,h);veil.addColorStop(0,'rgba(2,30,68,.5)');veil.addColorStop(.55,'rgba(4,43,77,.04)');veil.addColorStop(1,'rgba(3,29,58,.85)');ctx.fillStyle=veil;ctx.fillRect(0,0,w,h);
 for(let i=0;i<2;i++){const fw=w*(i?.14:.19),fh=fw*assets.fish.height/assets.fish.width,x=((t+(i?.56:.08))%1)*(w+fw*2)-fw,y=h*(i?.42:.28)+Math.sin(phase+i)*h*.007;ctx.save();ctx.globalAlpha=i?.42:.62;ctx.translate(x,y);ctx.drawImage(assets.fish,-fw/2,-fh/2,fw,fh);ctx.restore();}
 const sw=w*.56,sh=sw*assets.shell.height/assets.shell.width;ctx.drawImage(assets.shell,w*.25,h*.36,sw,sh);
 ctx.textAlign='center';ctx.fillStyle='#f5f7ee';ctx.font=`${w*.048}px "Della Respira"`;ctx.fillText(text.title,w/2,h*.14,w*.9);
 ctx.font=`${w*.029}px "Josefin Sans"`;ctx.fillText(text.line,w/2,h*.86,w*.9);ctx.font=`${w*.019}px "Josefin Sans"`;ctx.fillText('SALONFORMAT',w/2,h*.95);
}
