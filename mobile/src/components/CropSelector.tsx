import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { usePlanner } from "../context/PlannerContext";
import { Card } from "./ui/Card";
import { colors } from "../theme/colors";
import type { PublicVariety } from "../types";

export function CropSelector() {
  const {
    config,
    varieties,
    recommendedVarieties,
    varietiesRegionLabel,
    location,
    varietiesLoading,
    setSelectedVarieties,
  } = usePlanner();

  const regionLabel = location
    ? `${location.cityHint} · ${location.regionName}`
    : varietiesRegionLabel;

  const toggle = (id: string) => {
    const next = config.selectedVarieties.includes(id)
      ? config.selectedVarieties.filter((v) => v !== id)
      : [...config.selectedVarieties, id];
    setSelectedVarieties(next);
  };

  const subtitle =
    config.postalCode.length === 5 && regionLabel
      ? `Catalogue ${regionLabel} — variétés adaptées à votre climat.`
      : config.postalCode.length === 5
        ? "Variétés filtrées selon votre code postal."
        : "Entrez votre code postal pour le catalogue régional.";

  return (
    <Card title="🥕 Cultures & variétés" subtitle={subtitle}>
      {config.hasGreenhouse ? (
        <Text style={styles.serreNote}>
          Mode serre actif — variétés 🏠 disponibles
        </Text>
      ) : null}

      {varietiesLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : null}

      {!varietiesLoading &&
        config.postalCode.length === 5 &&
        varieties.length === 0 && (
          <Text style={styles.warn}>
            Aucune variété pour ce code postal — vérifiez le code saisi.
          </Text>
        )}

      {recommendedVarieties.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>Recommandées pour vous</Text>
          <View style={styles.chips}>
            {recommendedVarieties.map((v) => (
              <VarietyChip
                key={v.id}
                variety={v}
                selected={config.selectedVarieties.includes(v.id)}
                onToggle={() => toggle(v.id)}
                highlight
              />
            ))}
          </View>
        </>
      ) : null}

      {varieties.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>Toutes les variétés</Text>
          <View style={styles.chips}>
            {varieties.map((v) => (
              <VarietyChip
                key={v.id}
                variety={v}
                selected={config.selectedVarieties.includes(v.id)}
                onToggle={() => toggle(v.id)}
              />
            ))}
          </View>
        </>
      ) : null}
    </Card>
  );
}

function VarietyChip({
  variety,
  selected,
  onToggle,
  highlight,
}: {
  variety: PublicVariety;
  selected: boolean;
  onToggle: () => void;
  highlight?: boolean;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        highlight && !selected && styles.chipHighlight,
        !selected && { borderLeftColor: variety.color, borderLeftWidth: 3 },
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {variety.emoji} {variety.name}
        {variety.requiresGreenhouse ? " 🏠" : ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  serreNote: { color: "#5b21b6", fontSize: 14, marginBottom: 12 },
  warn: {
    backgroundColor: colors.amber,
    padding: 10,
    borderRadius: 8,
    color: "#92400e",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.textMuted,
    marginBottom: 8,
    marginTop: 4,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  chipHighlight: { backgroundColor: colors.amber, borderColor: colors.amberBorder },
  chipText: { fontSize: 14, color: colors.text },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
});
