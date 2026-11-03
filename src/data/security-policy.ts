/** Report-only until browser and integration checks have passed in production. */
export const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: https://assets.calendly.com",
  "font-src 'self' data:",
  "connect-src 'self' https://formspree.io https://calendly.com https://assets.calendly.com",
  "frame-src https://calendly.com",
  "form-action 'self' https://formspree.io",
].join('; ');

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Content-Security-Policy-Report-Only': contentSecurityPolicy,
};

// Start with five minutes; extend only after HTTPS and live-host validation.
export const hstsValue = 'max-age=300';
