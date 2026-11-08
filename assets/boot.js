// IsBusiness · before first paint (after /assets/ds/startup.js, which sets the theme and the .js class).
// A visitor who asked for English (?lang=en or a stored choice) does not see the page in Spanish first:
// the texts wait (.i18n-wait, at most until i18n.js has applied the dictionary or startup fails).
(() => {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || (q !== 'es' && localStorage.getItem('isa-lang') === 'en')) document.documentElement.classList.add('i18n-wait');
  } catch { /* storage unavailable: Spanish first */ }
})();
