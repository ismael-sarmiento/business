# AGENTS.md — business (IsBusiness website)

## Parent

Global roots (L0):
- Claude Code: `~/.claude/CLAUDE.md`
- Codex: `~/.codex/AGENTS.md`

Public repository `business`, local copy `~/workspaces/personal/projects/is-universe/business/`, served by GitHub Pages at
`https://business.isuniverse.dev/` (CNAME `business` → the account's github.io, DNS only). How IsUniverse builds and checks
sites: the private `kit` (`../kit/AGENTS.md`, skill `isuniverse-web`). Domain rules: `../docs/dominio/DOMINIO-ISUNIVERSE.md`.

## Purpose

IsBusiness is the business branch of IsUniverse: affordable websites for local businesses (later, social media).
It is NOT linked from the portada, the CV or LinkedIn, and **it never names the person behind it**.

## Rules

- Plan al Milímetro before any change and the 6-point recap after (L0).
- Read `README.md` (map, checks). Keep `qa/check_identity.sh`, `tools/sync_mark.py --check` and the flows green.
- Never redraw the «Is»; never add third-party scripts, fonts, analytics or cookies (the page-view signal uses `assets/ds/views.js` to `stats.isuniverse.dev`, never the Worker's `workers.dev` address;
  no client cookie or persistent identifier, but the private server-side log includes IP/network context for 30 days); never write personal data, secrets or
  a personal mailbox. Contact = `assets/data.js` (`contacto@isuniverse.dev` alias and the WhatsApp the owner chose).
- `assets/ds/` is a copy: when the portada's design system changes, copy again and strip identity comments.
- The orphan branch `paused` is the pause page used by IsPanel («Mis webs»). Do not delete it.
- Commits without `Co-Authored-By: Claude`; author email = the GitHub noreply address. Publish verified bundles through the owner's Chrome and the protected one-shot Actions workflow in the private kit (Codespaces is an alternative); this Mac cannot push to GitHub.
