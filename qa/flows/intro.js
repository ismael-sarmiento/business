// The intro draws the «Is», offers the actions, and «Descubrir» hands the page over with the focus on the title.
const intro = $('#intro');
if (!intro || intro.hidden) return { ok: false, notes: 'no intro on first visit' };
for (let i = 0; i < 40 && !intro.classList.contains('ready'); i++) await wait(150);
if (!intro.classList.contains('ready')) return { ok: false, notes: 'intro never reached ready' };
const live = $('.bsig').classList.contains('is-live') && $('.bsig .word').textContent === 'Business';
$('[data-action="enter"]').click();
for (let i = 0; i < 40 && !intro.hidden; i++) await wait(150);
const focus = document.activeElement === $('main h1');
const brandShown = getComputedStyle($('.topbar .brand')).opacity === '1';
return { ok: live && intro.hidden && focus && brandShown && !document.querySelector('.intro-flyer'), notes: `drawn=${live} closed=${intro.hidden} h1focus=${focus} brand=${brandShown}` };
