import type { NitroAppPlugin } from "nitro/types";
import { canonicalRedirectLocation } from "../../src/data/site-paths";
import { securityHeaders, hstsValue } from "../../src/data/security-policy";

/** Wrap Nitro itself so static assets, prerenders, errors and redirects are covered. */
export default ((app) => {
  const serve = app.fetch.bind(app);
  app.fetch = async (request) => {
    const url = new URL(request.url);
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const forwardedHost =
      request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ??
      request.headers.get("host")?.split(",")[0]?.trim();
    if (forwardedProtocol) url.protocol = `${forwardedProtocol}:`;
    if (forwardedHost) url.host = forwardedHost;
    const destination = canonicalRedirectLocation(url);
    const response = destination
      ? new Response(null, { status: 301, headers: { Location: destination } })
      : await serve(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
    // Hosting.com terminates TLS before proxying to Node. Only the production
    // hostname qualifies; never send HSTS for local development hosts.
    if (
      ["serporank.com", "www.serporank.com"].includes(url.hostname) &&
      (url.protocol === "https:" ||
        request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https")
    ) {
      headers.set("Strict-Transport-Security", hstsValue);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}) satisfies NitroAppPlugin;
