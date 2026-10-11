import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'/Users/isabellakohout/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.TEST_URL||'http://127.0.0.1:4173/',out='output/qa';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true}),errors=[],results=[];
const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true,reducedMotion:'reduce'}),page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const ready=async id=>{await page.waitForFunction(id=>location.hash==='#'+id&&document.querySelector('#scene').dataset.ready==='true',id,{polling:100});};
const screenshot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${out}/${name}.png`,fullPage:true,animations:'disabled'});};

for(const lang of ['de','fr','en']){
 await page.clock.resume().catch(()=>{});await page.goto(`${base}?lang=${lang}#start`);await ready('start');assert.equal(await page.locator('html').getAttribute('lang'),lang);if(lang==='de')await screenshot('desktop-start');
 await page.locator('[data-action="begin"]').click();await ready('animal');await page.clock.install();assert.equal(await page.locator('input[type=range]').count(),0);if(lang==='de')await screenshot('desktop-animal');
 for(const [id,seconds,next] of [['animal',7.3,'edge'],['edge',6.3,'growth'],['growth',9.3,'bivalve'],['bivalve',9.3,'transfer'],['transfer',6.3,'ending']]){
  await ready(id);if(id==='growth'){await page.clock.runFor(4000);await page.locator('#motion').click();const before=await page.locator('#scene-time').getAttribute('style');await page.clock.runFor(3000);assert.equal(await page.locator('#scene-time').getAttribute('style'),before);if(lang==='de')await screenshot('desktop-growth');await page.locator('#motion').click();await page.clock.runFor((seconds-4)*1000);}else if(id==='bivalve'){await page.clock.runFor(7000);if(lang==='de')await screenshot('desktop-mussel');await page.clock.runFor((seconds-7)*1000);}else await page.clock.runFor(seconds*1000);
  await ready(next);
 }
 if(lang==='de')await screenshot('desktop-ending');const downloadPromise=page.waitForEvent('download');await page.locator('[data-action="download"]').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),`coquillages-${lang}.png`);await download.saveAs(`${out}/coquillages-${lang}.png`);
 await page.goBack();await ready('transfer');await page.clock.runFor(15000);assert.equal(new URL(page.url()).hash,'#transfer');assert.equal(await page.locator('#motion').getAttribute('aria-pressed'),'true');
 await page.locator('#back').click();await ready('bivalve');await page.locator('[data-lang="en"]').click();await ready('bivalve');assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('a[href="https://salonformat.com"]').count(),2);
 results.push({lang,oneClickJourney:true,pause:true,backPauses:true,download:true,noSliders:true});
}
await page.setViewportSize({width:390,height:844});for(const id of ['start','animal','edge','growth','bivalve','transfer','ending']){await page.goto(`${base}?lang=de#${id}`);await ready(id);await screenshot('mobile-'+id);const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.equal(dimensions.scroll,dimensions.width,`Mobile overflow: ${id}`);assert.ok(await page.locator('.wordmark').isVisible());assert.ok(await page.locator('#back').isVisible());}
assert.deepEqual(errors,[]);writeFileSync(`${out}/results.json`,JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors,screenshots:out}));await browser.close();
