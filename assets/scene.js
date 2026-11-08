// IsBusiness · the intro scene, plugged into the shared intro (/assets/ds/intro.js: initIntro({ scene })).
// Same rhythm and gestures as the signature of the other IsUniverse sites, with one rule: the «Is» is never a font.
// It is the official drawing (#is-glyph, copied from favicon-dark.svg by tools/sync_mark.py):
//   1) its outline is traced (1.5 s), 2) gold ink fills it from left to right (0.7 s),
//   3) «Business» is decoded letter by letter behind a blinking cursor (0.76 s).
// Exit: the «Is» flies to the mark of the top bar leaving gold ink while «Business» breaks into pixels.
import { reducedMotion } from './ds/ds.js';
import { ink, pixels } from './ds/fx.js';

const GLYPHS = '01/{}#$%@=+*ABCDEFXYZ';
const WORD_X = 296;
const EASE_OUT = 'cubic-bezier(.2, .8, .2, 1)';
const EASE_IN_OUT = 'cubic-bezier(.65, 0, .35, 1)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const settled = anim => anim.finished.catch(() => {});
const easeInOut = p => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const glyphLength = () => document.querySelector('#is-glyph path')?.getTotalLength() || 6000;

function animate(svg, duration, step) {
  return new Promise(resolve => {
    const t0 = performance.now();
    const tick = now => {
      const p = svg.dataset.skipped ? 1 : Math.min(1, (now - t0) / duration);
      step(p);
      if (p < 1) requestAnimationFrame(tick); else resolve();
    };
    requestAnimationFrame(tick);
  });
}

// size the viewBox to the real word once the font is ready, so the mark never overflows or floats
// and keep the «Is» the same size as on every site: the signatures are drawn at min(1160px, 92vw) for 1401 units
// (intro.css), so a shorter word gives a narrower drawing, never a bigger «Is» (same rule in IsPanel)
function fit(svg) {
  const w = svg.querySelector('.word').getComputedTextLength();
  if (!w) return;
  const units = Math.ceil(WORD_X + w + 30);
  svg.setAttribute('viewBox', `0 0 ${units} 330`);
  svg.style.width = `min(100%, calc(min(1160px, 92vw) * ${units} / 1401))`;
}
function cursorAfter(svg) {
  const word = svg.querySelector('.word');
  svg.querySelector('.cursor').setAttribute('x', String(WORD_X + (word.textContent ? word.getComputedTextLength() : 0) + 22));
}

function complete(svg) {
  svg.dataset.skipped = '1';
  const stroke = svg.querySelector('.is-stroke');
  stroke.style.strokeDashoffset = '0';
  svg.querySelector('.ink').setAttribute('width', '3000');
  svg.querySelector('.word').textContent = svg.dataset.word;
  svg.querySelector('.cursor').setAttribute('opacity', '0');
  svg.classList.add('is-live');
}

async function play(svg) {
  await document.fonts.ready;
  fit(svg);
  if (svg.dataset.skipped) return;
  if (reducedMotion()) { complete(svg); return; }
  const stroke = svg.querySelector('.is-stroke'), inkRect = svg.querySelector('.ink'), word = svg.querySelector('.word');
  const cursor = svg.querySelector('.cursor');
  const box = svg.querySelector('.is-fill').getBBox();
  const length = glyphLength(), target = svg.dataset.word;
  stroke.style.strokeDasharray = String(length);
  stroke.style.strokeDashoffset = String(length);
  inkRect.setAttribute('width', '0');
  word.textContent = '';
  cursorAfter(svg);
  cursor.setAttribute('opacity', '1');
  svg.classList.add('is-live');
  await animate(svg, 1500, p => { stroke.style.strokeDashoffset = String(length * (1 - easeInOut(p))); });
  await animate(svg, 700, p => { inkRect.setAttribute('x', String(box.x - 20)); inkRect.setAttribute('width', String((box.width + 60) * easeInOut(p))); });
  if (svg.dataset.skipped) return;
  await animate(svg, 760, p => {
    const i = Math.min(target.length, Math.floor(p * (target.length + 1)));
    const noise = Array.from({ length: Math.min(2, target.length - i) }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
    word.textContent = target.slice(0, i) + noise;
    cursorAfter(svg);
  });
  word.textContent = target;
  cursorAfter(svg);
  if (!svg.dataset.skipped) await sleep(500);
  cursor.setAttribute('opacity', '0');
}

export const markScene = {
  handoff: false,
  async play(intro, cancelled) {
    await sleep(200);
    if (cancelled()) return;
    await play(intro.querySelector('.bsig'));
  },
  complete: intro => complete(intro.querySelector('.bsig')),
  async exit(intro, end) {
    const svg = intro.querySelector('.bsig');
    const brand = document.querySelector('.topbar .brand');
    const seal = brand?.querySelector('.brand-mark');
    const word = svg.querySelector('.word');

    // 1) everything but the mark steps back
    intro.querySelectorAll('.intro-top, .intro-after, .intro-actions')
      .forEach(el => el.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(6px)' }], { duration: 300, easing: EASE_OUT, fill: 'forwards' }));

    // 2) the «Is» leaves in a fixed copy (own ids, so its ink mask keeps working) and flies to the bar
    const from = svg.getBoundingClientRect();
    const glyph = svg.querySelector('.is-fill').getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.className = 'intro-flyer';
    Object.assign(flyer.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px` });
    const copy = svg.cloneNode(true);
    copy.querySelectorAll('[id]').forEach(el => { el.id = `fly-${el.id}`; });
    copy.querySelectorAll('[fill^="url(#"], [mask^="url(#"]').forEach(el => ['fill', 'mask'].forEach(a => {
      const v = el.getAttribute(a);
      if (v?.startsWith('url(#')) el.setAttribute(a, v.replace('url(#', 'url(#fly-'));
    }));
    flyer.append(copy);
    document.body.append(flyer);
    svg.querySelectorAll('.is-stroke, .is-fill').forEach(el => { el.style.visibility = 'hidden'; });
    document.body.classList.add('entering');
    let flight = Promise.resolve();
    const to = seal?.getBoundingClientRect();
    if (to && to.height && glyph.height) {
      const k = to.height / glyph.height;
      const dx = to.left - (from.left + (glyph.left - from.left) * k);
      const dy = to.top - (from.top + (glyph.top - from.top) * k);
      const anim = flyer.animate([{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${k})` }],
        { duration: 1050, delay: 150, easing: EASE_IN_OUT, fill: 'forwards' });
      flight = settled(anim);
      let frame = 0;
      (function trail() {
        if (intro.hidden || anim.playState === 'finished' || anim.playState === 'idle') return;
        if (frame++ % 3 === 0) {
          const g = flyer.querySelector('.is-fill').getBoundingClientRect();
          if (g.width > 20) ink(g.right - g.width * .25, g.top + g.height * .55, 1, 1);
        }
        requestAnimationFrame(trail);
      })();
    }

    // 3) «Business» breaks into pixels and is gone before the page appears
    const wr = word.getBoundingClientRect();
    word.animate([{ opacity: 1 }, { opacity: .55, offset: .45 }, { opacity: 0 }], { duration: 420, delay: 80, easing: EASE_OUT, fill: 'forwards' });
    const t0 = performance.now();
    (function dissolve(now) {
      const p = (now - t0) / 620;
      if (intro.hidden || p > 1) return;
      if (p > .1) pixels(wr.left + wr.width * Math.random(), wr.top + wr.height * (.3 + Math.random() * .5), wr.height * .3, Math.random() < .5 ? -1 : 1, 3);
      requestAnimationFrame(dissolve);
    })(t0);

    // 4) the page appears underneath
    const bg = getComputedStyle(intro).backgroundColor;
    intro.animate([{ backgroundColor: bg }, { backgroundColor: 'transparent' }], { duration: 700, delay: 520, easing: EASE_IN_OUT, fill: 'forwards' });
    document.querySelectorAll('.topbar, main').forEach(el =>
      el.animate([{ opacity: 0, transform: 'scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 520, easing: EASE_OUT, fill: 'backwards' }));
    setTimeout(() => document.body.classList.remove('intro-open'), 700);

    // 5) the «Is» lands: the real mark takes over
    await flight;
    const brandIn = brand?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: 'forwards' });
    await settled(flyer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }));
    end();
    brandIn?.cancel();
  },
};
