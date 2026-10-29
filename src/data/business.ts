/** Public business facts checked against the site on 2026-10-27. */
export const siteOrigin = 'https://serporank.com';

export const business = {
  name: 'Serpo Rank',
  alternateName: 'SerpoRank',
  description: 'Serpo Rank provides SEO services for home cleaning businesses, including local SEO, technical SEO, on-page SEO, and off-page SEO.',
  language: 'en',
  email: 'dahiyabutt28@gmail.com',
  // Worldwide coverage is stated in the homepage's Where We Work section.
  // It describes the market served, not an agency office or postal address.
  areaServed: 'Worldwide',
  audience: 'Owners and decision-makers at home cleaning businesses',
  logo: {
    path: '/images/serpo-rank-official-logo.png',
    width: 2172,
    height: 724,
  },
  founder: {
    // Use the name published on /about; do not infer a legal name from a URL.
    name: 'Dahya',
    image: '/images/dahya-founder.jpeg',
  },
} as const;
