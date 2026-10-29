const panel = document.querySelector('.contents-panel');
const phone = window.matchMedia('(max-width: 800px)');
const setContents = () => { panel.open = !phone.matches; };
setContents();
phone.addEventListener('change', setContents);
const links = [...panel.querySelectorAll('a[href^="#"]')];
links.forEach(link => link.addEventListener('click', () => {
  // Let the anchor's default navigation finish before hiding its contents.
  if (phone.matches) setTimeout(() => { panel.open = false; }, 0);
}));
const sections = [...document.querySelectorAll('.article-section[id]')];
let queued = false;
function highlight() {
  const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 150) || sections[0];
  links.forEach(link => { if(link.hash === '#' + current.id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
  queued = false;
}
window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(highlight); } }, { passive: true });
highlight();
