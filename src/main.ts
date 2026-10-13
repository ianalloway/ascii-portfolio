import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import './style.css';
import { initScene, type ModelKey } from './scene';
import { initLab } from './lab';
import { initTerminal } from './terminal';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

// ASCII hero
const status = document.querySelector<HTMLElement>('#status')!;
const ascii = initScene(document.querySelector<HTMLCanvasElement>('#ascii')!, (text) => (status.textContent = text));
if (!ascii) {
  document.body.classList.add('no-webgl');
  status.textContent = 'webgl unavailable · static mode';
}

// The canvas only runs while the hero or the work list is on screen.
const zones = new Map<string, boolean>();
const zoneObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) zones.set(entry.target.id, entry.isIntersecting);
    const zone = zones.get('top') ? 'hero' : zones.get('work') ? 'work' : 'off';
    document.body.dataset.zone = zone;
    ascii?.setActive(zone !== 'off');
    if (zone !== 'off') ascii?.setSide(zone);
    if (zone === 'hero') ascii?.swap('monogram');
  },
  { rootMargin: '-35% 0px -35% 0px' },
);
for (const id of ['top', 'work']) zoneObserver.observe(document.getElementById(id)!);

// Work rows swap the model in the ASCII stage.
document.querySelectorAll<HTMLAnchorElement>('[data-model]').forEach((row) => {
  const show = () => ascii?.swap(row.dataset.model as ModelKey);
  row.addEventListener('pointerenter', show);
  row.addEventListener('focus', show);
});

// Entrances: once, staggered within each section.
const revealObserver = new IntersectionObserver(
  (entries) => {
    const entering = entries.filter((entry) => entry.isIntersecting);
    entering.forEach((entry, i) => {
      const el = entry.target as HTMLElement;
      el.style.setProperty('--delay', `${i * 70}ms`);
      el.classList.add('in');
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// About: typed out at 18ms per character, with space reserved so nothing shifts.
const typed = document.querySelector<HTMLElement>('#typed')!;
const skip = document.querySelector<HTMLButtonElement>('#skip')!;
const copy = typed.textContent!.replace(/\s+/g, ' ').trim();
if (!reduced) {
  typed.setAttribute('aria-label', copy);
  const done = document.createElement('span');
  const caret = document.createElement('span');
  const rest = document.createElement('span');
  caret.className = 'caret';
  rest.className = 'rest';
  rest.textContent = copy;
  for (const span of [done, caret, rest]) span.setAttribute('aria-hidden', 'true');
  typed.replaceChildren(done, caret, rest);

  let timer = 0;
  let count = 0;
  const finish = () => {
    clearInterval(timer);
    typed.textContent = copy;
    skip.hidden = true;
  };
  const typeObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      typeObserver.disconnect();
      skip.hidden = false;
      timer = window.setInterval(() => {
        count++;
        done.textContent = copy.slice(0, count);
        rest.textContent = copy.slice(count);
        if (count >= copy.length) finish();
      }, 18);
    },
    { threshold: 0.6 },
  );
  typeObserver.observe(typed);
  skip.addEventListener('click', finish);
}

// [1]–[4] jump to sections, as the hero promises.
const sections = ['work', 'lab', 'about', 'contact'];
window.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if ((event.target as HTMLElement).closest('input, textarea, [contenteditable]')) return;
  const id = sections[Number(event.key) - 1];
  if (id) document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
});

initLab();
initTerminal();
