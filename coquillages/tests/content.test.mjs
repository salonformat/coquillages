import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {CONTENT} from '../dist/content.js';
import {SCENES} from '../dist/learning.js';
test('All learning steps and controls exist in DE FR EN with matching keys',()=>{
  const flatten=obj=>Object.keys(obj).sort().flatMap(k=>typeof obj[k]==='object'&&!Array.isArray(obj[k])?Object.keys(obj[k]).sort().map(sub=>k+'.'+sub):[k]);
  for(const lang of ['de','fr','en']){
    assert.deepEqual(flatten(CONTENT[lang]),flatten(CONTENT.de));
    for(const scene of SCENES){assert.ok(CONTENT[lang][scene].title);}
    assert.ok(CONTENT[lang].why.body);assert.equal(CONTENT[lang].ending.download,undefined);assert.equal(CONTENT[lang].ui.progressNames.length,SCENES.length);
  }
});
test('All shell illustrations, fonts and ocean background are shipped',()=>{
  for(const name of ['snail.png','mussel.png','scallop.png','della-respira.woff2','josefin-sans.woff2','ocean-minimal.jpg'])assert.ok(existsSync(new URL('../dist/assets/'+name,import.meta.url)),name);
});
test('SALONFORMAT links are ordinary reachable anchors in global navigation',()=>{
  const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
  assert.equal((html.match(/href="https:\/\/salonformat.com"/g)||[]).length,3);
  assert.ok(html.includes('id="back"'));
  const js=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
  assert.ok(js.includes("addEventListener('popstate'"));assert.ok(js.includes('history.pushState'));
});
