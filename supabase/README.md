# Supabase — Irrigate

## 1. Créer le projet

1. [supabase.com](https://supabase.com) → New project
2. Copier **Project URL** et **anon public key** (Settings → API)

### MCP Cursor (projet Irrigate uniquement)

Config scopée dans **`irrigate/.cursor/mcp.json`** — serveur `supabase-irrigate` :

```
https://mcp.supabase.com/mcp?project_ref=znxtnowftyvagwwwvhka
```

Retiré du MCP global (`~/.cursor/mcp.json`) pour ne pas mélanger vos autres projets Supabase.

**Cursor → Settings → Tools & MCP → supabase-irrigate → Authenticate**

Guide e-mails auth : [`AUTH-EMAIL.md`](./AUTH-EMAIL.md)

## 2. Exécuter le schéma

Dans **SQL Editor**, coller et exécuter le fichier [`schema.sql`](./schema.sql).

Tables créées :
- `profiles` — profil utilisateur
- `projects` — potagers sauvegardés (config JSON)
- `garden_showcases` — réalisations partagées (V2)

## 3. Auth (magic link)

Dashboard → Authentication → Providers → **Email** : activé  
Site URL : `https://irrigate.fr`  
Redirect URLs :
- `https://irrigate.fr/auth/callback`
- `http://localhost:3000/auth/callback`

## 4. Variables d'environnement

### Vercel (site)
```
NEXT_PUBLIC_SUPABASE_URL=https://znxtnowftyvagwwwvhka.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public>
SUPABASE_SERVICE_ROLE_KEY=<service role — server only>
```

Redirect URL auth : `https://irrigate.fr/auth/callback`

### EAS / mobile (optionnel, sync cloud)
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 5. Comportement

| Fonctionnalité | Sans Supabase | Avec Supabase |
|----------------|---------------|---------------|
| Porte ville (web) | ✅ localStorage | ✅ |
| Multi-projets local | ✅ | ✅ |
| Sync cloud | ❌ | ✅ (connexion email) |
| Réalisations potager | — | 🔜 table prête |
