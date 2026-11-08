#!/usr/bin/env bash
# IsBusiness never names the person behind it: no name, employer, personal mailbox or profile in what is served.
# Allowed: the GitHub repository URL in README/AGENTS (not served content of the site itself is checked here).
cd "$(dirname "$0")/.." || exit 2
hits=$(grep -rniE "ismael|sarmiento|savana|gmail|linkedin" --include=*.html --include=*.css --include=*.js --include=*.json --include=*.xml --include=*.txt --include=*.svg . | grep -v '^./qa/')
if [ -n "$hits" ]; then echo "FAIL identity found:"; echo "$hits"; exit 1; fi
echo "identity check: 0 hits"
