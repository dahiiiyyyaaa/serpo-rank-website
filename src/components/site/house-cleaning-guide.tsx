import { useEffect } from 'react';
import guideMarkup from '@/data/house-cleaning-guide.html?raw';
import { Footer } from '@/components/site/pages';

export function HouseCleaningGuide() {
  useEffect(() => {
    const contents = document.querySelector<HTMLDetailsElement>('.house-guide .contents-panel');
    if (!contents) return;
    const mobile = window.matchMedia('(max-width: 800px)');
    if (mobile.matches) contents.open = false;
    const followContentsLink = (event: MouseEvent) => {
      if (mobile.matches && (event.target as Element).closest('a[href^="#"]')) {
        window.setTimeout(() => { contents.open = false; }, 0);
      }
    };
    contents.addEventListener('click', followContentsLink);
    return () => contents.removeEventListener('click', followContentsLink);
  }, []);

  return <>
    <div dangerouslySetInnerHTML={{ __html: guideMarkup }} />
    <Footer />
  </>;
}
