// The legal page: its own title in both languages, the holder's data marked pending, no intro.
const es = document.title === 'Aviso legal y privacidad · IsBusiness' && document.querySelectorAll('.pending').length === 3 && !$('#intro');
$('.tools [data-action="lang"]').click(); await wait(600);
const en = document.title === 'Legal notice and privacy · IsBusiness' && $('.legal h1').textContent === 'Legal notice and privacy';
$('.tools [data-action="lang"]').click(); await wait(400);
return { ok: es && en, notes: `es=${es} en=${en}` };
