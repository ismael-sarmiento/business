#!/usr/bin/env python3
"""Write i18n/es.json from the Spanish written in the pages (the HTML is the source of the Spanish texts).

Every element with data-i18n gives its text, data-i18n-aria its aria-label. The same key in two places must
carry the same text. The <title> and description of each page become «meta.*» (home) or «<page>.meta.*».
Then it checks that i18n/en.json has exactly the same keys.

  python3 tools/build_es.py
"""
import json, pathlib, sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {'index.html': 'meta', 'legal/index.html': 'legal.meta', '404.html': 'nf.meta'}
VOID = {'meta', 'link', 'img', 'br', 'input', 'source', 'use', 'path', 'circle', 'rect', 'stop'}

class Collect(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack = []; self.out = {}; self.title = None; self.desc = None; self.in_title = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title': self.in_title = True; self.title = ''
        if tag == 'meta' and a.get('name') == 'description': self.desc = a.get('content')
        if 'data-i18n-aria' in a: self.put(a['data-i18n-aria'], a.get('aria-label', ''))
        if tag in VOID: return
        self.stack.append([a.get('data-i18n'), ''])
    def handle_startendtag(self, tag, attrs):
        a = dict(attrs)
        if 'data-i18n-aria' in a: self.put(a['data-i18n-aria'], a.get('aria-label', ''))
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag in VOID or not self.stack: return
        key, text = self.stack.pop()
        if key: self.put(key, ' '.join(text.split()))
        if self.stack: self.stack[-1][1] += text
    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.stack: self.stack[-1][1] += data
    def put(self, key, value):
        if key in self.out and self.out[key] != value:
            sys.exit(f'FAIL {key}: «{self.out[key]}» ≠ «{value}»')
        self.out[key] = value

es = {}
for page, meta in PAGES.items():
    c = Collect(); c.feed((ROOT / page).read_text())
    for k, v in c.out.items():
        if k in es and es[k] != v: sys.exit(f'FAIL {k} differs between pages')
        es[k] = v
    es[f'{meta}.title'] = c.title.strip(); es[f'{meta}.description'] = c.desc
es = dict(sorted(es.items()))
(ROOT / 'i18n/es.json').write_text(json.dumps(es, ensure_ascii=False, indent=1) + '\n')
print(f'i18n/es.json: {len(es)} keys')
en_path = ROOT / 'i18n/en.json'
if en_path.exists():
    en = json.loads(en_path.read_text())
    missing, extra = sorted(set(es) - set(en)), sorted(set(en) - set(es))
    for k in missing: print('MISSING in en.json:', k)
    for k in extra: print('EXTRA in en.json:', k)
    sys.exit(1 if missing or extra else 0)
