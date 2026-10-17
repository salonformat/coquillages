import {clamp} from './learning.js';

// Distances are viewport heights, so touch and wheel share the same path.
export const CHAPTERS=[
  {id:'start',start:0,length:1.05},
  {id:'animal',start:1.05,length:1.4},
  {id:'edge',start:2.45,length:1.2},
  {id:'growth',start:3.65,length:1.75},
  {id:'bivalve',start:5.4,length:1.5},
  {id:'transfer',start:6.9,length:1.15},
  {id:'ending',start:8.05,length:1}
];
export const journeyHeight=height=>(CHAPTERS.at(-1).start+1)*height;
export function positionAt(y,height){
  const units=Math.max(0,y)/Math.max(1,height);
  const chapter=CHAPTERS.findLast(c=>units+1/Math.max(1,height)>=c.start)||CHAPTERS[0];
  return {scene:chapter.id,progress:chapter.id==='ending'?1:clamp((units-chapter.start)/chapter.length)};
}
export function offsetFor(scene,progress,height){const c=CHAPTERS.find(c=>c.id===scene)||CHAPTERS[0];return (c.start+(c.id==='ending'?0:clamp(progress,0,.999)*c.length))*height;}
export const growthAt=progress=>clamp(progress/.82);
export function containedImagePoint(x,y,box,width,height){
  const scale=Math.min(box.width/width,box.height/height);
  const ox=box.left+(box.width-width*scale)/2,oy=box.top+(box.height-height*scale)/2;
  return {x:(x-ox)/scale,y:(y-oy)/scale};
}
