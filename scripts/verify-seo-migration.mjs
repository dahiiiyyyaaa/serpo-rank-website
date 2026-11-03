import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const origin=process.argv[2] || 'http://127.0.0.1:8094';
const home='/seo-for-home-cleaning-businesses/';
const sitemap=readFileSync('public/sitemap.xml','utf8');
const paths=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const report={origin,checkedAt:new Date().toISOString(),pages:[],redirects:[],resources:[],external:[]};
const get=(path,redirect='manual')=>fetch(new URL(path,origin),{redirect,signal:AbortSignal.timeout(25000)});
const common=(response,path)=>{
 assert.equal(response.headers.get('x-content-type-options'),'nosniff',path+' nosniff');
 assert.equal(response.headers.get('x-frame-options'),'SAMEORIGIN',path+' framing');
 assert.ok(response.headers.get('content-security-policy') || response.headers.get('content-security-policy-report-only'),path+' CSP');
 if(origin.startsWith('https:')) assert.ok(response.headers.get('strict-transport-security'),path+' HSTS');
};
const external=new Set(); const resources=new Set(); const params=new Set();
for(const path of paths){
 const res=await get(path); assert.equal(res.status,200,path); common(res,path);
 const dom=new JSDOM(await res.text(),{url:new URL(path,origin).href});const d=dom.window.document;
 const canonical='https://serporank.com'+path;
 assert.equal(d.querySelectorAll('link[rel=canonical]').length,1,path+' canonicals');
 assert.equal(d.querySelector('link[rel=canonical]').href,canonical);
 assert.ok(!/noindex|nofollow/i.test(d.querySelector('meta[name=robots]')?.content || ''),path+' robots');
 assert.equal(d.querySelectorAll('h1').length,1,path+' H1');
 let previous=0;const headingJumps=[];
 for(const el of d.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')){const level=Number(el.tagName[1]);if(previous && level>previous+1)headingJumps.push(el.textContent.trim());previous=level;}
 for(const a of d.querySelectorAll('a[href]')){
  const url=new URL(a.href);
  assert.ok(a.textContent.trim() || a.getAttribute('aria-label') || a.querySelector('img[alt]')?.alt,path+' unnamed link '+a.href);
  if(url.origin===origin){
   assert.ok(!['/','/services','/services/','/seo-audit','/services/seo-audits'].includes(url.pathname),path+' redirecting internal link '+a.href);
   if(url.search) params.add(url.pathname+url.search);
   if(url.pathname===path && url.hash) assert.ok(d.getElementById(decodeURIComponent(url.hash.slice(1))),path+' missing anchor '+url.hash);
  }else if(url.protocol==='https:')external.add(a.href);
 }
 for(const i of d.images){assert.ok(i.hasAttribute('alt'),path+' image without alt');resources.add(i.getAttribute('src'));}
 for(const e of d.querySelectorAll('script[src],link[rel=stylesheet]'))resources.add(e.getAttribute('src')||e.getAttribute('href'));
 if(path===home){assert.ok(d.getElementById('our-seo-services'));assert.ok(d.getElementById('book-free-audit'));}
 report.pages.push({path,status:res.status,canonical,words:d.querySelector('main').textContent.trim().split(/\s+/).length,h2:d.querySelectorAll('h2').length,headingJumps});dom.window.close();
}
for(const [path,target] of [['/',home],['/seo-for-home-cleaning-businesses',home],['/services',home+'#our-seo-services'],['/services/',home+'#our-seo-services'],['/seo-audit',home+'#book-free-audit'],['/seo-audit/',home+'#book-free-audit'],['/services/seo-audits',home+'#book-free-audit'],['/services/website-development',home]]){
 const r=await get(path);assert.equal(r.status,301,path);common(r,path);assert.equal(new URL(r.headers.get('location'),origin).href,new URL(target,origin).href,path+' target');
 const end=await get(target);assert.equal(end.status,200,path+' redirect chain');report.redirects.push({path,status:301,to:target});
}
for(const path of params){const r=await get(path);assert.equal(r.status,200,path);const dom=new JSDOM(await r.text());assert.equal(dom.window.document.querySelector('link[rel=canonical]').href,'https://serporank.com/contact');report.pages.push({path,status:200,canonical:'https://serporank.com/contact'});dom.window.close();}
for(const path of resources){if(!path?.startsWith('/'))continue;const r=await get(path);assert.equal(r.status,200,path);common(r,path);const bytes=(await r.arrayBuffer()).byteLength;report.resources.push({path,bytes});}
for(const path of ['/sitemap.xml','/robots.txt','/does-not-exist-seo-check']){const r=await get(path);assert.equal(r.status,path.includes('does-not')?404:200,path);common(r,path);await r.body?.cancel();}
if(process.argv.includes('--external'))for(const url of external){try{const r=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(20000)});report.external.push({url,status:r.status,final:r.url});await r.body?.cancel();}catch(e){report.external.push({url,error:e.message});}}
const output='docs/seo-migration/'+(origin.includes('127.0.0.1')?'local':'live')+'-verification.json';writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify({pages:report.pages.length,redirects:report.redirects.length,resources:report.resources.length,headingJumps:report.pages.filter(p=>p.headingJumps?.length),external:report.external,output},null,2));
