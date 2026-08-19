# E-mails d'authentification Supabase — Irrigate

Projet : **znxtnowftyvagwwvhhka** · Site : **https://irrigate.fr**

## Checklist Supabase (ce qu'il reste à faire)

### 1. Auth — URLs (obligatoire)

Dashboard → **Authentication** → **URL Configuration**

| Champ | Valeur |
|-------|--------|
| **Site URL** | `https://irrigate.fr` |
| **Redirect URLs** | `https://irrigate.fr/auth/callback` |
| | `http://localhost:3000/auth/callback` |
| | `irrigate://auth/callback` *(app mobile, si deep link activé plus tard)* |

### 2. Auth — Fournisseur e-mail

Dashboard → **Authentication** → **Providers** → **Email**

- ✅ Enable Email provider
- ✅ **Confirm email** : activé (recommandé)
- ✅ **Secure email change** : activé
- Connexion par **e-mail + mot de passe** (`signUp` / `signInWithPassword` sur `/compte` et app iOS)
- **Magic Link** : désactivé côté app (optionnel dans Supabase, non utilisé)

### 3. Templates d'e-mail (personnalisation)

Fichiers prêts dans **`supabase/emails/`** :

| Fichier | Usage Supabase | Objet |
|---------|----------------|-------|
| `magic-link.html` | *(non utilisé)* | — |
| `confirm-signup.html` | **Confirm signup** | `Bienvenue sur Irrigate — confirmez votre e-mail 🌿` |
| *(à ajouter)* | **Reset password** | `Réinitialisez votre mot de passe Irrigate` |

Déploiement automatique (après SMTP custom, voir §4) :

```bash
source ~/.zshrc
./supabase/emails/deploy-templates.sh
```

> **Plan Free + expéditeur Supabase par défaut** : l'API refuse la modification des templates.
> Il faut d'abord activer **Custom SMTP** (§4), puis relancer le script ou coller le HTML dans
> Dashboard → **Authentication** → **Email Templates**.

Variables Supabase : `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}`, etc.

### 4. Expéditeur (optionnel mais pro)

Par défaut Supabase envoie depuis `noreply@mail.app.supabase.io`.

Pour **contact@irrigate.fr** ou **noreply@irrigate.fr** :

Dashboard → **Project Settings** → **Authentication** → **SMTP Settings**

- Activer **Custom SMTP**
- Hôte : ton fournisseur (Hostinger, Resend, Brevo…)
- Port 587, STARTTLS
- User / password SMTP
- **Sender email** : `noreply@irrigate.fr`
- **Sender name** : `Irrigate`

Sans SMTP custom, les mails partent quand même — ils arrivent souvent en spam.

### 5. Schéma base (si pas déjà fait)

SQL Editor → exécuter `schema.sql` (tables `profiles`, `projects`, `garden_showcases` + RLS).

### 6. Vercel

Déjà configuré :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (production + preview)

### 7. App mobile (TestFlight)

Ajouter dans **EAS Secrets** ou `eas.json` env :

```
EXPO_PUBLIC_SUPABASE_URL=https://znxtnowftyvagwwvhhka.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

Puis rebuild iOS pour sync cloud mobile.

---

## MCP Cursor (projet isolé)

Config dans **`irrigate/.cursor/mcp.json`** uniquement :

```json
"supabase-irrigate": {
  "url": "https://mcp.supabase.com/mcp?project_ref=znxtnowftyvagwwvhhka"
}
```

Retiré du MCP global pour ne pas mélanger tes autres projets.

**Cursor → Settings → Tools & MCP → supabase-irrigate → Authenticate**

---

## Test rapide

1. Aller sur https://irrigate.fr/compte
2. **Créer un compte** ou **Se connecter** avec e-mail + mot de passe
3. Vérifier réception (et spams)
4. Cliquer le lien → redirection `/compte` connecté
5. Créer/modifier un projet sur `/app` → sync cloud si connecté
