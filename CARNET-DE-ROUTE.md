# Carnet de route — Irrigate

> Document de suivi généré le **19 août 2026**.  
> **Pour reprendre dans une nouvelle conversation Cursor**, indique :
>
> *« Lis `CARNET-DE-ROUTE.md` dans le repo irrigate et continue. »*
>
> Il n’existe pas d’ID de discussion partageable entre chats Cursor — ce fichier fait office de lien.

---

## Projet

| Élément | Valeur |
|---------|--------|
| Site | https://irrigate.fr |
| Repo GitHub | `comeonzorro/irrigate` |
| App iOS | TestFlight · bundle `com.irrigate-garden.app` |
| Expo / EAS | `@leo_theoffnote/irrigate` |
| Supabase project ref | `znxtnowftyvagwwvhhka` |
| Supabase URL | `https://znxtnowftyvagwwvhhka.supabase.co` |
| Vercel | `comeonzorros-projects/irrigate` |

---

## Chronologie des échanges

### 1. Correctifs mobile (TestFlight)

**Problèmes signalés :**
- Crash vue 3D au dézoom (pinch)
- Plan vide à l’ouverture — UX config peu claire
- Saisie dimensions : impossible d’effacer le « 1 » par défaut pour taper un autre chiffre

**Corrections livrées (commit `07d5409`, build EAS #9) :**
- Remplacement `OrbitControls` par contrôles natifs (`react-native-gesture-handler`) → `mobile/src/components/plot3d/NativeCameraControls.tsx`
- Onglet **Config** en premier + écran d’accueil par défaut
- Ordre Config : aperçu plan → dimensions → réglages
- `DimensionInput` avec saisie libre + validation au blur
- Build iOS **#9** soumis TestFlight (19/08/2026)

### 2. SEO

- `src/app/sitemap.ts` + `src/app/robots.ts`
- URL Search Console : `https://irrigate.fr/sitemap.xml`

### 3. Porte ville + multi-projets + Supabase (en cours, non poussé au 19/08 PM)

**Demandes :**
- Obliger le code postal avant la webapp
- Sauvegarder plusieurs projets (web + iOS)
- Espace utilisateur + sync cloud (Supabase)
- V2 future : partage des réalisations potager (`garden_showcases`)

**Implémenté localement (à committer / déployer) :**

| Zone | Fichiers clés |
|------|----------------|
| Porte ville | `/` → `CityGateLanding.tsx` (fond flouté du planificateur) |
| App | `/app` → `AppShell.tsx` + `GardenPlanner` |
| Compte | `/compte` → e-mail + mot de passe Supabase `AuthPanel.tsx` |
| API projets | `src/app/api/projects/` |
| Schéma BDD | `supabase/schema.sql` |
| Guide e-mails | `supabase/AUTH-EMAIL.md` |
| Mobile persistance | `AsyncStorage` + `ProjectBar` + `PlannerContext` étendu |
| Env | `.env.local` (gitignored) · Vercel vars configurées |

### 4. Infra configurée

- **Vercel** : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (prod + preview)
- **MCP Cursor** : `supabase-irrigate` scopé `project_ref=znxtnowftyvagwwvhhka` (`.cursor/mcp.json` + `~/.cursor/mcp.json`)
- **Supabase** : clés reçues · schéma SQL à confirmer côté dashboard · templates e-mail à personnaliser

---

## État actuel des fonctionnalités

| Fonctionnalité | Web | iOS | Cloud |
|----------------|-----|-----|-------|
| Porte code postal | ✅ (fond flouté) | Config manuelle | — |
| Multi-projets local | ✅ localStorage | ✅ AsyncStorage | — |
| Sync cloud | ✅ si connecté | 🔜 EAS env | ✅ API + RLS |
| Magic link compte | ✅ `/compte` | 🔜 | Supabase Auth |
| Réalisations potager | 🔜 table prête | 🔜 | `garden_showcases` |

---

## À faire (priorité)

### Supabase (dashboard)

- [ ] Exécuter `supabase/schema.sql` si pas fait
- [ ] Auth → Site URL : `https://irrigate.fr`
- [ ] Auth → Redirect URLs : `https://irrigate.fr/auth/callback`, `http://localhost:3000/auth/callback`
- [ ] Auth → Email Templates → **Magic Link** (voir `supabase/AUTH-EMAIL.md`)
- [ ] (Optionnel) SMTP custom `noreply@irrigate.fr`

### Git / déploiement

- [ ] Commit + push du carnet et des changements web/mobile/Supabase
- [ ] Redéployer Vercel (porte ville floutée + `/app` + `/compte`)
- [ ] EAS : ajouter `EXPO_PUBLIC_SUPABASE_*` + rebuild TestFlight (persistance + sync)

### Nouvelle conversation Cursor (MCP)

Une fois `supabase-irrigate` connecté (20 tools, pastille verte) :

```
Lis CARNET-DE-ROUTE.md dans comeonzorro/irrigate.
Utilise le MCP supabase-irrigate pour vérifier les tables et la config auth.
```

---

## Structure routes web

| Route | Rôle |
|-------|------|
| `/` | Porte ville (code postal obligatoire) |
| `/app` | Planificateur + barre projets |
| `/compte` | Connexion / inscription + liste projets locaux |
| `/auth/callback` | Callback OAuth Supabase |
| `/assistance`, `/mentions-legales`, `/confidentialite` | Pages statiques |

---

## Builds iOS récents

| Build | Date | Contenu |
|-------|------|---------|
| #9 | 19/08/2026 | Fix 3D, Config UX, dimensions |
| #8 | (précédent) | — |

Artifact EAS #9 : voir expo.dev → projet `irrigate`.

---

## Fichiers sensibles (ne jamais committer)

- `irrigate/.env.local`
- `irrigate/mobile/.env.local`
- Clés Supabase service role

Référence variables : `.env.example`

---

## Notes techniques

### Crash 3D iOS
Cause : bug `OrbitControls` / touch sur React Native (`undefined.x` au pinch).  
Solution : `NativeCameraControls` + `Gesture.Pinch` / `Gesture.Pan`.

### Porte ville web
`CityGateLanding` rend `GardenPlanner` en `previewMode` (opacity + blur) sous un overlay glassmorphism.

### Sync projets cloud
- Local d’abord (`irrigate:project-store` / AsyncStorage)
- Merge à la connexion via `POST /api/projects`
- RLS : `auth.uid() = user_id` sur `projects`

---

## Contact / liens utiles

- Dashboard Supabase : https://supabase.com/dashboard/project/znxtnowftyvagwwvhhka
- TestFlight ASC : app `6802997672`
- Assistance site : https://irrigate.fr/assistance

---

*Dernière mise à jour : 19 août 2026 — session Cursor Irrigate (mobile TestFlight, Supabase, Vercel, MCP).*
