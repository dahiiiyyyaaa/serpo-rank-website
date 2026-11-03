/** Keep the homepage destination and its section links consistent everywhere. */
export const homePath = '/seo-for-home-cleaning-businesses/' as const;
export const servicesHash = 'our-seo-services';
export const auditHash = 'book-free-audit';

/** Exact matches only: individual service pages retain their existing URLs. */
export function permanentDestination(input: URL): string | undefined {
  const destinations: Record<string, string> = {
    '/': homePath,
    '/seo-for-home-cleaning-businesses': homePath,
    '/services': `${homePath}#${servicesHash}`,
    '/services/': `${homePath}#${servicesHash}`,
    '/seo-audit': `${homePath}#${auditHash}`,
    '/seo-audit/': `${homePath}#${auditHash}`,
    '/services/seo-audits': `${homePath}#${auditHash}`,
    '/services/seo-audits/': `${homePath}#${auditHash}`,
    '/services/website-development': homePath,
    '/services/website-development/': homePath,
  };
  const destination = destinations[input.pathname];
  if (!destination) return undefined;
  const url = new URL(destination, input.origin);
  url.search = input.search;
  return `${url.pathname}${url.search}${url.hash}`;
}
