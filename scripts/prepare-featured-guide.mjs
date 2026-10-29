import { readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const preview = new URL('../local-guide-preview/', import.meta.url);
const article = new JSDOM(readFileSync(new URL('index.html', preview), 'utf8'));
const main = article.window.document.querySelector('main');
main.className = 'house-guide';
main.querySelectorAll('.legacy-diagram,.original-funnel,.original-workflow').forEach(node => node.remove());
for (const element of main.querySelectorAll('[src],[srcset],[href]')) {
  for (const attribute of ['src', 'srcset']) {
    const value = element.getAttribute(attribute);
    if (value) element.setAttribute(attribute, value.replaceAll('assets/', '/images/blog/'));
  }
  const href = element.getAttribute('href');
  if (href?.startsWith('https://serporank.com/')) {
    const url = new URL(href);
    element.setAttribute('href', url.pathname + url.search + url.hash);
  }
}
const dataDir = new URL('../src/data/', import.meta.url);
writeFileSync(new URL('house-cleaning-guide.html', dataDir), main.outerHTML + '\n');

const outputAssets = new URL('../public/images/blog/', import.meta.url);
mkdirSync(outputAssets, {recursive:true});
const inputAssets = new URL('assets/', preview);
for (const name of readdirSync(inputAssets)) {
  if (/^(sunlit-towels-and-botanical-cleaning-vignette|keyword-intent-mapped-to-content-types|home-cleaning-profile-optimization-guide|recommended-website-structure-diagram|understanding-core-web-vitals)-\d+\.webp$/.test(name) || name === 'mobile-graphic-placeholder.svg' || name === 'serpo-rank-icon.png') {
    copyFileSync(new URL(name, inputAssets), new URL(name, outputAssets));
  }
}
const files = ['editorial.css', 'brand-theme.css', 'graphics.css'];
const css = `.house-guide{--ink:var(--site-color-1);--muted:var(--site-color-3);--paper:var(--site-color-11);--line:var(--site-color-9);--accent:var(--site-color-12);--sans:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;--serif:var(--sans);font:17px/1.75 var(--sans);color:var(--site-color-1);background:var(--site-white);min-width:0}\n@scope (.house-guide) {\n${files.map(file => readFileSync(new URL(file, preview), 'utf8')).join('\n')}\n}\n`;
writeFileSync(new URL('../src/components/site/house-cleaning-guide.css', import.meta.url), css);
console.log(`Prepared guide: ${main.querySelectorAll('section.article-section').length} sections, ${main.querySelectorAll('h1').length} H1, ${main.querySelectorAll('img').length} images`);
