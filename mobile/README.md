# Irrigate — application mobile native (Expo)

Application **React Native** avec UI native (pas de WebView). Le moteur de calcul reste sur **irrigate.fr** via les routes API publiques.

## Architecture

| Couche | Rôle |
|--------|------|
| **Expo Router** | 4 onglets : Plan, Config, 3D, Shop |
| **Composants RN** | Formulaires, grille SVG 2D, stats, produits |
| **Three.js / R3F native** | Vue 3D (`expo-gl` + `@react-three/fiber/native`) |
| **API** | `POST /api/plan`, `/api/locate`, `/api/products`, `GET /api/varieties` |

## Prérequis

- Node.js 20+
- Compte [Expo](https://expo.dev) + `npm install -g eas-cli`
- macOS + Xcode pour simulateur iOS
- App créée sur **App Store Connect**

## Configuration

- **Bundle ID** : `com.irrigate-garden.app` (aligné App Store Connect)
- **Apple ID app** : `6802997672` (dans `eas.json` pour `eas submit`)
- **API** : `https://irrigate.fr` par défaut

Dev local :

```bash
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000 npm run ios
```

## Lancer en local

```bash
cd mobile
npm install
npm run ios
npm run android
```

## Build EAS → App Store

```bash
cd mobile
eas login
eas init
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

| Profil | Usage |
|--------|--------|
| `development` | Dev client + simulateur |
| `preview` | Test interne |
| `production` | TestFlight / App Store |

## Icônes

Remplacez les PNG dans `assets/` avant soumission (1024×1024 pour l’App Store).

## Évolution

- Écrans 100 % offline : porter le moteur en module partagé (monorepo).
- Notifications météo, export PDF, achats in-app.
