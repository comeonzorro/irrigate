import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlotView3D } from "../../src/components/PlotView3D";
import { colors } from "../../src/theme/colors";

export default function View3DScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <PlotView3D />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
});
