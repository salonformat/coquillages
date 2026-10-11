import test from 'node:test';
import assert from 'node:assert/strict';
import {frameBlend} from '../dist/art.js';
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
test('Painted growth selects chronological frames without scaling the whole drawing',()=>{assert.deepEqual(frameBlend(0),{lower:0,upper:0,mix:0});assert.deepEqual(frameBlend(.5),{lower:1,upper:1,mix:0});assert.deepEqual(frameBlend(1),{lower:2,upper:2,mix:0});assert.ok(Math.abs(frameBlend(.325).mix-.5)<1e-10);});
test('Feedback corrects the old-area misconception',()=>{
  assert.equal(growthAssessment('tip').correct,false);
  assert.equal(growthAssessment('hinge').feedback,'old-feedback');
  assert.equal(growthAssessment('edge').correct,true);
});

test('Automatic timing grows after the introduction and stops at the ending',async()=>{const {DURATIONS,automaticProgress,shouldAdvance}=await import('../dist/learning.js');assert.equal(automaticProgress('growth',1),0);assert.equal(automaticProgress('growth',14),1);assert.equal(automaticProgress('bivalve',4),0);assert.equal(automaticProgress('bivalve',17),1);assert.equal(shouldAdvance('animal',DURATIONS.animal),true);assert.equal(shouldAdvance('ending',100),false);});
