import { View, Text, TextInput, Pressable, Switch, StyleSheet } from "react-native";
import { usePlanner } from "../context/PlannerContext";
import { Card } from "./ui/Card";
import { colors } from "../theme/colors";
import type { SunExposure } from "../types";

const SUN_OPTIONS: {
  value: SunExposure;
  label: string;
  icon: string;
  desc: string;
}[] = [
  { value: "S", label: "Sud", icon: "☀️", desc: "Ensoleillement maximal" },
  { value: "E", label: "Est", icon: "🌅", desc: "Soleil matinal" },
  { value: "O", label: "Ouest", icon: "🌇", desc: "Soleil après-midi" },
  { value: "N", label: "Nord", icon: "🌥️", desc: "Ombre / mi-ombre" },
];

export function PlotSetup() {
  const { config, updateConfig } = usePlanner();
  const area = (config.widthM * config.lengthM).toFixed(1);

  return (
    <Card title="🌱 Dimensions de la parcelle">
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Largeur (m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={String(config.widthM)}
            onChangeText={(v) =>
              updateConfig({ widthM: Math.min(50, Math.max(1, Number(v) || 1)) })
            }
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Longueur (m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={String(config.lengthM)}
            onChangeText={(v) =>
              updateConfig({
                lengthM: Math.min(50, Math.max(1, Number(v) || 1)),
              })
            }
          />
        </View>
      </View>
      <Text style={styles.area}>
        Surface : <Text style={styles.areaBold}>{area} m²</Text>
      </Text>

      <Text style={[styles.label, { marginTop: 16 }]}>Exposition au soleil</Text>
      <View style={styles.sunGrid}>
        {SUN_OPTIONS.map((opt) => {
          const selected = config.sunExposure === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => updateConfig({ sunExposure: opt.value })}
              style={[styles.sunBtn, selected && styles.sunBtnSelected]}
            >
              <Text style={styles.sunIcon}>
                {opt.icon} {opt.label}
              </Text>
              <Text style={styles.sunDesc}>{opt.desc}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.greenhouse}>
        <View style={styles.greenhouseText}>
          <Text style={styles.greenhouseTitle}>🏠 Serre ou tunnel</Text>
          <Text style={styles.greenhouseDesc}>
            Débloque tomates, poivrons, melons… Idéal en Bretagne ou climats
            frais.
          </Text>
        </View>
        <Switch
          value={config.hasGreenhouse}
          onValueChange={(v) => updateConfig({ hasGreenhouse: v })}
          trackColor={{ false: "#d8b4fe", true: "#7c3aed" }}
          thumbColor="#fff"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: "#fff",
  },
  area: { marginTop: 8, fontSize: 14, color: colors.textMuted },
  areaBold: { fontWeight: "700", color: colors.text },
  sunGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  sunBtn: {
    width: "48%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
    backgroundColor: colors.bg,
  },
  sunBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: "#dcfce7",
  },
  sunIcon: { fontSize: 14, fontWeight: "600", color: colors.text },
  sunDesc: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  greenhouse: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.violetBorder,
    backgroundColor: colors.violet,
    borderRadius: 12,
    padding: 14,
  },
  greenhouseText: { flex: 1 },
  greenhouseTitle: { fontWeight: "600", color: "#4c1d95" },
  greenhouseDesc: { fontSize: 13, color: "#5b21b6", marginTop: 4, lineHeight: 18 },
});
