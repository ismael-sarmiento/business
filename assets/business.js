// IsBusiness · page behaviour: the IsUniverse design system (theme, bar, reveals, card light), languages (?lang=en),
// the intro with the official «Is», the contact links (assets/data.js) and the small motion of the page.
import { initDesignSystem, reducedMotion } from './ds/ds.js';
import { createI18n } from './ds/i18n.js';
import { initIntro } from './ds/intro.js';
import { markScene } from './scene.js';
import { waHref, mailHref } from './data.js';

const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'https://business.isuniverse.dev/';
const i18n = createI18n({ base: canonical.split('?')[0], dict: code => `/i18n/${code}.json` });

// every WhatsApp and mail link carries the message in the language shown
function syncContact(lang) {
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = waHref(lang); });
  document.querySelectorAll('[data-mail]').forEach(a => { a.href = mailHref(lang); });
}

// a page other than the home sets its own title and description (keys «<page>.meta.*» of the dictionary)
function syncPageMeta() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.title = i18n.t(`${page}.meta.title`);
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t(`${page}.meta.description`));
}

// «Cómo funciona»: the gold line runs through the four steps once they are on screen
function initSteps() {
  const steps = document.querySelector('.steps');
  if (!steps) return;
  if (reducedMotion()) { steps.classList.add('run'); return; }
  new IntersectionObserver((entries, obs) => entries.forEach(e => {
    if (e.isIntersecting) { steps.classList.add('run'); obs.disconnect(); }
  }), { rootMargin: '0px 0px -25% 0px' }).observe(steps);
}

// the phone of the hero only plays while it is on screen (and never under the intro)
function initDevice() {
  const device = document.querySelector('.device');
  if (!device || reducedMotion()) return;
  new IntersectionObserver(entries => entries.forEach(e => device.classList.toggle('playing', e.isIntersecting)))
    .observe(device);
}

async function boot() {
  const startup = globalThis.isaStartup;
  if (!startup) {
    document.documentElement.classList.remove('js', 'i18n-wait');
    const intro = document.getElementById('intro');
    if (intro) intro.hidden = true;
    return;
  }
  if (startup.isFailed()) return;
  initDesignSystem();
  // the hero rises on load (staggered); while the intro is open it waits underneath (intro.css)
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('in'));
  i18n.onChange(lang => { syncContact(lang); syncPageMeta(); });
  await i18n.start();
  if (startup.isFailed()) return;
  initIntro({ i18n, scene: markScene });
  startup.ready();
  initSteps();
  initDevice();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
}

boot().catch(() => globalThis.isaStartup?.fail());
