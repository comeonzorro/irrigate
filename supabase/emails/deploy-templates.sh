#!/usr/bin/env bash
# Déploie les templates e-mail Irrigate sur Supabase via Management API.
# Prérequis : SUPABASE_ACCESS_TOKEN dans l'environnement (voir ~/.zshrc)

set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-znxtnowftyvagwwvhhka}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "SUPABASE_ACCESS_TOKEN manquant." >&2
  exit 1
fi

python3 - "$SCRIPT_DIR" "$PROJECT_REF" <<'PY' | curl -sS -X PATCH \
  "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @- | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message') or 'Templates déployés OK')"
import json, pathlib, sys

base = pathlib.Path(sys.argv[1])
print(json.dumps({
    "site_url": "https://irrigate.fr",
    "uri_allow_list": "https://irrigate.fr/auth/callback,http://localhost:3000/auth/callback,irrigate://auth/callback",
    "mailer_subjects_magic_link": "Votre lien de connexion Irrigate 🌱",
    "mailer_templates_magic_link_content": (base / "magic-link.html").read_text(),
    "mailer_subjects_confirmation": "Bienvenue sur Irrigate — confirmez votre e-mail 🌿",
    "mailer_templates_confirmation_content": (base / "confirm-signup.html").read_text(),
}))
PY
