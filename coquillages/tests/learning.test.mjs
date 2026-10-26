import test from 'node:test';
import assert from 'node:assert/strict';
import {rimAt,accretionStrip} from '../dist/accretion.js';
import {SCENES,nextScene,previousScene,readRoute,routeUrl,growthAssessment} from '../dist/learning.js';
test('A full path explains why before how and finishes with transfer',()=>{
  let scene='start';const visited=[scene];while(scene!=='ending'){scene=nextScene(scene);visited.push(scene);}
  assert.deepEqual(visited,SCENES);
  assert.ok(visited.indexOf('animal')<visited.indexOf('growth'));assert.equal(readRoute('https://example.org/#why').scene,'animal');
  assert.ok(visited.indexOf('transfer')<visited.indexOf('ending'));
  for(let i=1;i<visited.length;i++)assert.equal(previousScene(visited[i]),visited[i-1]);
});
test('Every scene and sources route round-trips in all languages',()=>{
  for(const scene of [...SCENES,'about'])for(const lang of ['de','fr','en'])assert.deepEqual(readRoute(routeUrl('https://example.org/coquillages/',scene,lang)),{scene,lang});
  assert.deepEqual(readRoute('https://example.org/?lang=invalid#missing'),{scene:'start',lang:'de'});
});
test('Accretion preserves the starting rim and hinge; only new material extends outward',()=>{const base=[[315,578],[900,100],[1200,300],[315,578]],original=structuredClone(base);for(const p of [0,.2,.5,1]){const rim=rimAt(base,p,'mussel');assert.deepEqual(rim[0],base[0]);for(let i=1;i<rim.length-1;i++)assert.ok(Math.hypot(rim[i][0]-315,rim[i][1]-578)>=Math.hypot(base[i][0]-315,base[i][1]-578));assert.deepEqual(accretionStrip(base,p,'mussel').slice(0,base.length),base);}assert.deepEqual(base,original);const lip=[[1100,625],[1220,690],[1190,749]];assert.deepEqual(rimAt(lip,0,'snail'),lip);assert.ok(rimAt(lip,1,'snail')[1][0]>lip[1][0]);});
test('Feedback corrects the old-area misconception',()=>{
  assert.equal(growthAssessment('tip').correct,false);
  assert.equal(growthAssessment('hinge').feedback,'old-feedback');
  assert.equal(growthAssessment('edge').correct,true);
});

test('Scroll position controls reversible growth and chapter boundaries',async()=>{const {positionAt,offsetFor,growthAt,CHAPTERS,journeyHeight,containedImagePoint}=await import('../dist/journey.js');for(const c of CHAPTERS){for(const p of [0,.2,.8]){const state=positionAt(offsetFor(c.id,p,900),900);assert.equal(state.scene,c.id);if(c.id!=='ending')assert.ok(Math.abs(state.progress-p)<1e-6);}}assert.equal(positionAt(0,900).scene,'start');assert.equal(positionAt(99999,900).scene,'ending');assert.equal(positionAt(Math.floor(offsetFor('ending',0,844)),844).scene,'ending');assert.equal(growthAt(0),0);assert.equal(growthAt(.82),1);assert.ok(growthAt(.6)>growthAt(.2));assert.ok(journeyHeight(900)>offsetFor('ending',0,900));assert.deepEqual(containedImagePoint(150,100,{left:0,top:0,width:300,height:200},100,100),{x:50,y:50});});
