# Irrigate — application mobile (Expo)

Application React Native (Expo SDK 57) qui encapsule [irrigate.fr](https://irrigate.fr) dans une WebView native. Le moteur de calcul reste côté serveur ; l’app iOS/Android bénéficie des mises à jour web sans republier (sauf changements natifs).

## Prérequis

- Node.js 20+
- Compte [Expo](https://expo.dev)
- Compte Apple Developer + app créée sur **App Store Connect**
- `eas-cli` : `npm install -g eas-cli`

## Configuration App Store Connect

1. Notez le **Bundle ID** exact de votre app (ex. `fr.irrigate.app`).
2. Ouvrez `app.config.ts` et alignez `ios.bundleIdentifier` (et `android.package` si besoin).
3. Si votre identifiant diffère, modifiez-le **avant** le premier build EAS.

## Premier lancement local

```bash
cd mobile
npm install
npm run ios      # simulateur iOS (macOS + Xcode)
npm run android  # émulateur Android
```

Pour tester contre un serveur local :

```bash
EXPO_PUBLIC_WEB_APP_URL=http://192.168.x.x:3000 npm run ios
```

(Remplacez par l’IP LAN de votre machine où tourne `npm run dev` à la racine du monorepo.)

## Build EAS (TestFlight / App Store)

```bash
cd mobile
eas login
eas init          # lie le projet à votre compte Expo (génère projectId)
eas build --platform ios --profile production
```

Une fois le build terminé :

```bash
eas submit --platform ios --profile production
```

Expo vous demandera les identifiants Apple / l’app ASC si ce n’est pas déjà configuré. Vous pouvez aussi uploader le `.ipa` manuellement via Transporter.

### Profils EAS

| Profil        | Usage                          |
|---------------|--------------------------------|
| `development` | Dev client + simulateur        |
| `preview`     | Build interne (Ad Hoc / test)  |
| `production`  | App Store / TestFlight         |

## Variables d’environnement

| Variable                   | Défaut              | Description        |
|----------------------------|---------------------|--------------------|
| `EXPO_PUBLIC_WEB_APP_URL`  | `https://irrigate.fr` | URL chargée dans la WebView |

Pour EAS Build, définissez la variable dans le dashboard Expo ou via `eas secret:create` si vous utilisez un autre domaine de staging.

## Évolution vers du natif pur

La WebView permet une mise en store rapide. Pour des écrans 100 % natifs plus tard :

- réutiliser les routes API `https://irrigate.fr/api/*` ;
- porter progressivement les composants React (sans Three.js côté natif au départ, ou via `expo-gl` + R3F native).

## Icônes & splash

Remplacez les fichiers dans `assets/` (`icon.png`, `splash-icon.png`, etc.) avant la soumission App Store.
