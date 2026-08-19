import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlotGrid } from "../../src/components/PlotGrid";
import { PlotSetup } from "../../src/components/PlotSetup";
import { SettingsPanel } from "../../src/components/SettingsPanel";
import { CropSelector } from "../../src/components/CropSelector";
import { IrrigationPanel } from "../../src/components/IrrigationPanel";
import { colors } from "../../src/theme/colors";

export default function ConfigScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <PlotGrid />
        <PlotSetup />
        <SettingsPanel />
        <CropSelector />
        <IrrigationPanel />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 32, gap: 16 },
});
