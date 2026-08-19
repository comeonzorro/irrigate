import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const WEB_APP_URL =
  (Constants.expoConfig?.extra?.webAppUrl as string | undefined) ??
  "https://irrigate.fr";

export default function App() {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setError(null);
    setLoading(true);
    webRef.current?.reload();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <StatusBar style="dark" />
        <View style={styles.webContainer}>
          <WebView
            ref={webRef}
            source={{ uri: WEB_APP_URL }}
            style={styles.webview}
            onLoadStart={() => {
              setLoading(true);
              setError(null);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() =>
              setError(
                "Impossible de charger l'application. Vérifiez votre connexion."
              )
            }
            onHttpError={() =>
              setError("Le serveur Irrigate ne répond pas pour le moment.")
            }
            allowsBackForwardNavigationGestures
            pullToRefreshEnabled={false}
            setSupportMultipleWindows={false}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            originWhitelist={["https://*", "http://*"]}
            decelerationRate={Platform.OS === "ios" ? "normal" : undefined}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />

          {loading && !error && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#15803d" />
              <Text style={styles.overlayText}>Chargement…</Text>
            </View>
          )}

          {error && (
            <View style={styles.overlay}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={reload} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ecfdf5",
  },
  webContainer: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  webview: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(240, 253, 244, 0.92)",
    paddingHorizontal: 24,
    gap: 12,
  },
  overlayText: {
    color: "#14532d",
    fontSize: 15,
  },
  errorText: {
    color: "#14532d",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: "#15803d",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
