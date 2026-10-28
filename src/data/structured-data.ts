import { business, siteOrigin } from './business';

type PageMetadata = {
  path: string;
  canonicalPath?: string;
  title: string;
  description: string;
};

export type SchemaNode = {
  '@type': string;
  '@id': string;
  [property: string]: unknown;
};

export type StructuredDataGraph = {
  '@context': 'https://schema.org';
  '@graph': SchemaNode[];
};

export const entityIds = {
  organization: `${siteOrigin}/#organization`,
  website: `${siteOrigin}/#website`,
  logo: `${siteOrigin}/#logo`,
  contact: `${siteOrigin}/#contact`,
  audience: `${siteOrigin}/#cleaning-business-audience`,
  founder: `${siteOrigin}/about#founder`,
} as const;

// Only live service pages belong here. GBP management is part of local SEO;
// removed/redirected website-development and audit URLs are not new pages.
const serviceDetails: Record<string, { name: string; serviceType: string; description: string }> = {
  '/': {
    name: 'SEO for Home Cleaning Businesses',
    serviceType: 'Search engine optimization',
    description: business.description,
  },
  '/services/local-seo': {
    name: 'Local SEO for Home Cleaning Businesses',
    serviceType: 'Local SEO',
    description: 'Google Business Profile setup and management, local website pages, and review-process guidance for home cleaning businesses.',
  },
  '/services/technical-seo': {
    name: 'Technical SEO for Home Cleaning Businesses',
    serviceType: 'Technical SEO',
    description: 'Identify and address website issues affecting crawling, indexing, site structure, performance, and user experience for home cleaning businesses.',
  },
  '/services/on-page-seo': {
    name: 'On-Page SEO for Home Cleaning Businesses',
    serviceType: 'On-page SEO',
    description: 'Improve keyword targeting, page titles, headings, service content, and internal links on home cleaning business websites.',
  },
  '/services/off-page-seo': {
    name: 'Off-Page SEO for Home Cleaning Businesses',
    serviceType: 'Off-page SEO',
    description: 'Strengthen home cleaning businesses’ online presence through relevant links, credible mentions, local citations, and outreach.',
  },
};

const pageLabels: Record<string, string> = {
  '/packages': 'Pricing & Plans',
  '/about': 'About',
  '/contact': 'Contact',
};

const reference = (id: string) => ({ '@id': id });

export function canonicalUrl(page: PageMetadata): string {
  return `${siteOrigin}${page.canonicalPath ?? page.path}`;
}

export function buildStructuredData(page: PageMetadata): StructuredDataGraph {
  const path = page.canonicalPath ?? page.path;
  const url = canonicalUrl(page);
  const webpageId = `${url}#webpage`;
  const service = serviceDetails[path];
  const includeFounder = path === '/' || path === '/about';

  const organization: SchemaNode = {
    '@type': 'Organization',
    '@id': entityIds.organization,
    name: business.name,
    alternateName: business.alternateName,
    url: `${siteOrigin}/`,
    description: business.description,
    logo: reference(entityIds.logo),
    email: business.email,
    contactPoint: reference(entityIds.contact),
    ...(includeFounder ? { founder: reference(entityIds.founder) } : {}),
  };

  const webpage: SchemaNode = {
    '@type': path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : 'WebPage',
    '@id': webpageId,
    url,
    name: page.title,
    description: page.description,
    inLanguage: business.language,
    isPartOf: reference(entityIds.website),
    about: reference(entityIds.organization),
    ...(service ? { mainEntity: reference(`${url}#service`) } : {}),
  };

  const graph: SchemaNode[] = [
    organization,
    {
      '@type': 'WebSite',
      '@id': entityIds.website,
      url: `${siteOrigin}/`,
      name: business.name,
      alternateName: business.alternateName,
      inLanguage: business.language,
      publisher: reference(entityIds.organization),
    },
    {
      '@type': 'ImageObject',
      '@id': entityIds.logo,
      url: `${siteOrigin}${business.logo.path}`,
      contentUrl: `${siteOrigin}${business.logo.path}`,
      caption: `${business.name} logo`,
      width: business.logo.width,
      height: business.logo.height,
    },
    {
      '@type': 'ContactPoint',
      '@id': entityIds.contact,
      contactType: 'SEO enquiries',
      email: business.email,
      url: `${siteOrigin}/contact`,
    },
    webpage,
  ];

  if (service) {
    graph.push({
      '@type': 'BusinessAudience',
      '@id': entityIds.audience,
      audienceType: business.audience,
    }, {
      '@type': 'Service',
      '@id': `${url}#service`,
      ...service,
      url,
      provider: reference(entityIds.organization),
      audience: reference(entityIds.audience),
      areaServed: business.areaServed,
      mainEntityOfPage: reference(webpageId),
    });
  }

  if (includeFounder) {
    graph.push({
      '@type': 'Person',
      '@id': entityIds.founder,
      name: business.founder.name,
      jobTitle: 'Founder of Serpo Rank',
      url: `${siteOrigin}/about`,
      image: `${siteOrigin}${business.founder.image}`,
      worksFor: reference(entityIds.organization),
    });
    if (path === '/about') webpage['mainEntity'] = reference(entityIds.founder);
  }

  if (path === '/contact') webpage['mainEntity'] = reference(entityIds.organization);

  // Follow the real Home → page journey. /services is a homepage alias,
  // so it must not become a competing entity or artificial breadcrumb level.
  const label = service?.serviceType ?? pageLabels[path];
  if (path !== '/' && label) {
    webpage['breadcrumb'] = reference(`${url}#breadcrumb`);
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteOrigin}/` },
        { '@type': 'ListItem', position: 2, name: label, item: url },
      ],
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Escape HTML-significant characters before embedding JSON in a script tag. */
export function serializeJsonLd(value: unknown): string {
  const json = JSON.stringify(value);
  if (json === undefined) throw new TypeError('JSON-LD must be JSON-serializable');
  const escapes: Record<string, string> = {
    '<': '\\u003c',
    '>': '\\u003e',
    '&': '\\u0026',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029',
  };
  return json.replace(/[<>&\u2028\u2029]/g, (character) => escapes[character]!);
}
