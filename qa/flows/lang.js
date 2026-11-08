// EN and back: texts, <html lang>, title, URL, and the WhatsApp/mail messages follow the language.
$('[data-action="skip"]')?.click(); await wait(100); $('[data-action="enter"]')?.click(); await wait(2000);
$('.tools [data-action="lang"]').click(); await wait(600);
const en = document.documentElement.lang === 'en' && $('.hero-title span').textContent.startsWith('Your business') && location.search.includes('lang=en')
  && document.title.includes('Websites') && $('[data-wa]').href.includes('Hi%2C') && $('[data-mail]').href.includes('Free%20demo');
$('.tools [data-action="lang"]').click(); await wait(600);
const es = document.documentElement.lang === 'es' && $('.hero-title span').textContent.startsWith('Tu negocio') && !location.search.includes('lang')
  && $('[data-wa]').href.includes('Hola%2C') && $('.s-day--a span').textContent === 'S';
return { ok: en && es, notes: `en=${en} es=${es}` };
