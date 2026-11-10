// Anonymous page signal: how many people visit this website. Only the path, referring origin and browser language are
// sent. No cookie, browser storage or visitor identifier; Do Not Track and Global Privacy Control are respected.
// Only on the published site, once per document; it never gets in the way of the page.
const HIT = 'https://stats.isuniverse.dev/hit';
let counted = false;

export function countView() {
  try {
    if (counted || location.hostname !== 'business.isuniverse.dev' || navigator.webdriver) return;
    if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
    let referrer = '';
    try {
      const source = document.referrer ? new URL(document.referrer) : null;
      if (source && ['http:', 'https:'].includes(source.protocol) && source.origin.length <= 260) referrer = source.origin;
    } catch { /* an unavailable referrer is an ordinary direct visit */ }
    const language = typeof navigator.language === 'string' && navigator.language.length <= 35
      && /^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/.test(navigator.language) ? navigator.language : '';
    counted = true;
    navigator.sendBeacon?.(HIT, JSON.stringify({ p: location.pathname, r: referrer, l: language }));
  } catch { /* never in the way of the page */ }
}
