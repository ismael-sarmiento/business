// Alan: hidden under the intro, then a question about price answers with the free demo and a WhatsApp action;
// in English it answers in English; the panel never names a person.
$('[data-action="skip"]')?.click(); await wait(100); $('[data-action="enter"]')?.click(); await wait(2600);
const fab = $('.assistant-fab');
if (!fab) return { ok: false, notes: 'no Alan button' };
const shown = !fab.hidden && !fab.classList.contains('fab-tucked');
fab.click(); await wait(500);
const panel = $('#assistantPanel'), input = panel.querySelector('input, textarea');
input.value = '¿Cuánto cuesta una web?'; input.dispatchEvent(new Event('input', { bubbles: true }));
panel.querySelector('form')?.requestSubmit(); await wait(2200);
const text = panel.textContent;
const es = /presupuesto cerrado/.test(text) && [...panel.querySelectorAll('button, a')].some(b => /demo gratis/i.test(b.textContent));
const anon = !/ismael|sarmiento/i.test(text);
return { ok: shown && es && anon, notes: `fab=${shown} answer=${es} anonymous=${anon}` };
