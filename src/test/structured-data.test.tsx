import { act, render, waitFor } from '@testing-library/react';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, HeadContent, Outlet, RouterProvider } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { business, siteOrigin } from '@/data/business';
import { seoHead, seoPages } from '@/data/seo';
import { buildStructuredData, entityIds, serializeJsonLd } from '@/data/structured-data';

const pages = [seoPages.home, seoPages.services, seoPages.localSeo, seoPages.technicalSeo,
  seoPages.onPageSeo, seoPages.offPageSeo, seoPages.about, seoPages.contact, seoPages.pricing];

function collectReferences(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectReferences);
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  if (Object.keys(record).length === 1 && typeof record['@id'] === 'string') return [record['@id']];
  return Object.values(record).flatMap(collectReferences);
}

describe('Structured data', () => {
  it.each(pages)('uses one connected graph matching the canonical for $path', (page) => {
    const head = seoHead(page);
    expect(head.scripts).toHaveLength(1);
    const data = JSON.parse(head.scripts[0]!.children) as ReturnType<typeof buildStructuredData>;
    const canonical = head.links[0]!.href;
    const ids = data['@graph'].map((node) => node['@id']);
    expect(new Set(ids).size).toBe(ids.length);
    expect(data['@graph'].find((node) => node['@id'] === `${canonical}#webpage`)).toMatchObject({
      url: canonical, name: page.title, description: page.description,
      isPartOf: { '@id': entityIds.website },
    });
    for (const id of collectReferences(data)) expect(ids, `Unresolved entity: ${id}`).toContain(id);
    expect(data['@graph'].filter((node) => node['@type'] === 'Organization')).toHaveLength(1);
  });

  it('gives the old services index the same canonical entities as the homepage', () => {
    expect(buildStructuredData(seoPages.services)).toEqual(buildStructuredData(seoPages.home));
  });

  it.each([seoPages.localSeo, seoPages.technicalSeo, seoPages.onPageSeo, seoPages.offPageSeo])(
    'identifies the agency as provider and cleaning businesses as audience at $path', (page) => {
      const graph = buildStructuredData(page)['@graph'];
      expect(graph.find((node) => node['@type'] === 'Service')).toMatchObject({
        '@id': `${siteOrigin}${page.path}#service`,
        provider: { '@id': entityIds.organization },
        audience: { '@id': entityIds.audience },
        mainEntityOfPage: { '@id': `${siteOrigin}${page.path}#webpage` },
      });
      expect(graph.find((node) => node['@type'] === 'BusinessAudience')).toMatchObject({
        audienceType: business.audience,
      });
    },
  );

  it('models the founder and contact page without inventing location or offer claims', () => {
    expect(buildStructuredData(seoPages.about)['@graph'].find((node) => node['@type'] === 'AboutPage'))
      .toMatchObject({ mainEntity: { '@id': entityIds.founder } });
    expect(buildStructuredData(seoPages.contact)['@graph'].find((node) => node['@type'] === 'ContactPage'))
      .toMatchObject({ mainEntity: { '@id': entityIds.organization } });
    for (const page of pages) {
      const graph = buildStructuredData(page)['@graph'];
      expect(graph.some((node) => ['LocalBusiness', 'Product', 'Offer', 'FAQPage', 'HowTo', 'AggregateRating', 'Article'].includes(node['@type']))).toBe(false);
      expect(JSON.stringify(graph)).not.toMatch(/"(?:address|geo|telephone|sameAs|datePublished|dateModified)":/);
    }
  });

  it('preserves JSON values while preventing script-tag breakout', () => {
    const value = { description: '</script><script>alert("x")</script> & \u2028\u2029' };
    const serialized = serializeJsonLd(value);
    expect(serialized).not.toMatch(/[<>&\u2028\u2029]/);
    expect(JSON.parse(serialized)).toEqual(value);
    expect(() => serializeJsonLd(undefined)).toThrow(TypeError);
  });

  it('replaces the route graph during client navigation instead of accumulating scripts', async () => {
    const root = createRootRoute({ component: () => <><HeadContent /><Outlet /></> });
    const routes = [seoPages.home, seoPages.localSeo, seoPages.about, seoPages.contact].map((page) =>
      createRoute({ getParentRoute: () => root, path: page.path, head: () => seoHead(page), component: () => <p>Page content</p> }),
    );
    const router = createRouter({
      routeTree: root.addChildren(routes),
      history: createMemoryHistory({ initialEntries: ['/'] }),
    });
    const view = render(<RouterProvider router={router} />);
    try {
      for (const page of [seoPages.home, seoPages.localSeo, seoPages.about, seoPages.contact, seoPages.home]) {
        await act(async () => { await router.navigate({ to: page.path }); });
        await waitFor(() => {
          const scripts = document.querySelectorAll('script[type="application/ld+json"]');
          expect(scripts).toHaveLength(1);
          const data = JSON.parse(scripts[0]!.textContent!);
          expect(data['@graph']).toEqual(buildStructuredData(page)['@graph']);
        });
      }
    } finally {
      view.unmount();
    }
  });
});
