import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { integrateGraphics } from './integrate-graphics.mjs';

// Design-only transformation: always regenerate from the supplied original.
const source = 'C:/Users/100neggawatts/Documents/Codex/2026-10-28/my/outputs/serpo-rank-guide/article.html';
const dom = new JSDOM(readFileSync(source, 'utf8'));
const d = dom.window.document;
const main = d.querySelector('main');
const normalize = value => value.replace(/\s+/g, ' ').trim();
const inventory = [...main.querySelectorAll('h1,h2,h3,p,li,th,td')].filter(n => n.textContent.trim() && !n.closest('.notice')).map(n => ({ tag:n.tagName, text:normalize(n.textContent) }));
const sourceLinks = [...main.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'));
const sourceImages = [...main.querySelectorAll('img')].map(i=>({src:i.getAttribute('src'),alt:i.alt}));
const el = (tag, className, html='') => { const n=d.createElement(tag);n.className=className;n.innerHTML=html;return n; };
const title = main.querySelector('h1');
const originalTitle = normalize(title.textContent);
title.textContent = 'How To Grow Your House Cleaning Business with SEO; A Complete Guide To More Visibility, More Leads, More Bookings.';
d.title = 'How To Grow Your House Cleaning Business with SEO | Serpo Rank';
main.querySelector('.notice').remove();
const intro = [title.nextElementSibling, title.nextElementSibling.nextElementSibling];
const takeLabel = intro[1].nextElementSibling;
const takeList = takeLabel.nextElementSibling;
const contentsLabel = takeList.nextElementSibling;
const contentsList = contentsLabel.nextElementSibling;
const readingTime = Math.ceil(main.textContent.trim().split(/\s+/).length / 220);
const hero = el('section','editorial-hero',`<div class="hero-copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="https://serporank.com/">Home</a><span aria-hidden="true">/</span><span>House Cleaning SEO Guide</span></nav></div><div class="hero-visual" role="img" aria-label="Placeholder for a home-cleaning editorial photograph"><div class="photo-outline"><span class="photo-sun"></span><span class="photo-window"></span><span class="photo-vase"></span><span class="photo-towels"></span><span class="photo-bottle"></span></div><span class="visual-label">HOME CLEANING · EDITORIAL IMAGE PLACEHOLDER</span></div>`);
hero.firstElementChild.append(title,...intro,el('div','reading-meta',`<span class="reading-mark" aria-hidden="true">SR</span><span>House Cleaning / SEO field guide<br><small>${readingTime} min read · Independent public research</small></span>`));
const takeaways=el('section','takeaways');takeaways.append(takeLabel,takeList);
const aside=el('aside','contents-sidebar');
const details=el('details','contents-panel');details.open=true;
const summary=el('summary','contents-summary',contentsLabel.innerHTML+'<span aria-hidden="true">+</span>');
details.append(summary,contentsList);aside.append(details,el('a','sidebar-cta','Have a website in mind?<br><strong>Book a Free SEO Audit <span aria-hidden="true">↗</span></strong>'));
aside.lastElementChild.href='https://serporank.com/#book-free-audit';
const contentsOriginalLabel=contentsLabel.textContent;contentsLabel.remove();
const article=el('article','article-body');
const nodes=[...main.children]; let section;
for(const node of nodes){
 if(node.matches('p') && node.querySelector('a[id]') && !node.textContent.trim()) continue;
 if(node.matches('h2')){
  const index=article.children.length;
  section=el('section',`article-section section-${index+1}`);
  section.id=['keywords','profile','architecture','on-page','technical','reviews','authority','bookings','audits','roadmap','faq','next-step'][index];
  section.append(el('div','section-kicker',`<span>${String(index+1).padStart(2,'0')}</span> ${['KEYWORD RESEARCH','GOOGLE BUSINESS PROFILE','WEBSITE STRUCTURE','ON-PAGE SEO','TECHNICAL FOUNDATIONS','REPUTATION & FOLLOW-UP','LOCAL AUTHORITY','FROM VISITS TO VALUE','INDEPENDENT PUBLIC REVIEWS','YOUR IMPLEMENTATION PLAN','QUESTIONS & ANSWERS','YOUR NEXT STEP'][index]}`));
  article.append(section);
 }
 if(section) section.append(node);
}
// Copy comparisons and callouts retain the complete original paragraphs.
const paragraphs=[...article.querySelectorAll('p')];
for(const p of paragraphs){
 if(p.textContent.startsWith('One page can answer'))p.classList.add('editorial-callout');
 if(p.textContent.startsWith('Example review-request message:')){const quote=el('blockquote','review-quote');p.before(quote);quote.append(p);}
 if(p.textContent.startsWith('Before — fictional example:')){const next=p.nextElementSibling;const comparison=el('div','copy-comparison');p.before(comparison);for(const item of [p,next]){const panel=el('div','copy-example');panel.append(item);comparison.append(panel);}}
}
// Keep the complete seven questions and answers in semantic native disclosures.
const faq=article.querySelector('#faq');
for(const h of [...faq.querySelectorAll('h3')]){const answer=h.nextElementSibling;const item=el('details','faq-item');const s=el('summary','');h.before(item);s.append(h);item.append(s,answer);}
for(const h of [...article.querySelectorAll('#audits h3')]){const p=h.nextElementSibling;const card=el('div','public-review');h.before(card);card.append(h,p);}
article.querySelector('#roadmap .table-wrap').classList.add('roadmap-table');
for(const t of article.querySelectorAll('.table-wrap')){t.setAttribute('aria-label',t.closest('section').querySelector('h2').textContent+' — reference table');for(const th of t.querySelectorAll('th'))th.scope='col';}
for(const image of article.querySelectorAll('img')){const p=image.closest('p');p.classList.add('diagram');p.setAttribute('role','group');p.setAttribute('aria-label',image.alt);}
const funnelImg=article.querySelector('img[src*="06-booking"]');
funnelImg.closest('p').classList.add('original-funnel');
funnelImg.closest('p').before(el('figure','booking-funnel',`<figcaption><span class="eyebrow">ILLUSTRATIVE MODEL</span><strong>From search visits to completed jobs</strong><span>Hypothetical assumptions. Not benchmarks, client results, or forecasts.</span></figcaption><ol><li><b>600</b><span>Organic visits</span><small>Starting cohort</small></li><li><b>30</b><span>Inquiries</span><small>5% of visits</small></li><li><b>24</b><span>Qualified inquiries</span><small>80% of inquiries</small></li><li><b>12</b><span>Completed first jobs</span><small>50% of qualified inquiries</small></li></ol><div class="funnel-economics"><div><small>ASSUMED FIRST-JOB VALUE</small><strong>$180</strong></div><div><small>FIRST-JOB REVENUE</small><strong>$2,160</strong></div><div><small>ILLUSTRATIVE ACQUISITION COST</small><strong>$900</strong></div><div><small>COST PER NEW CUSTOMER</small><strong>$75</strong></div></div><p>First-job revenue is before service and acquisition costs.</p></figure>`));
const reviewImage=article.querySelector('img[src*="05-review"]');
reviewImage.closest('p').classList.add('original-workflow');
reviewImage.closest('p').before(el('figure','review-flow',`<figcaption>From a booking to an optional, honest review</figcaption><ol><li><b>01</b><strong>Booking</strong><span>Website or phone; record the appointment and communication preferences.</span></li><li><b>02</b><strong>Completed job</strong><span>Staff confirm the visit actually happened.</span></li><li><b>03</b><strong>Eligibility checks</strong><span>Check opt-outs, previous sends, and frequency. Never filter by sentiment.</span></li><li><b>04</b><strong>Review request</strong><span>Optional feedback through the verified review link.</span></li><li><b>05</b><strong>Human-approved follow-up</strong><span>Review any drafted reply and protect customer privacy.</span></li></ol></figure>`));
const last=article.querySelector('#next-step');last.classList.add('final-cta');last.append(el('a','button button-white','Book a Free SEO Audit <span aria-hidden="true">↗</span>'));last.lastElementChild.href='https://serporank.com/#book-free-audit';
// Contextual links wrap existing words without changing the article copy.
for (const [id,phrase,path] of [['profile','Google Maps','local-seo'],['on-page','On-page SEO','on-page-seo'],['technical','Technical SEO','technical-seo'],['authority','Off-page SEO','off-page-seo']]) {
 const p=[...article.querySelectorAll('#'+id+' p')].find(p=>p.textContent.includes(phrase));
 p.innerHTML=p.innerHTML.replace(phrase,`<a href="https://serporank.com/services/${path}">${phrase}</a>`);
}
main.replaceChildren(hero,takeaways,el('div','article-layout'));
main.lastElementChild.append(aside,article);
d.querySelector('header').outerHTML=`<a class="skip-link" href="#keywords">Skip to article</a><header class="site-header"><a class="wordmark" href="https://serporank.com/">Serpo Rank</a><nav aria-label="Main navigation"><a href="https://serporank.com/">Home</a><a href="https://serporank.com/packages">Pricing</a><a href="https://serporank.com/about">About</a><a href="https://serporank.com/contact">Contact</a></nav><a class="button" href="https://serporank.com/#book-free-audit">Book a Free Audit <span aria-hidden="true">↗</span></a></header>`;
d.querySelector('footer').className='site-footer';
d.querySelector('footer').append(el('p','preview-note','Local design preview · Author attribution and publication date await confirmation. Hero image awaits final graphic.'));
d.querySelector('style').remove();
d.head.append(el('link',''));const css=d.head.lastElementChild;css.rel='stylesheet';css.href='editorial.css';
// Copy the existing site's actual brand tokens and local logo assets into this
// standalone preview. No main-site styles or routes are edited.
const siteCss=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const tokens=[...siteCss.matchAll(/--site-(?:color-\d+|white|black):\s*[^;]+;/g)].map(m=>m[0]);
writeFileSync(new URL('./brand-tokens.css',import.meta.url),':root {\n'+[...new Set(tokens)].join('\n')+'\n}\n');
copyFileSync(new URL('../public/images/optimized/serpo-rank-official-logo-480.webp',import.meta.url),new URL('./assets/serpo-rank-logo.webp',import.meta.url));
copyFileSync(new URL('../public/images/serpo-rank-icon.png',import.meta.url),new URL('./assets/serpo-rank-icon.png',import.meta.url));
for(const file of ['brand-tokens.css','brand-theme.css']){const link=d.createElement('link');link.rel='stylesheet';link.href=file;d.head.append(link);}
const logo='<img src="assets/serpo-rank-logo.webp" alt="Serpo Rank" width="480" height="160" decoding="async">';
const wordmark=d.querySelector('.wordmark');wordmark.innerHTML=logo;wordmark.setAttribute('aria-label','Serpo Rank home');
d.querySelector('.reading-mark').innerHTML='<img src="assets/serpo-rank-icon.png" alt="" width="43" height="43">';
const footerBrand=el('div','brand-footer',`<a href="https://serporank.com/" class="wordmark" aria-label="Serpo Rank home">${logo}</a><nav aria-label="Footer navigation"><span class="brand-footer-label">EXPLORE</span><div><a href="https://serporank.com/">Home</a><a href="https://serporank.com/packages">Pricing &amp; Plans</a><a href="https://serporank.com/services/local-seo">Local SEO</a><a href="https://serporank.com/services/on-page-seo">On-Page SEO</a><a href="https://serporank.com/#book-free-audit">SEO Audit</a><a href="https://serporank.com/about">About</a><a href="https://serporank.com/contact">Contact</a></div></nav><div class="brand-footer-connect"><span class="brand-footer-label">CONNECT</span><a href="https://www.linkedin.com/in/dahya-butt-414521411" aria-label="Serpo Rank founder on LinkedIn">LinkedIn ↗</a></div>`);
d.querySelector('footer').prepend(footerBrand);
const favicon=d.createElement('link');favicon.rel='icon';favicon.href='assets/serpo-rank-icon.png';d.head.append(favicon);
const script=d.createElement('script');script.src='editorial.js';script.defer=true;d.body.append(script);
const graphics=integrateGraphics(d,el,article,hero);
// Every original paragraph, list item, cell, heading, source URL and diagram survives.
const texts=[...d.querySelectorAll('h1,h2,h3,p,li,th,td,summary')].map(n=>({tag:n.tagName,text:normalize(n.textContent)}));
const missing=inventory.filter(item=>!(item.tag==='H1' && item.text===originalTitle) && !texts.some(n=>(n.text===item.text && n.tag===item.tag) || (item.text==='Contents' && n.tag==='SUMMARY' && n.text.startsWith('Contents'))));
if(missing.length) throw new Error('Content removed: '+JSON.stringify(missing));
for(const href of sourceLinks) if(![...d.querySelectorAll('a[href]')].some(a=>a.getAttribute('href')===href))throw Error('Missing link '+href);
for(const i of sourceImages) if(![...d.images].some(n=>n.getAttribute('src')===i.src && n.alt===i.alt))throw Error('Missing diagram '+i.src);
const report={originalContentItems:inventory.length,missingContent:missing.length,originalLinks:sourceLinks.length,preservedDiagrams:sourceImages.length,h1Count:d.querySelectorAll('h1').length,sections:article.children.length,faqs:faq.querySelectorAll('details').length,readingTime,previewOnly:true,author:'Awaiting confirmation',publicationDate:'Unpublished',hero:'Supplied optimized editorial photograph',graphics};
writeFileSync(new URL('./index.html',import.meta.url),'<!doctype html>\n'+d.documentElement.outerHTML);
writeFileSync(new URL('./design-validation.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(report);
