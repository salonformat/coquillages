import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {offsetFor} from '../dist/journey.js';
const require=createRequire(import.meta.url),{chromium}=require('/Users/isabellakohout/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true});const errors=[];
try{
 for(const lang of ['de','fr','en']){
  const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:4173/?lang=${lang}&v=raumreise-10#start`);
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.ready==='true');
  assert.equal(await page.locator('html').getAttribute('lang'),lang);
  await page.mouse.wheel(0,300);await page.waitForTimeout(200);assert.ok(await page.evaluate(()=>scrollY)>0);
  for(const [id,p]of [['animal',.3],['edge',.5],['growth',.15],['growth',.6],['growth',.15],['bivalve',.4],['ending',0]]){
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),offsetFor(id,p,900));
   await page.waitForFunction(id=>document.body.dataset.scene===id&&document.querySelector('#scene').dataset.ready==='true',id);await page.waitForTimeout(100);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(id==='growth'){const camera=await page.locator('#journey-stage').getAttribute('data-camera');assert.ok(camera);}
   if(id==='bivalve'){const button=page.locator('#inspect-mussel');await button.focus();await page.keyboard.press('Enter');await page.waitForTimeout(600);assert.equal(await button.getAttribute('aria-expanded'),'true');await button.click();assert.equal(await button.getAttribute('aria-expanded'),'false');}
  }
  assert.ok(await page.locator('#postcard').isVisible());assert.ok((await page.locator('a[download]').getAttribute('href')).endsWith(`postcard-${lang}.gif`));
  await page.goBack();await page.waitForFunction(()=>document.body.dataset.scene==='bivalve');
  assert.ok(await page.locator('a[href="https://salonformat.com"]').count()>0);
  await page.close();
 }
 const mobile=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true});
 await mobile.goto('http://127.0.0.1:4173/?lang=de#start');await mobile.waitForFunction(()=>document.querySelector('#scene').dataset.ready==='true');
 const client=await mobile.context().newCDPSession(mobile);await client.send('Input.synthesizeScrollGesture',{x:180,y:510,yDistance:-450,speed:800,gestureSourceType:'touch'});await mobile.waitForTimeout(250);assert.ok(await mobile.evaluate(()=>scrollY)>100);
 await mobile.close();assert.deepEqual(errors,[]);console.log('PASS: DE/FR/EN journey, wheel/touch, reversible scroll, keyboard inspection, postcard, browser back, no horizontal overflow or runtime errors.');
}finally{await browser.close();}
