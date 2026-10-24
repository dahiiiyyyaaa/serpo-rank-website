export const siteOrigin = 'https://serporarank.com';

export const seoPages = {
  home: {
    path: '/',
    title: 'Serpo Rank | SEO for Home Cleaning Businesses',
    description: 'Help your home cleaning business build a stronger online presence with Serpo Rank. Discover practical SEO services designed around your local market.',
  },
  services: {
    path: '/services',
    title: 'SEO Services For Home Cleaning Businesses That Help You Rank | Serpo Rank',
    description: 'Explore SEO services designed to improve your website’s performance, visibility, and qualified organic traffic.',
  },
  pricing: {
    path: '/packages',
    title: 'SEO Service Pricing | Serpo Rank',
    description: 'Review Serpo Rank’s SEO pricing and find a service plan suited to your website, goals, and growth stage.',
  },
  about: {
    path: '/about',
    title: 'About Serpo Rank | SEO Specialists',
    description: 'Learn about Serpo Rank and our approach to helping businesses improve search visibility through practical SEO.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Serpo Rank | Discuss Your SEO Goals',
    description: 'Contact Serpo Rank to discuss your SEO, web development, or optimisation needs and the next steps for your project.',
  },
  technicalSeo: {
    path: '/services/technical-seo',
    title: 'Technical SEO Services | Serpo Rank',
    description: 'Improve crawlability, indexing, site structure, and technical performance with technical SEO services from Serpo Rank.',
  },
  localSeo: {
    path: '/services/local-seo',
    title: 'Local SEO Services For Home Cleaning Businesses | Serpo Rank',
    description: 'Reach more nearby customers with local SEO focused on local search visibility, business listings, and location relevance.',
  },
  onPageSeo: {
    path: '/services/on-page-seo',
    title: 'On-Page SEO Services For Home Cleaning Businesses | Serpo Rank',
    description: 'Strengthen your pages with on-page SEO that improves content relevance, page structure, and search visibility.',
  },
  websiteDevelopment: {
    path: '/services/website-development',
    title: 'Website Development & Optimization For Home Cleaning Businesses | Serpo Rank',
    description: 'Build and improve a fast, search-friendly website with web development and optimisation services from Serpo Rank.',
  },
  offPageSeo: {
    path: '/services/off-page-seo',
    title: 'Off-Page SEO Services For Home Cleaning Businesses | Serpo Rank',
    description: 'Build your website’s authority and reputation with off-page SEO focused on quality backlinks and broader search presence.',
  },
} as const;

export function seoHead(page: (typeof seoPages)[keyof typeof seoPages]) {
  const canonical = `${siteOrigin}${page.path}`;
  return {
    meta: [
      { title: page.title },
      { name: 'description', content: page.description },
      { property: 'og:title', content: page.title },
      { property: 'og:description', content: page.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  };
}
