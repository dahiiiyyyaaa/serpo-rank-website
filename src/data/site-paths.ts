/** Keep the homepage destination and its section links consistent everywhere. */
export const homePath = "/seo-for-home-cleaning-businesses/" as const;
export const servicesHash = "our-seo-services";
export const auditHash = "book-free-audit";
export const canonicalOrigin = "https://serporank.com" as const;

const canonicalSlashlessPaths = new Set([
  "/about",
  "/blog",
  "/blog/house-cleaning-seo-guide",
  "/blog/seo-vs-meta-ads",
  "/contact",
  "/packages",
  "/services/local-seo",
  "/services/off-page-seo",
  "/services/on-page-seo",
  "/services/technical-seo",
]);

/** Exact matches only: individual service pages retain their existing URLs. */
export function permanentDestination(input: URL): string | undefined {
  const destinations: Record<string, string> = {
    "/": homePath,
    "/seo-for-home-cleaning-businesses": homePath,
    "/services": `${homePath}#${servicesHash}`,
    "/services/": `${homePath}#${servicesHash}`,
    "/seo-audit": `${homePath}#${auditHash}`,
    "/seo-audit/": `${homePath}#${auditHash}`,
    "/services/seo-audits": `${homePath}#${auditHash}`,
    "/services/seo-audits/": `${homePath}#${auditHash}`,
    "/services/website-development": homePath,
    "/services/website-development/": homePath,
    "/pricing": "/packages",
    "/pricing/": "/packages",
  };
  const destination = destinations[input.pathname];
  if (!destination) return undefined;
  const url = new URL(destination, input.origin);
  url.search = input.search;
  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Return one permanent redirect for legacy paths, duplicate production hosts,
 * HTTP requests, and non-canonical trailing-slash variants.
 */
export function canonicalRedirectLocation(input: URL): string | undefined {
  const legacyDestination = permanentDestination(input);
  const productionHost =
    input.hostname === "serporank.com" || input.hostname === "www.serporank.com";
  const duplicateOrigin =
    productionHost && (input.protocol !== "https:" || input.hostname !== "serporank.com");
  const slashlessPath =
    input.pathname.length > 1 && input.pathname.endsWith("/")
      ? input.pathname.slice(0, -1)
      : input.pathname;
  const duplicateSlash = canonicalSlashlessPaths.has(slashlessPath) && input.pathname.endsWith("/");

  if (!legacyDestination && !duplicateOrigin && !duplicateSlash) return undefined;

  const destination = legacyDestination ?? `${slashlessPath}${input.search}`;
  if (!productionHost) return destination;
  return new URL(destination, canonicalOrigin).href;
}
