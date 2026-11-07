import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = 'https://serporank.com';
const xml = readFileSync(join(root, 'public/sitemap.xml'), 'utf8');
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const pages = paths.map((path) => {
  const html = readFileSync(join(root, '.output/public', path.slice(1), 'index.html'), 'utf8');
  const document = new JSDOM(html, { url: site + path }).window.document;
  const main = document.querySelector('main');
  const text = main?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const shingles = new Set(tokens.slice(0, -4).map((_, i) => tokens.slice(i, i + 5).join(' ')));
  const internalTargets = [...document.querySelectorAll('a[href]')]
    .map((anchor) => new URL(anchor.getAttribute('href'), site + path))
    .filter((url) => url.origin === site)
    .map((url) => url.pathname);
  const mainInternalLinks = [...main?.querySelectorAll('a[href]') ?? []]
    .map((anchor) => ({
      url: new URL(anchor.getAttribute('href'), site + path),
      text: anchor.textContent.replace(/\s+/g, ' ').trim() || anchor.getAttribute('aria-label') || '',
    }))
    .filter(({ url }) => url.origin === site)
    .map(({ url, text }) => ({ target: url.pathname + url.hash, text }));
  return {
    path,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? '',
    h1: [...main?.querySelectorAll('h1') ?? []].map((node) => node.textContent.replace(/\s+/g, ' ').trim()),
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
    robots: document.querySelector('meta[name="robots"]')?.content ?? '',
    wordCount: tokens.length,
    h2: [...main?.querySelectorAll('h2') ?? []].map((node) => node.textContent.replace(/\s+/g, ' ').trim()),
    internalTargets: [...new Set(internalTargets)].sort(),
    mainInternalLinks,
    text,
    shingles,
  };
});

function duplicates(key) {
  const groups = Map.groupBy(pages, (page) => JSON.stringify(page[key]));
  return [...groups.values()].filter((group) => group.length > 1).map((group) => group.map((page) => page.path));
}

const similarPairs = [];
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const a = pages[i].shingles;
    const b = pages[j].shingles;
    const shared = [...a].filter((shingle) => b.has(shingle)).length;
    const union = a.size + b.size - shared;
    similarPairs.push({
      urls: [pages[i].path, pages[j].path],
      fiveWordJaccard: +(union ? shared / union : 0).toFixed(3),
      shorterPageContainment: +(Math.min(a.size, b.size) ? shared / Math.min(a.size, b.size) : 0).toFixed(3),
      sharedShingles: shared,
    });
  }
}

console.log(JSON.stringify({
  crawledPages: pages.length,
  duplicateTitles: duplicates('title'),
  duplicateH1: duplicates('h1'),
  exactDuplicateMainContent: duplicates('text'),
  mostSimilarPairs: similarPairs.sort((a, b) => b.fiveWordJaccard - a.fiveWordJaccard).slice(0, 12),
  pages: pages.map(({ text, shingles, ...page }) => page),
}, null, 2));
