import { useEffect } from "react";
import articleMarkup from "@/data/seo-vs-meta-ads.html?raw";
import { Footer } from "@/components/site/pages";

export function SeoVsMetaAds() {
  useEffect(() => {
    const contents = document.querySelector<HTMLDetailsElement>(".meta-ads-guide .contents-panel");
    if (!contents) return;
    const mobile = window.matchMedia("(max-width: 800px)");
    if (mobile.matches) contents.open = false;
    const followContentsLink = (event: MouseEvent) => {
      if (mobile.matches && (event.target as Element).closest('a[href^="#"]')) {
        window.setTimeout(() => {
          contents.open = false;
        }, 0);
      }
    };
    contents.addEventListener("click", followContentsLink);
    return () => contents.removeEventListener("click", followContentsLink);
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: articleMarkup }} />
      <Footer />
    </>
  );
}
