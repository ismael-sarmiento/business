#!/usr/bin/env python3
"""Copy the official «Is» into every page of IsBusiness.

The «Is» of IsUniverse is ONE drawing: the gold path of the portada's favicon-dark.svg
(assets/brand/favicon-dark.svg here is a byte-for-byte copy). It is never redrawn. This tool takes that
path verbatim and writes it as a hidden <symbol id="is-glyph"> at the top of each page, between the
markers <!--IS_SYMBOL--> or an existing <svg class="is-symbol">…</svg>. Pages use it with <use href="#is-glyph">.

  python3 tools/sync_mark.py           # write
  python3 tools/sync_mark.py --check   # exit 1 if any page differs from favicon-dark.svg
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
svg = (ROOT / 'assets/brand/favicon-dark.svg').read_text()
path = re.search(r'<path [^>]*/>', svg).group(0)
path = re.sub(r' fill="[^"]*"', '', path)   # colour comes from CSS (currentColor), geometry stays verbatim
# tight box of the ink inside the 1024 favicon square: x 174–850, y 234–790 (baseline at y 746.5)
SYMBOL = ('<svg class="is-symbol" width="0" height="0" aria-hidden="true" focusable="false">'
          f'<symbol id="is-glyph" viewBox="174 234 676 556">{path}</symbol></svg>')
PAGES = ['index.html', '404.html', 'legal/index.html']
pattern = re.compile(r'<!--IS_SYMBOL-->|<svg class="is-symbol".*?</svg>', re.S)
check = '--check' in sys.argv
bad = 0
for name in PAGES:
    p = ROOT / name
    if not p.exists():
        continue
    text = p.read_text()
    new = pattern.sub(SYMBOL, text, count=1)
    if check:
        if SYMBOL not in text:
            print(f'FAIL {name}: the «Is» symbol differs from favicon-dark.svg'); bad += 1
        else:
            print(f'ok   {name}')
    elif new != text:
        p.write_text(new); print(f'updated {name}')
sys.exit(1 if bad else 0)
