import { View, Text, Pressable, StyleSheet } from "react-native";
import { usePlanner } from "../context/PlannerContext";
import { IRRIGATION_MODES } from "../constants/irrigation";
import { Card } from "./ui/Card";
import { colors } from "../theme/colors";
import type { IrrigationModeId } from "../types";

export function IrrigationPanel() {
  const { config, updateConfig } = usePlanner();

  return (
    <Card
      title="💧 Mode d'irrigation"
      subtitle="Comparez installation, eau consommée et temps passé."
    >
      {IRRIGATION_MODES.map((mode) => {
        const selected = config.irrigationModeId === mode.id;
        const disabled = !mode.available;
        return (
          <Pressable
            key={mode.id}
            disabled={disabled}
            onPress={() =>
              updateConfig({ irrigationModeId: mode.id as IrrigationModeId })
            }
            style={[
              styles.mode,
              selected && styles.modeSelected,
              disabled && styles.modeDisabled,
            ]}
          >
            <View style={styles.modeHeader}>
              <Text style={[styles.modeName, disabled && styles.modeNameDisabled]}>
                {mode.name}
              </Text>
              {mode.v2 ? (
                <Text style={styles.badge}>V2</Text>
              ) : null}
            </View>
            <Text style={styles.modeDesc}>{mode.description}</Text>
            <Text style={styles.modeMeta}>
              Efficacité {(mode.efficiency * 100).toFixed(0)}% · ~
              {mode.setupCostPerM2} €/m²
            </Text>
          </Pressable>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  mode: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  modeSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.bg,
    borderWidth: 2,
  },
  modeDisabled: { opacity: 0.5 },
  modeHeader: { flexDirection: "row", justifyContent: "space-between" },
  modeName: { fontWeight: "600", color: colors.text, flex: 1 },
  modeNameDisabled: { color: "#9ca3af" },
  badge: {
    backgroundColor: colors.violet,
    color: "#5b21b6",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  modeDesc: { fontSize: 13, color: colors.textMuted, marginTop: 6, lineHeight: 18 },
  modeMeta: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
});
