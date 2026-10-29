import {readFileSync} from 'node:fs';

export function integrateGraphics(d,el,article,hero) {
 const assets=JSON.parse(readFileSync(new URL('./graphics-manifest.json',import.meta.url),'utf8'));
 const photoAlt='Folded towels, an amber cleaning bottle and leafy stems beside an illustrative visibility, enquiries and bookings panel';
 function image(n,alt,heroImage=false){
  const asset=assets[n], variants=asset.variants;
  const img=d.createElement('img');
  img.src=variants.find(v=>v.width===1200)?.src||variants.at(-1).src;
  img.srcset=variants.map(v=>`${v.src} ${v.width}w`).join(', ');
  img.sizes=heroImage?'(max-width: 800px) 100vw, 50vw':'(max-width: 800px) calc(100vw - 48px), (max-width: 1400px) calc(100vw - 345px), 940px';
  img.width=asset.width;img.height=asset.height;img.alt=alt;img.decoding='async';
  img.loading=heroImage?'eager':'lazy';if(heroImage)img.setAttribute('fetchpriority','high');
  return img;
 }
 const visual=hero.querySelector('.hero-visual');visual.removeAttribute('role');visual.removeAttribute('aria-label');
 visual.replaceChildren(image(1,photoAlt,true));visual.classList.add('final-hero-image');

 const descriptions={
  2:['Keyword intent mapped to awareness, consideration and hiring-ready page types','Illustrative keyword-intent mapping. Funnel stages are planning categories, not predictions of every visitor’s readiness.'],
  3:['Illustrative home-cleaning business profile with category, contact, photos, services and review checks','Illustrative profile, not an actual verified listing. The 4.9 rating, review count, business details and opening hours are fictional examples.'],
  4:['Recommended homepage structure linking service pages, genuine coverage pages and supporting information','Recommended structure. Create location pages only for areas actually served and when each page offers distinct, useful information.'],
  5:['Core Web Vitals: Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift','Good thresholds at the 75th percentile: LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds, CLS ≤ 0.1. This is guidance, not a measured test or a ranking or bookings guarantee.'],
 };
 const mobile={
  2:'<div class="intent-columns"><div><span>TOFU · AWARENESS</span><h4>Understand a need</h4><ul><li>Blog posts and guides</li><li>Preparation checklists and cleaning tips</li><li>Useful FAQs</li></ul></div><div><span>MOFU · CONSIDERATION</span><h4>Compare the options</h4><ul><li>Service comparisons</li><li>Scope, planning and pricing questions</li><li>Detailed FAQs</li></ul></div><div><span>BOFU · HIRING INTENT</span><h4>Choose a provider</h4><ul><li>Relevant service pages</li><li>Genuine service-area information</li><li>A clear quote or booking route</li></ul></div></div>',
  3:'<div class="graphic-checklist"><strong>Illustrative profile checks</strong><ul><li>Choose accurate primary and secondary categories.</li><li>Complete truthful business and contact information.</li><li>Use authorized, informative photos.</li><li>Describe the services actually offered.</li><li>Request honest reviews without incentives or sentiment filtering.</li></ul></div>',
  4:'<div class="architecture-tree"><strong>Homepage</strong><span>Introduce the business and route visitors to useful information.</span><div><h4>Service pages</h4><p>Recurring, deep and move-out cleaning where genuinely offered.</p></div><div><h4>Coverage information</h4><p>Only areas actually served; location pages need distinct value.</p></div><div><h4>Supporting pages</h4><p>About, truthful reviews, useful FAQs and quote or booking information.</p></div></div>',
  5:'<dl class="vitals-list"><div><dt>LCP <small>Largest Contentful Paint</small></dt><dd>≤ 2.5 seconds</dd></div><div><dt>INP <small>Interaction to Next Paint</small></dt><dd>≤ 200 milliseconds</dd></div><div><dt>CLS <small>Cumulative Layout Shift</small></dt><dd>≤ 0.1</dd></div></dl>',
 };
 const originals={2:'01-intent',3:'02-profile',4:'03-site',5:'04-performance'};
 for(const [number,prefix] of Object.entries(originals)){
  const original=article.querySelector(`img[src*="${prefix}"]`).closest('p');
  original.classList.add('legacy-diagram');
  const [alt,caption]=descriptions[number];const fig=el('figure','supplied-graphic graphic-'+number);
  const picture=d.createElement('picture');
  const lightweight=d.createElement('source');lightweight.media='(max-width: 800px)';lightweight.srcset='assets/mobile-graphic-placeholder.svg';picture.append(lightweight,image(number,alt));
  fig.append(picture);
  if(mobile[number])fig.append(el('div','mobile-graphic',mobile[number]));
  if(number!=='2')fig.append(el('figcaption','',caption));
  original.before(fig);
  // Specific editorial placement, rather than simply appending all images.
  if(number==='3'){
   const paragraph=[...article.querySelectorAll('#profile p')].find(p=>p.textContent.startsWith('Its description could explain'));
   paragraph.after(fig);
  }
  if(number==='4'){
   const paragraph=[...article.querySelectorAll('#architecture p')].find(p=>p.textContent.startsWith('Pricing pages are optional'));
   paragraph.after(fig);
  }
  if(number==='5'){
   const paragraph=[...article.querySelectorAll('#technical p')].find(p=>p.textContent.includes('75th percentile of visits'));
   paragraph.after(fig);
  }
 }
 // Rebuild reference 06 with all safeguards from the article, in readable HTML.
 const flow=article.querySelector('.review-flow');flow.classList.add('corrected-workflow');
 flow.querySelector('figcaption').textContent='A reliable, policy-conscious review workflow';
 const stages=[...flow.querySelectorAll('li')];
 stages[2].querySelector('span').textContent='Check communication eligibility, consent requirements, opt-outs, duplicate sends and customer-level frequency. Never filter by satisfaction.';
 stages[4].querySelector('span').textContent='A person approves any drafted reply. Protect customer privacy; log failures and assign staff to exceptions.';
 flow.append(el('p','workflow-caption','Completion must be verified. Feedback is optional, all experiences are welcome, and no rating is promised.'));
 const safeguarding=[...article.querySelectorAll('#reviews > p')].find(p=>p.textContent.startsWith('Professional assistance'));
 const placement=[...article.querySelectorAll('#reviews > p')].find(p=>p.textContent.startsWith('A native booking-system'));
 if(placement)placement.after(flow);

 // Reference 08 supplies the design, never its unsupported findings. Move each
 // original full business-specific paragraph, link and limitation into the table.
 const matrix=el('div','table-wrap audit-matrix');matrix.tabIndex=0;matrix.setAttribute('role','region');matrix.setAttribute('aria-label','Five independent public website reviews and evidence limitations');
 const table=d.createElement('table');table.setAttribute('role','table');table.innerHTML='<caption>Independent public website reviews · original article observations and limitations</caption><thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Business</th><th scope="col" role="columnheader">Public observation, recommended checks &amp; evidence limits</th></tr></thead><tbody role="rowgroup"></tbody>';
 for(const card of [...article.querySelectorAll('.public-review')]){
  const row=d.createElement('tr');row.setAttribute('role','row');const name=d.createElement('th');name.scope='row';name.setAttribute('role','rowheader');const detail=d.createElement('td');detail.setAttribute('role','cell');
  name.append(card.querySelector('h3'));detail.append(card.querySelector('p'));row.append(name,detail);table.tBodies[0].append(row);card.replaceWith(matrix);
 }
 // replaceWith moves the same matrix; put it immediately after the two original
 // introductory limitation paragraphs so reading order remains unchanged.
 article.querySelectorAll('#audits > p')[1].after(matrix);matrix.append(table);
 article.querySelector('img[src*="07-public"]').closest('p').classList.add('legacy-diagram');
 d.querySelector('.preview-note').textContent='Local design preview · Author attribution and publication date await confirmation.';
 const css=d.createElement('link');css.rel='stylesheet';css.href='graphics.css';d.head.append(css);
 return {supplied:8,rasterPlacements:5,rebuilt:[6,8],removedGraphic:7,mobileHTML:true};
}
