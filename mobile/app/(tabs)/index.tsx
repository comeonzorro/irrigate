import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlanner } from "../../src/context/PlannerContext";
import { PlotGrid } from "../../src/components/PlotGrid";
import { ResultsPanel } from "../../src/components/ResultsPanel";
import { LayoutAdviceBanner } from "../../src/components/LayoutAdviceBanner";
import { colors } from "../../src/theme/colors";

export default function PlanScreen() {
  const { planLoading } = usePlanner();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Irrigate</Text>
          <Text style={styles.heroSub}>
            Votre potager, votre arrosage, votre récolte
          </Text>
        </View>

        {planLoading ? (
          <ActivityIndicator
            color={colors.primary}
            style={styles.loader}
            accessibilityLabel="Mise à jour du plan"
          />
        ) : null}

        <LayoutAdviceBanner />
        <PlotGrid />
        <ResultsPanel />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  heroTitle: { fontSize: 24, fontWeight: "800", color: "#fff" },
  heroSub: { fontSize: 15, color: "#bbf7d0", marginTop: 6, lineHeight: 22 },
  loader: { marginBottom: 12 },
});
