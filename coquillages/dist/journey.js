import {clamp} from './learning.js?v=release-17';

// Distances are viewport heights, so touch and wheel share the same path.
export const CHAPTERS=[
  {id:'start',start:0,length:1.25},
  {id:'animal',start:1.25,length:1.45},
  {id:'edge',start:2.7,length:1.75},
  {id:'growth',start:4.45,length:1.8},
  {id:'bivalve',start:6.25,length:2.1},
  {id:'ending',start:8.35,length:1}
];
export const journeyHeight=height=>(CHAPTERS.at(-1).start+1)*height;
export function positionAt(y,height){
  const units=Math.max(0,y)/Math.max(1,height);
  const chapter=CHAPTERS.findLast(c=>units+1/Math.max(1,height)>=c.start)||CHAPTERS[0];
  return {scene:chapter.id,progress:chapter.id==='ending'?1:clamp((units-chapter.start)/chapter.length)};
}
export function offsetFor(scene,progress,height){const c=CHAPTERS.find(c=>c.id===(scene==='transfer'?'bivalve':scene))||CHAPTERS[0];return (c.start+(c.id==='ending'?0:clamp(progress,0,.999)*c.length))*height;}
export const growthAt=progress=>clamp(progress/.72);
export function containedImagePoint(x,y,box,width,height){
  const scale=Math.min(box.width/width,box.height/height);
  const ox=box.left+(box.width-width*scale)/2,oy=box.top+(box.height-height*scale)/2;
  return {x:(x-ox)/scale,y:(y-oy)/scale};
}
