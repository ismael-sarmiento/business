// Vendored from the IsUniverse design system (portada f03a82d, assets/ds/favicon.js); identity comments removed.
export function syncFavicon() {
  const forced = document.documentElement.dataset.theme;
  document.querySelectorAll('link[data-theme-icon]').forEach(link => {
    const media = forced ? (forced === link.dataset.themeIcon ? 'all' : 'not all') : `(prefers-color-scheme: ${link.dataset.themeIcon})`;
    if (link.media === media) return;
    // a fresh element: browsers re-read the icon when a link is inserted, not always when its media changes
    const next = link.cloneNode();
    next.media = media;
    link.replaceWith(next);
  });
}
