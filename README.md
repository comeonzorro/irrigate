# 💧 Irrigate

**Planificateur de potager intelligent** — définissez votre parcelle, choisissez vos cultures adaptées à votre région et obtenez un plan d'arrosage optimisé avec estimation de rendement et budget.

> MVP V1 — déployable sur Vercel en un clic.

## Fonctionnalités (V1)

- **Parcelle configurable** : largeur × longueur en mètres, vue tuiles top-down
- **Régions** : Limeil-Brévannes, Île-de-France, France (extensible)
- **Exposition solaire** : Nord, Sud, Est, Ouest (NSOE)
- **Variétés adaptées** : filtrage par région + recommandations selon l'ensoleillement
- **Modes d'irrigation** :
  - Goutte-à-goutte enterré / surface
  - Arrosage automatique (aspersion)
  - Jet d'eau (tuyau)
  - Arrosoir 6 L (temps calculé)
  - Arduino intelligent *(V2 — placeholder)*
- **Calculs** :
  - Besoins en eau (jour / semaine / mois)
  - Rendement estimé (kg et valeur €)
  - Engrais selon type de sol (NPK)
  - Coût installation + ROI

## Stack technique

| Choix | Pourquoi |
|-------|----------|
| **Next.js 16 + TypeScript** | Déploiement Vercel natif, SSR/SSG, API routes pour V2 |
| **React 19** | UI interactive type « game » (grille cliquable) |
| **Tailwind CSS 4** | UI rapide, responsive |
| **Pas de backend (V1)** | Calculs côté client, gratuit sur Vercel |

### Pourquoi pas un autre langage ?

- **Node.js / Next.js** ✅ — idéal pour Vercel, écosystème riche, Three.js pour la V2 3D
- Python (Django/FastAPI) — excellent pour ML/agronomie avancée mais moins « game-like » côté UI
- Unity/Godot — overkill pour une webapp, pas déployable sur Vercel

## Roadmap V2

- [ ] **Vue 3D** avec React Three Fiber (gratuit, open source)
- [ ] **Builder Arduino** : schéma Fritzing + BOM + code capteurs humidité
- [ ] **API météo** (Open-Meteo) pour ajuster l'arrosage en temps réel
- [ ] **Catalogue partenaire** (Jardiland, Leroy Merlin) — liens matériel
- [ ] **Base variétés** enrichie (INRAE, Kokopelli)
- [ ] **Export PDF** du plan

## Application mobile (Expo)

Application **React Native native** dans `mobile/` — voir [`mobile/README.md`](mobile/README.md) pour EAS et App Store. Pas de WebView : UI native + API irrigate.fr.

## Démarrage local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement Vercel

```bash
npx vercel
```

Ou connecter le repo GitHub/GitLab à [vercel.com](https://vercel.com).

## Architecture

```
src/
├── lib/
│   ├── types.ts           # Types métier
│   ├── data/              # Régions, cultures, irrigation, sol
│   └── engine/            # Moteur de calcul (layout, eau, rendement)
├── components/            # UI React
└── app/                   # Pages Next.js
```

## Modèle économique (vision)

1. **Gratuit** pour les particuliers (acquisition)
2. **Premium** : export PDF, Arduino builder, alertes météo
3. **B2B** : white-label pour enseignes jardinage (plans + panier matériel)

---

*Estimations agronomiques simplifiées — à affiner avec des données locales et un conseiller.*
