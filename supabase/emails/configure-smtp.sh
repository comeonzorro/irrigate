#!/usr/bin/env bash
# Configure Supabase custom SMTP (Hostinger) + branded email templates.
#
# Required env vars:
#   SUPABASE_ACCESS_TOKEN
#   IRRIGATE_SMTP_USER      e.g. noreply@irrigate.fr
#   IRRIGATE_SMTP_PASS      mailbox password
#
# Optional:
#   SUPABASE_PROJECT_REF    default znxtnowftyvagwwvhhka
#   IRRIGATE_SMTP_SENDER    default "Irrigate"

set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-znxtnowftyvagwwvhhka}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

for var in SUPABASE_ACCESS_TOKEN IRRIGATE_SMTP_USER IRRIGATE_SMTP_PASS; do
  if [[ -z "${!var:-}" ]]; then
    echo "$var manquant." >&2
    exit 1
  fi
done

SENDER_NAME="${IRRIGATE_SMTP_SENDER:-Irrigate}"

python3 - "$SCRIPT_DIR" "$SENDER_NAME" <<'PY' > /tmp/irrigate-smtp-patch.json
import json, pathlib, sys

base = pathlib.Path(sys.argv[1])
sender = sys.argv[2]

print(json.dumps({
    "site_url": "https://irrigate.fr",
    "uri_allow_list": "https://irrigate.fr/**,http://localhost:3000/**,irrigate://auth/callback",
    "smtp_admin_email": __import__("os").environ["IRRIGATE_SMTP_USER"],
    "smtp_user": __import__("os").environ["IRRIGATE_SMTP_USER"],
    "smtp_pass": __import__("os").environ["IRRIGATE_SMTP_PASS"],
    "smtp_host": "smtp.hostinger.com",
    "smtp_port": 587,
    "smtp_sender_name": sender,
    "mailer_subjects_confirmation": "Bienvenue sur Irrigate — confirmez votre e-mail 🌿",
    "mailer_templates_confirmation_content": (base / "confirm-signup.html").read_text(),
    "mailer_subjects_recovery": "Réinitialisez votre mot de passe Irrigate 🔐",
    "mailer_templates_recovery_content": (base / "recovery.html").read_text(),
    "mailer_subjects_magic_link": "Votre lien de connexion Irrigate 🌱",
    "mailer_templates_magic_link_content": (base / "magic-link.html").read_text(),
}))
PY

curl -sS -X PATCH "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/irrigate-smtp-patch.json | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('message') or 'SMTP + templates OK')
print('smtp_host:', d.get('smtp_host'))
print('smtp_admin_email:', d.get('smtp_admin_email'))
print('recovery subject:', d.get('mailer_subjects_recovery'))
"

rm -f /tmp/irrigate-smtp-patch.json
