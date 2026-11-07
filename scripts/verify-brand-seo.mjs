import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, '.output/public');
const origin = 'https://serporank.com';
const home = '/seo-for-home-cleaning-businesses/';
const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const pages = new Map();
const links = new Map();

for (const path of paths) {
  const file = join(output, path.slice(1), 'index.html');
  assert.ok(existsSync(file), `${path}: missing prerendered HTML`);
  const dom = new JSDOM(readFileSync(file, 'utf8'), { url: origin + path });
  const document = dom.window.document;
  const canonical = origin + path;
  assert.equal(document.querySelector('link[rel="canonical"]')?.href, canonical, `${path}: canonical`);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1, `${path}: duplicate canonical`);
  assert.equal(document.querySelectorAll('main h1').length, 1, `${path}: H1`);
  assert.equal(document.querySelector('meta[property="og:site_name"]')?.content, 'Serpo Rank', `${path}: social brand`);

  const faviconLinks = [...document.querySelectorAll('link[rel="icon"]')];
  assert.deepEqual(faviconLinks.map((link) => link.getAttribute('href')), ['/favicon.ico', '/favicon.png'], `${path}: favicon declarations`);
  for (const link of faviconLinks) assert.ok(existsSync(join(output, link.getAttribute('href').slice(1))), `${path}: missing favicon file`);

  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  assert.equal(scripts.length, 1, `${path}: duplicate structured data`);
  const graph = JSON.parse(scripts[0].textContent)['@graph'];
  for (const type of ['Organization', 'WebSite']) {
    assert.equal(graph.filter((node) => node['@type'] === type).length, 1, `${path}: duplicate ${type}`);
  }
  const organization = graph.find((node) => node['@type'] === 'Organization');
  const website = graph.find((node) => node['@type'] === 'WebSite');
  assert.equal(organization.name, 'Serpo Rank');
  assert.equal(organization.url, origin + home);
  assert.equal(organization['@id'], origin + '/#organization');
  assert.equal(website.name, 'Serpo Rank');
  assert.ok(website.description, `${path}: missing WebSite description`);
  assert.equal(website.publisher['@id'], organization['@id']);
  assert.equal(website.url, origin + home);
  const logo = graph.find((node) => node['@id'] === organization.logo['@id']);
  assert.ok(logo && existsSync(join(output, new URL(logo.contentUrl).pathname.slice(1))), `${path}: missing logo`);

  const outgoing = new Set();
  for (const anchor of document.querySelectorAll('a[href]')) {
    const href = new URL(anchor.getAttribute('href'), canonical);
    if (href.origin !== origin) continue;
    assert.ok(paths.includes(href.pathname), `${path}: internal link to missing or noncanonical page ${href.href}`);
    outgoing.add(href.pathname);
    if (href.hash && pages.has(href.pathname)) {
      assert.ok(pages.get(href.pathname).getElementById(decodeURIComponent(href.hash.slice(1))), `${path}: missing section ${href.href}`);
    }
  }
  pages.set(path, document);
  links.set(path, outgoing);
}

for (const [path, document] of pages) {
  for (const destination of links.get(path)) {
    const target = pages.get(destination);
    assert.ok(target, `${path}: missing target ${destination}`);
    for (const anchor of document.querySelectorAll('a[href]')) {
      const href = new URL(anchor.getAttribute('href'), origin + path);
      if (href.pathname === destination && href.hash) {
        assert.ok(target.getElementById(decodeURIComponent(href.hash.slice(1))), `${path}: missing section ${href.href}`);
      }
    }
  }
}

const discovered = new Set([home]);
const queue = [home];
for (const current of queue) {
  for (const target of links.get(current) ?? []) {
    if (!discovered.has(target)) {
      discovered.add(target);
      queue.push(target);
    }
  }
}
assert.deepEqual([...paths].sort(), [...discovered].sort(), 'Sitemap contains an orphan page');

const icon = readFileSync(join(output, 'favicon.ico'));
const png = readFileSync(join(output, 'favicon.png'));
assert.equal(icon.readUInt16LE(2), 1, 'Invalid ICO image type');
assert.equal(icon.readUInt16LE(4), 1, 'Invalid ICO image count');
assert.equal(icon.readUInt32LE(14), png.length, 'ICO image size mismatch');
assert.ok(icon.subarray(22).equals(png), 'ICO and PNG display different symbols');
assert.equal(png.readUInt32BE(16), 192);
assert.equal(png.readUInt32BE(20), 192);

const robots = readFileSync(join(output, 'robots.txt'), 'utf8');
assert.match(robots, /User-agent: Googlebot[\s\S]*?Allow: \//);
assert.match(robots, /User-agent: \*[\s\S]*?Allow: \//);
console.log(`PASS ${paths.length} sitemap pages: canonical links, schema, favicons, internal links and discoverability`);
