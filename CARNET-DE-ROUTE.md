# Carnet de route — Irrigate

> Document de suivi généré le **19 août 2026**, mis à jour le **20 août 2026**.  
> **Pour reprendre dans une nouvelle conversation Cursor**, indique :
>
> *« Lis `CARNET-DE-ROUTE.md` dans le repo irrigate et continue. »*
>
> Il n'existe pas d'ID de discussion partageable entre chats Cursor — ce fichier fait office de lien.

---

## Projet

| Élément | Valeur |
|---------|--------|
| Site | https://irrigate.fr |
| Repo GitHub | `comeonzorro/irrigate` |
| App iOS | TestFlight · bundle `com.irrigate-garden.app` |
| Expo / EAS | `@leo_theoffnote/irrigate` |
| Supabase project ref | `znxtnowftyvagwwvhhka` ⚠️ **wwv** pas www |
| Supabase URL | `https://znxtnowftyvagwwvhhka.supabase.co` |
| Vercel | `comeonzorros-projects/irrigate` |
| DNS domaine | **Vercel** (`ns1.vercel-dns.com`) — pas Hostinger |
| E-mail transactionnel | `noreply@irrigate.fr` (Hostinger SMTP → Supabase) |

---

## Chronologie des échanges

### 1. Correctifs mobile (TestFlight) — 19/08 matin

**Problèmes signalés :**
- Crash vue 3D au dézoom (pinch)
- Plan vide à l'ouverture — UX config peu claire
- Saisie dimensions : impossible d'effacer le « 1 » par défaut

**Corrections (commit `07d5409`, build EAS #9) :**
- `NativeCameraControls.tsx` (gestes natifs, plus d'`OrbitControls`)
- Onglet **Config** en premier + ordre UX revu
- `DimensionInput` avec saisie libre + validation au blur

### 2. Porte ville + multi-projets + Supabase — 19/08 après-midi

**Commit `a48187d` puis itérations :**
- Porte ville `/` → `CityGateLanding.tsx`
- App `/app` → `AppShell` + `GardenPlanner` + `ProjectBar`
- Compte `/compte` → sync cloud Supabase
- API `src/app/api/projects/`
- Schéma `supabase/schema.sql` (profiles, projects, garden_showcases + RLS)
- Mobile : persistance AsyncStorage + `ProjectBar`

### 3. MCP Supabase + typo project ref — 19/08

**Bug critique trouvé :** ref Supabase écrite `znxtnowftyvagwwwvhka` (3× w) au lieu de `znxtnowftyvagwwvhhka` → NXDOMAIN, MCP et Vercel cassés.

**Corrections :**
- `.env.local`, Vercel env (prod/preview/dev), `.cursor/mcp.json`
- MCP basculé en **stdio + PAT** (`SUPABASE_ACCESS_TOKEN` dans `~/.zshrc`) — plus d'OAuth à chaque conversation terminal

```json
"supabase-irrigate": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase", "--project-ref=znxtnowftyvagwwvhhka"],
  "env": { "SUPABASE_ACCESS_TOKEN": "${env:SUPABASE_ACCESS_TOKEN}" }
}
```

**Vérifié via MCP :** 3 tables, RLS actif, schéma déployé.

### 4. Auth e-mail + mot de passe — 19/08 soir

**Décision :** abandon du magic link seul (inadapté app mobile + sessions).

**Implémenté :**
- `AuthPanel.tsx` web : inscription / connexion / mot de passe oublié / changement MDP
- `mobile/src/components/AuthPanel.tsx` : idem dans onglet Config
- Commit `bdae7cf` · build iOS **#11** TestFlight + vars EAS `EXPO_PUBLIC_SUPABASE_*`

**Compte admin créé :** `leo.le.coguic@gmail.com` (via API admin Supabase, profil auto `profiles`).

### 5. E-mails `@irrigate.fr` + DNS Vercel — 19/08 soir

**Contexte :** mails Supabase par défaut (`noreply@mail.app.supabase.io`) peu rassurants.

**Hostinger :**
- Service e-mail free activé sur `irrigate.fr`
- Boîte **`noreply@irrigate.fr`** créée

**Important — DNS sur Vercel, pas hPanel :**
Le domaine `irrigate.fr` utilise les NS Vercel. Les MX ajoutés dans Hostinger seuls ne suffisent pas.

Enregistrements ajoutés dans **Vercel DNS** :
| Type | Nom | Valeur |
|------|-----|--------|
| MX | `@` | `5 mx1.hostinger.com` · `10 mx2.hostinger.com` |
| TXT | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` |
| TXT | `_dmarc` | `v=DMARC1; p=none` |
| CNAME | `hostingermail-a/b/c._domainkey` | DKIM Hostinger |

**Supabase SMTP configuré** (`configure-smtp.sh`) :
- Hôte : `smtp.hostinger.com:587`
- Expéditeur : `Irrigate <noreply@irrigate.fr>`
- Templates brandés dans `supabase/emails/` (confirm-signup, recovery)

### 6. Fix reset mot de passe — 19/08 → 20/08 ✅

**Problèmes rencontrés :**
1. Lien reset → `irrigate.fr` sans formulaire (`reset=1` perdu dans callback)
2. Bouton e-mail cassé (`{{ .ConfirmationURL }}` tronqué par clients mail)
3. « Auth session missing » à l'enregistrement du nouveau MDP (cookies non écrits sur redirect)

**Corrections (commits `d080fa5` → `6acb03a`) :**

| Fix | Détail |
|-----|--------|
| Callback auth | Préserve `?reset=1` · redirect URLs `https://irrigate.fr/**` |
| Templates e-mail | Boutons → `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery` (plus `ConfirmationURL`) |
| Route `/auth/confirm` | `verifyOtp` server-side + cookies sur la réponse redirect |
| API `/api/auth/update-password` | Mise à jour MDP côté serveur (session via cookies HTTP) |
| Helper | `src/lib/supabase/route-handler.ts` (pattern SSR Supabase correct) |

**Statut :** flux reset validé par l'utilisateur le 20/08.

---

### Sync projets cloud
- Local d'abord (`irrigate:project-store` / AsyncStorage)
- Merge à la connexion via `POST /api/projects` (web) ou Supabase direct (mobile)
- Sync debounced après chaque modification (web + mobile, sept. 2026)
- RLS : `auth.uid() = user_id` sur `projects`
- IDs mobile migrés en UUID pour compatibilité Supabase

---

## Roadmap fonctionnalités — septembre 2026

> Tour des évolutions souhaitées (priorisation à valider).

### 1. Carte « Mes projets »
**Objectif :** vue d'ensemble de tous les potagers en cours (carte/liste, statut, surface, dernière modif).

| | |
|---|---|
| **Existant** | `ProjectBar` (chips horizontales web + mobile) |
| **À construire** | Écran `/compte` ou onglet dédié · carte avec mini-plan ou photo · filtres actif/archivé |
| **Données** | Table `projects` Supabase déjà prête |
| **Priorité** | 🔴 Haute — UX multi-projets |

### 2. Inventaire matériel cochable
**Objectif :** l'utilisateur coche ce qu'il possède déjà (tuyaux, goutteurs, programmateur…).

| | |
|---|---|
| **Existant** | `ProductRecommendations` calcule le matériel nécessaire par projet |
| **À construire** | Table `user_equipment` (user_id, product_sku, owned boolean) · UI checklist persistante |
| **Bénéfice** | Filtrer les achats restants · personnaliser les devis |
| **Priorité** | 🟠 Moyenne |

### 3. Export PDF liste d'achats
**Objectif :** exporter le matériel nécessaire pour un projet (PDF ou partage) pour faciliter les courses.

| | |
|---|---|
| **Existant** | Liste produits côté API `/api/products` |
| **À construire** | Génération PDF (ex. `@react-pdf/renderer` mobile, `jspdf` web) ou export CSV · bouton « Liste d'achats » |
| **Contenu PDF** | Projet, dimensions, mode irrigation, qty/prix estimés, lien irrigate.fr |
| **Priorité** | 🔴 Haute — forte valeur pratique |

### 4. Emojis + légendes dans l'onglet 3D (app)
**Objectif :** parité avec le web — toggles étiquettes (aucune / clés / toutes / légende) + emojis sur les plants.

| | |
|---|---|
| **Existant web** | `PlotView3D.tsx` — `showPlantEmojis`, modes d'étiquettes |
| **Existant mobile** | `PlotView3D.tsx` — plants 3D sans options d'affichage |
| **À construire** | Porter les contrôles web vers mobile · composants Text/Html en overlay 3D |
| **Priorité** | 🟠 Moyenne — quick win visuel |

### 5. Bibliothèque de suivi de projet (journal)
**Objectif :** documenter récoltes, difficultés, notes par potager au fil des saisons.

| | |
|---|---|
| **Existant** | Table `garden_showcases` (partage public, V2) |
| **À construire** | Table `project_journal` (project_id, date, type: harvest/issue/note, text, photos[]) · timeline dans fiche projet |
| **Priorité** | 🟠 Moyenne — différenciation long terme |

### 6. Pas-à-pas compost
**Objectif :** guides interactifs pour créer/gérer un compost (étapes, ratios, calendrier retournement).

| | |
|---|---|
| **Existant** | Rien |
| **À construire** | Contenu éditorial + wizard (type de bac, volume, matières) · option lien avec projet potager |
| **Priorité** | 🟢 Basse — contenu + UX wizard |

### 7. Perte de pression (grandes surfaces)
**Objectif :** alerter / ajuster le réseau d'irrigation pour projets > X m² (perte de pression, diamètre tuyaux).

| | |
|---|---|
| **Existant** | Moteur irrigation calcule longueur/goutteurs · pas de modèle hydraulique |
| **À construire** | Seuil configurable (ex. 20 m²) · règles diamètre/pression · warning dans `ResultsPanel` + conseil produit |
| **Priorité** | 🟠 Moyenne — crédibilité pro |

### 8. Rappel calendrier des saisons
**Objectif :** « Quand planter quoi » selon région et mois en cours.

| | |
|---|---|
| **Existant** | Catalogue variétés par région · `postalCode` → climat |
| **À construire** | Calendrier mensuel (semis/plantation/récolte) par variété · notifications optionnelles · filtre « que faire ce mois-ci » |
| **Données** | Enrichir `crops.ts` avec fenêtres de plantation |
| **Priorité** | 🔴 Haute — engagement récurrent |

### Synthèse priorités (proposition)

| Priorité | Fonctionnalité | Effort estimé |
|----------|----------------|---------------|
| P0 (ce build+) | Sync cloud mobile ✅ | Fait sept. 2026 |
| P1 | Export PDF achats | 2–3 j |
| P1 | Carte mes projets | 2–3 j |
| P1 | Calendrier saisons | 3–5 j |
| P2 | Emojis/légendes 3D mobile | 1–2 j |
| P2 | Inventaire matériel | 2–3 j |
| P2 | Perte de pression | 2–4 j |
| P2 | Journal de suivi | 3–5 j |
| P3 | Pas-à-pas compost | 5+ j (contenu) |

---

## État actuel des fonctionnalités

| Fonctionnalité | Web | iOS | Cloud |
|----------------|-----|-----|-------|
| Landing marketing + `/app` | ✅ | — | — |
| Mode invité (planificateur grisé) | ✅ | — | — |
| Porte code postal | — (réglages) | Config manuelle | — |
| Multi-projets local | ✅ localStorage | ✅ AsyncStorage | — |
| Sync cloud | ✅ debounced | ✅ Supabase direct | ✅ |
| Auth e-mail + MDP | ✅ `/compte` | ✅ onglet Config | Supabase Auth |
| Déconnexion header + compte | ✅ | ✅ | — |
| Mot de passe oublié | ✅ | ✅ (lien → web) | SMTP Irrigate |
| E-mails `@irrigate.fr` | ✅ | — | Supabase + Hostinger |
| Emojis/légendes vue 3D | ✅ | ❌ | — |
| Export PDF achats | ❌ | ❌ | — |
| Inventaire matériel | ❌ | ❌ | — |
| Carte mes projets | ❌ | ❌ | — |
| Journal / récoltes | 🔜 table prête | 🔜 | `garden_showcases` |
| Calendrier saisons | ❌ | ❌ | — |
| Perte de pression | ❌ | ❌ | — |
| Pas-à-pas compost | ❌ | ❌ | — |

---

## Structure routes web

| Route | Rôle |
|-------|------|
| `/` | Landing marketing (screenshots + photos lifestyle) |
| `/app` | Planificateur (invité grisé ou complet si connecté) |
| `/compte` | Connexion / inscription / reset MDP |
| `/auth/confirm` | Vérification token e-mail (signup, recovery) |
| `/auth/callback` | Callback PKCE legacy (signup redirect) |
| `/api/auth/update-password` | Mise à jour MDP server-side |
| `/api/projects/` | CRUD projets cloud |
| `/assistance`, `/mentions-legales`, `/confidentialite` | Pages statiques |

---

## Builds iOS récents

| Build | Date | Contenu |
|-------|------|---------|
| #11 | 19/08/2026 | Auth e-mail+MDP · vars Supabase EAS · **TestFlight actuel** |
| #10 | 19/08/2026 | Sans vars Supabase (ignoré) |
| #9 | 19/08/2026 | Fix 3D, Config UX, dimensions |

Pas de rebuild iOS nécessaire pour les fixes e-mail / reset (côté serveur + web).

---

## Scripts & docs utiles

| Fichier | Usage |
|---------|--------|
| `supabase/emails/configure-smtp.sh` | Déploie SMTP Hostinger + templates Supabase |
| `supabase/emails/deploy-templates.sh` | Templates seuls (nécessite SMTP actif) |
| `supabase/emails/recovery.html` | E-mail reset mot de passe |
| `supabase/emails/confirm-signup.html` | E-mail confirmation inscription |
| `supabase/AUTH-EMAIL.md` | Guide complet auth + DNS Vercel |
| `supabase/schema.sql` | Schéma BDD |

```bash
# Reconfigurer SMTP + templates après changement MDP boîte noreply
source ~/.zshrc
export IRRIGATE_SMTP_USER="noreply@irrigate.fr"
export IRRIGATE_SMTP_PASS="..."
./supabase/emails/configure-smtp.sh
```

---

## À faire (priorité)

### Optionnel / V2

- [ ] Créer `contact@irrigate.fr` (cité sur le site, pas encore de boîte)
- [ ] Template e-mail + test inscription nouveau compte externe
- [x] Sync cloud mobile ↔ Supabase (merge à la connexion + debounce) — sept. 2026
- [ ] Carte « Mes projets »
- [ ] Export PDF liste d'achats
- [ ] Inventaire matériel cochable
- [ ] Emojis + légendes vue 3D mobile
- [ ] Journal de suivi (récoltes / difficultés)
- [ ] Pas-à-pas compost
- [ ] Perte de pression grands projets (> X m²)
- [ ] Calendrier saisons (quand planter quoi)
- [ ] `garden_showcases` — partage réalisations potager
- [ ] DMARC `p=quarantine` ou `p=reject` une fois deliverability OK
- [ ] Régénérer PAT Supabase MCP si exposé dans un chat

### Git

- [x] Push main à jour (sync cloud sept. 2026)
- [x] Vercel prod déployée

---

## Fichiers sensibles (ne jamais committer)

- `irrigate/.env.local`
- `irrigate/mobile/.env.local`
- `SUPABASE_ACCESS_TOKEN` (MCP, `~/.zshrc`)
- `SUPABASE_SERVICE_ROLE_KEY`
- Mot de passe boîte `noreply@irrigate.fr`

Référence variables : `.env.example`

---

## Notes techniques

### Typo project ref Supabase
JWT anon key contenait le bon ref (`wwv`) mais l'URL avait `www` → tout cassait (DNS, MCP, Vercel). Toujours vérifier : `dig znxtnowftyvagwwvhhka.supabase.co`.

### MCP terminal vs IDE
OAuth MCP Supabase dans Cursor IDE ≠ session agent terminal. Solution : stdio + PAT persistant dans le shell.

### DNS e-mail irrigate.fr
NS = Vercel → MX/SPF/DKIM dans **Vercel DNS**, pas seulement hPanel Hostinger.

### E-mails auth Supabase
- Ne pas utiliser `{{ .ConfirmationURL }}` dans les `href` HTML (URLs tronquées par Gmail/Apple Mail)
- Utiliser `token_hash` + route `/auth/confirm`
- Cookies session : écrire sur `NextResponse.redirect()` via `route-handler.ts`

### Crash 3D iOS
Cause : bug `OrbitControls` / touch RN. Solution : `NativeCameraControls`.

### Sync projets cloud
- Local d'abord (`irrigate:project-store` / AsyncStorage)
- Merge à la connexion via `POST /api/projects`
- RLS : `auth.uid() = user_id` sur `projects`

---

## Contact / liens utiles

- Dashboard Supabase : https://supabase.com/dashboard/project/znxtnowftyvagwwvhhka
- TestFlight ASC : app `6802997672` · https://appstoreconnect.apple.com/apps/6802997672/testflight/ios
- hPanel e-mail : https://hpanel.hostinger.com/emails
- Vercel DNS : projet `irrigate` → domaine `irrigate.fr`
- Assistance site : https://irrigate.fr/assistance

---

## Commits clés (session 19–20/08)

| Commit | Contenu |
|--------|---------|
| `a48187d` | Porte ville + Supabase + multi-projets |
| `bdae7cf` | Auth e-mail + mot de passe (web + mobile) |
| `d080fa5` | Fix redirect reset + templates recovery |
| `5467553` | E-mails token_hash + `/auth/confirm` |
| `6acb03a` | Fix cookies session + API update-password ✅ |

---

*Dernière mise à jour : 3 septembre 2026 — sync cloud web/mobile, landing séparée, roadmap V2.*
