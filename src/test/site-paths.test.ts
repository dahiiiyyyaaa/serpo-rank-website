import { describe, expect, it } from "vitest";
import { canonicalRedirectLocation } from "@/data/site-paths";

describe("canonicalRedirectLocation", () => {
  it.each([
    ["http://serporank.com/", "https://serporank.com/seo-for-home-cleaning-businesses/"],
    ["https://www.serporank.com/", "https://serporank.com/seo-for-home-cleaning-businesses/"],
    ["https://www.serporank.com/packages", "https://serporank.com/packages"],
    ["http://serporank.com/about", "https://serporank.com/about"],
    [
      "http://serporank.com/blog/house-cleaning-seo-guide",
      "https://serporank.com/blog/house-cleaning-seo-guide",
    ],
    [
      "https://serporank.com/services",
      "https://serporank.com/seo-for-home-cleaning-businesses/#our-seo-services",
    ],
    [
      "https://serporank.com/seo-audit",
      "https://serporank.com/seo-for-home-cleaning-businesses/#book-free-audit",
    ],
    ["https://serporank.com/pricing", "https://serporank.com/packages"],
    ["https://serporank.com/blog/", "https://serporank.com/blog"],
  ])("redirects %s to %s", (input, expected) => {
    expect(canonicalRedirectLocation(new URL(input))).toBe(expected);
  });

  it("preserves contact query parameters while normalizing the origin", () => {
    expect(
      canonicalRedirectLocation(
        new URL("http://www.serporank.com/contact?service=packages&plan=growth"),
      ),
    ).toBe("https://serporank.com/contact?service=packages&plan=growth");
  });

  it.each([
    "https://serporank.com/seo-for-home-cleaning-businesses/",
    "https://serporank.com/packages",
    "https://serporank.com/contact?service=packages&plan=foundation",
    "http://localhost:8080/about",
  ])("does not redirect canonical or local requests: %s", (input) => {
    expect(canonicalRedirectLocation(new URL(input))).toBeUndefined();
  });
});
