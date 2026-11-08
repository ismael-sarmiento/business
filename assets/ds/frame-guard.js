// Vendored from the IsUniverse design system (portada f03a82d, assets/ds/frame-guard.js); identity comments removed.
export function escapeForeignFrame() {
  if (window.top === window.self) return false;
  let sameOrigin = false;
  try { sameOrigin = window.top.location.origin === window.location.origin; } catch { /* cross-origin frame */ }
  if (sameOrigin) return false;
  try { window.top.location.replace(window.location.href); } catch { document.body.hidden = true; }
  return true;
}
