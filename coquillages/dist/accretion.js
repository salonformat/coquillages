// A short interval of accretion, not a simulation of a species' complete life.
// All coordinates describe additions outside a fixed, already formed shell.
export const ACCRETION_AMOUNT=.09;
export function rimAt(base,progress,kind){
 const p=Math.max(0,Math.min(1,progress));
 return base.map(([x,y],i)=>{
  if(kind==='snail'){const taper=Math.sin(Math.PI*i/(base.length-1));return[x+85*p*taper,y+18*p*taper];}
  const distance=Math.hypot(x-315,y-578),taper=Math.min(1,distance/180);
  return[x+(x-315)*ACCRETION_AMOUNT*p*taper,y+(y-578)*ACCRETION_AMOUNT*p*taper];
 });
}
export function accretionStrip(base,progress,kind){return [...base,...rimAt(base,progress,kind).reverse()];}
