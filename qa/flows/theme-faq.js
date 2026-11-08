// Theme toggle (and back), FAQ opens with the keyboard-reachable summary, the steps line runs, every external link is safe.
$('[data-action="skip"]')?.click(); await wait(100); $('[data-action="enter"]')?.click(); await wait(2000);
const before = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
$('.tools [data-action="theme"]').click(); await wait(200);
const flipped = document.documentElement.dataset.theme === (before === 'dark' ? 'light' : 'dark');
$('.tools [data-action="theme"]').click(); await wait(200);
const back = document.documentElement.dataset.theme === before;
const d = $('.faq details'); d.querySelector('summary').click(); await wait(500);
const open = d.open;
$('#proceso').scrollIntoView(); await wait(900);
const run = $('.steps').classList.contains('run');
const unsafe = [...document.querySelectorAll('a[target="_blank"]')].filter(a => !/noopener/.test(a.rel) || !/noreferrer/.test(a.rel)).length;
const wa = [...document.querySelectorAll('[data-wa]')].every(a => a.href.startsWith('https://wa.me/34613371874?text='));
return { ok: flipped && back && open && run && !unsafe && wa, notes: `theme=${flipped}/${back} faq=${open} steps=${run} unsafe=${unsafe} wa=${wa}` };
