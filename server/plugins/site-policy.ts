import type { NitroAppPlugin } from 'nitro/types';
import { permanentDestination } from '../../src/data/site-paths';
import { securityHeaders, hstsValue } from '../../src/data/security-policy';

/** Wrap Nitro itself so static assets, prerenders, errors and redirects are covered. */
export default ((app) => {
  const serve = app.fetch.bind(app);
  app.fetch = async (request) => {
    const url = new URL(request.url);
    const destination = permanentDestination(url);
    const response = destination
      ? new Response(null, { status: 301, headers: { Location: destination } })
      : await serve(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
    // Hosting.com terminates TLS before proxying to Node. Only the production
    // hostname qualifies; never send HSTS for local development hosts.
    if (['serporank.com', 'www.serporank.com'].includes(url.hostname) &&
        (url.protocol === 'https:' || request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() === 'https')) {
      headers.set('Strict-Transport-Security', hstsValue);
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  };
}) satisfies NitroAppPlugin;
