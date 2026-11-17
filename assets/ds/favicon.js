// Vendored from the IsUniverse design system (portada f03a82d, assets/ds/favicon.js); identity comments removed.
// The tab icon and the browser bar follow the page theme (Modern Web Guidance, browser UI theming): one theme-color per scheme,
//   <meta name="theme-color" content="#fbf7ef" media="(prefers-color-scheme: light)" data-theme-color="light">
//   <meta name="theme-color" content="#0b1026" media="(prefers-color-scheme: dark)" data-theme-color="dark">
// and a theme picked on the site switches the matching one on.
export function syncFavicon() {
  const forced = document.documentElement.dataset.theme;
  document.querySelectorAll('meta[data-theme-color]').forEach(meta => {
    const media = forced ? (forced === meta.dataset.themeColor ? 'all' : 'not all') : `(prefers-color-scheme: ${meta.dataset.themeColor})`;
    if (meta.media !== media) meta.media = media;
  });
  document.querySelectorAll('link[data-theme-icon]').forEach(link => {
    const media = forced ? (forced === link.dataset.themeIcon ? 'all' : 'not all') : `(prefers-color-scheme: ${link.dataset.themeIcon})`;
    if (link.media === media) return;
    // a fresh element: browsers re-read the icon when a link is inserted, not always when its media changes
    const next = link.cloneNode();
    next.media = media;
    link.replaceWith(next);
  });
}
