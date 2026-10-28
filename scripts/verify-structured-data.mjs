import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

// Check the actual prerendered documents, not only the graph-building functions.
// Run after `npm run build`; --examples exports the two requested script blocks.
const root = fileURLToPath(new URL('../', import.meta.url));
const publicDirectory = join(root, '.output', 'public');
const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8');
const canonicals = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const pages = canonicals.map((canonical) => ({ path: new URL(canonical).pathname, canonical }));
pages.push({ path: '/services', canonical: 'https://serporank.com/' });
const examples = new Map();

function referenceIds(value) {
  if (Array.isArray(value)) return value.flatMap(referenceIds);
  if (!value || typeof value !== 'object') return [];
  if (Object.keys(value).length === 1 && typeof value['@id'] === 'string') return [value['@id']];
  return Object.values(value).flatMap(referenceIds);
}

for (const { path, canonical } of pages) {
  const htmlPath = join(publicDirectory, path === '/' ? '' : path.slice(1), 'index.html');
  const dom = new JSDOM(readFileSync(htmlPath, 'utf8'));
  const document = dom.window.document;
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  assert.equal(scripts.length, 1, `${path}: expected one JSON-LD script`);
  assert.equal(scripts[0].parentElement.tagName, 'HEAD', `${path}: schema must be in SSR head`);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1, `${path}: duplicate canonicals`);
  assert.equal(document.querySelector('link[rel="canonical"]').href, canonical);
  assert.ok(document.querySelector('main h1')?.textContent.trim(), `${path}: missing server-rendered content`);

  const data = JSON.parse(scripts[0].textContent);
  assert.equal(data['@context'], 'https://schema.org');
  const ids = new Set(data['@graph'].map((node) => node['@id']));
  assert.equal(ids.size, data['@graph'].length, `${path}: duplicate entity IDs`);
  for (const id of referenceIds(data)) assert.ok(ids.has(id), `${path}: unresolved reference ${id}`);
  const webpage = data['@graph'].find((node) => node['@id'] === `${canonical}#webpage`);
  assert.equal(webpage?.url, canonical, `${path}: schema/canonical disagreement`);
  assert.equal(webpage.name, document.title, `${path}: schema/title disagreement`);
  assert.equal(webpage.description, document.querySelector('meta[name="description"]').content);
  assert.equal(data['@graph'].filter((node) => node['@type'] === 'Organization').length, 1);
  assert.equal(data['@graph'].find((node) => node['@type'] === 'Organization')['@id'], 'https://serporank.com/#organization');
  for (const node of data['@graph']) {
    if (node['@type'] === 'ImageObject') {
      assert.ok(existsSync(join(publicDirectory, new URL(node.contentUrl).pathname.slice(1))), `${path}: missing logo asset`);
    }
    if (node['@type'] === 'BreadcrumbList') {
      assert.equal(node.itemListElement.length, 2);
      assert.equal(node.itemListElement.at(-1).item, canonical);
      assert.deepEqual(node.itemListElement.map((item) => item.position), [1, 2]);
    }
  }
  if (path === '/') examples.set('homepage', scripts[0].outerHTML);
  if (path === '/services/local-seo') examples.set('local-seo', scripts[0].outerHTML);
  console.log(`PASS ${path}: one graph, ${ids.size} connected entities, canonical and SSR content verified`);
  dom.window.close();
}

if (process.argv.includes('--examples')) {
  for (const [name, block] of examples) {
    const output = join(root, 'docs', 'json-ld', `${name}.html`);
    mkdirSync(dirname(output), { recursive: true });
    const data = JSON.parse(block.slice(block.indexOf('>') + 1, block.lastIndexOf('</script>')));
    const prettyJson = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
    writeFileSync(output, `<!-- Generated from the production build. Reference only: the route head already emits this block. -->\n<script type="application/ld+json">\n${prettyJson}\n</script>\n`);
    console.log(`Exported docs/json-ld/${name}.html`);
  }
}
