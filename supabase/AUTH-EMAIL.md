# E-mails d'authentification Supabase — Irrigate

Projet : **znxtnowftyvagwwwvhka** · Site : **https://irrigate.fr**

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
- **Magic Link** / OTP : c'est ce que utilise `/compte` (`signInWithOtp`)

### 3. Templates d'e-mail (personnalisation)

Dashboard → **Authentication** → **Email Templates**

Modifier au minimum :

#### **Magic Link** (connexion web + app)

**Subject suggéré :**
```
Votre lien de connexion Irrigate 🌱
```

**Body suggéré** (HTML) — coller dans l'éditeur Supabase :

```html
<h2>Connexion à Irrigate</h2>
<p>Bonjour,</p>
<p>Cliquez sur le bouton ci-dessous pour accéder à votre espace potager et retrouver vos projets sauvegardés.</p>
<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#15803d;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Se connecter à Irrigate</a></p>
<p>Ou copiez ce lien :<br>{{ .ConfirmationURL }}</p>
<p style="color:#666;font-size:13px;">Ce lien expire sous 24 h. Si vous n'avez pas demandé cette connexion, ignorez cet e-mail.</p>
<p>— L'équipe <a href="https://irrigate.fr">Irrigate.fr</a></p>
```

Variables Supabase disponibles : `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}`, etc.

#### **Confirm signup** (si inscription explicite)

**Subject :**
```
Bienvenue sur Irrigate — confirmez votre e-mail
```

Même structure avec `{{ .ConfirmationURL }}`.

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
EXPO_PUBLIC_SUPABASE_URL=https://znxtnowftyvagwwwvhka.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

Puis rebuild iOS pour sync cloud mobile.

---

## MCP Cursor (projet isolé)

Config dans **`irrigate/.cursor/mcp.json`** uniquement :

```json
"supabase-irrigate": {
  "url": "https://mcp.supabase.com/mcp?project_ref=znxtnowftyvagwwwvhka"
}
```

Retiré du MCP global pour ne pas mélanger tes autres projets.

**Cursor → Settings → Tools & MCP → supabase-irrigate → Authenticate**

---

## Test rapide

1. Aller sur https://irrigate.fr/compte
2. Entrer votre e-mail → **Lien magique**
3. Vérifier réception (et spams)
4. Cliquer le lien → redirection `/compte` connecté
5. Créer/modifier un projet sur `/app` → sync cloud si connecté
