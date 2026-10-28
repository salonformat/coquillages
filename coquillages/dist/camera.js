import {clamp} from './learning.js?v=release-15';
export const smooth=value=>{const p=clamp(value);return p*p*(3-2*p);};
const mix=(a,b,p)=>a+(b-a)*p;
export function cameraAt(scene,progress,width,height,{reduced=false,inspection=0}={}){
 const p=clamp(progress),mobile=width<701;
 const full=Math.min(width*(mobile?.88:.62)/1536,height*(mobile?.30:.57)/1024);
 const close=mobile?width/620:Math.min(width/880,height/620);
 const pose=(anchor,x,y,s)=>({s,tx:x-anchor[0]*s,ty:y-anchor[1]*s});
 const center=[870,565],mouth=[1250,778];
 const whole=pose(center,width*(mobile?.5:.48),height*(mobile?.57:.54),full);
 const hero=pose(center,width*(mobile?.55:.75),height*(mobile?.76:.56),Math.min(width*(mobile?.98:.57)/1250,height*(mobile?.34:.77)/900));
 const approach=pose(center,width*(mobile?.5:.48),height*(mobile?.57:.54),full*1.1);
 const detail=pose(mouth,width*(mobile?.48:.70),height*(mobile?.66:.60),close);
 const arriving=pose(mouth,width*(mobile?.48:.70),height*(mobile?.66:.60),close*.86);
 const interpolate=(a,b,t)=>({s:mix(a.s,b.s,t),tx:mix(a.tx,b.tx,t),ty:mix(a.ty,b.ty,t)});
 let snail={...whole,alpha:1,body:0,material:0},mussel={s:full,tx:0,ty:0,alpha:0,material:0},focus=0,depth=1,pan=0,lift=0;
 if(scene==='start'){snail={...interpolate(hero,whole,smooth(p)),alpha:1,body:smooth((p-.25)/.55),material:0};depth=smooth(p);}
 if(scene==='animal'){
  const a=smooth(p/.28),b=smooth((p-.65)/.35);
  snail={...interpolate(interpolate(whole,approach,a),arriving,b),alpha:1,body:1-smooth((p-.65)/.3),material:0};focus=b*.75;
 }
 if(scene==='edge'){snail={...interpolate(arriving,detail,smooth(p/.32)),alpha:1,body:0,material:0};focus=.75+.25*smooth(p/.32);}
 if(scene==='growth'){
  snail={...interpolate(detail,whole,smooth((p-.76)/.24)),alpha:1,body:0,material:clamp(p/.72)};
  focus=1-smooth((p-.76)/.24);
 }
 if(scene==='bivalve'){
  const travel=smooth(p/.22),ascend=smooth((p-.82)/.18),peek=inspection*(1-smooth((p-.74)/.08));
  snail={...whole,tx:whole.tx-width*1.3*travel,alpha:1-travel,body:0,material:1};
  const rest=pose([870,565],width*(mobile?.46:.36),height*(mobile?.61:.57),full*(mobile?1:.96));
  const near=pose([870,565],width*(mobile?.46:.36),height*(mobile?.61:.57),rest.s*1.15);
  mussel={...interpolate(rest,near,peek),alpha:1-ascend,material:clamp((p-.24)/.46)};
  mussel.tx+=width*1.15*(1-travel);mussel.ty+=height*.65*ascend;mussel.s*=1-.28*ascend;
  focus=travel*(1-ascend);pan=travel;lift=ascend;depth=1-ascend;
 }
 if(scene==='ending'||scene==='about'){snail.alpha=0;mussel.alpha=0;depth=0;pan=1;lift=1;}
 if(reduced){
  if(scene==='start')snail={...hero,alpha:1,body:0,material:0};if(scene==='animal')snail={...whole,alpha:1,body:1,material:0};
  if(['edge','growth'].includes(scene))snail={...detail,alpha:1,body:0,material:scene==='growth'?clamp(p/.72):0};
  if(scene==='bivalve'){snail.alpha=0;mussel={...pose([870,565],width*(mobile?.46:.36),height*(mobile?.61:.57),full),alpha:1,material:clamp((p-.24)/.46)};}
 }
 return {snail,mussel,focus,depth,pan,lift,inspectionVisible:scene==='bivalve'&&p>=.22&&p<.8};
}
