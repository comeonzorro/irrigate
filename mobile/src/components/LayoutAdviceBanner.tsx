import { View, Text, Pressable, StyleSheet } from "react-native";
import { usePlanner } from "../context/PlannerContext";
import { colors } from "../theme/colors";

const STATUS_STYLES = {
  ok: { bg: "#ecfdf5", border: colors.border, icon: "✅", title: "Répartition OK" },
  tight: {
    bg: colors.amber,
    border: colors.amberBorder,
    icon: "⚠️",
    title: "Parcelle un peu juste",
  },
  overflow: {
    bg: colors.red,
    border: colors.redBorder,
    icon: "🚫",
    title: "Surface insuffisante",
  },
};

export function LayoutAdviceBanner() {
  const { config, plan, updateConfig, setSelectedVarieties } = usePlanner();
  const advice = plan.layoutAdvice;

  if (config.selectedVarieties.length === 0) return null;

  const style = STATUS_STYLES[advice.status];
  const hasSuggestion =
    advice.suggestedWidthM !== undefined &&
    advice.suggestedLengthM !== undefined;

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: style.bg, borderColor: style.border },
      ]}
    >
      <Text style={styles.title}>
        {style.icon} {style.title}
      </Text>
      <Text style={styles.message}>{advice.message}</Text>

      {advice.varieties.length > 1 ? (
        <View style={styles.list}>
          {advice.varieties.map((v) => (
            <Text key={v.varietyId} style={styles.listItem}>
              {v.emoji}{" "}
              <Text style={styles.bold}>{v.name.split(" «")[0]}</Text>
              {" — "}
              {v.placed === 0
                ? "0 plant (pas de place)"
                : `${v.placed} plant${v.placed > 1 ? "s" : ""}${
                    v.zoneAreaM2 !== undefined
                      ? ` · bande ~${v.zoneAreaM2} m²`
                      : ""
                  }`}
            </Text>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        {hasSuggestion && advice.status !== "ok" ? (
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              updateConfig({
                widthM: advice.suggestedWidthM!,
                lengthM: advice.suggestedLengthM!,
              })
            }
          >
            <Text style={styles.primaryBtnText}>
              Agrandir à {advice.suggestedWidthM} × {advice.suggestedLengthM} m
            </Text>
          </Pressable>
        ) : null}

        {advice.unplacedVarietyIds && advice.unplacedVarietyIds.length > 0 ? (
          <Pressable
            style={styles.secondaryBtn}
            onPress={() =>
              setSelectedVarieties(
                config.selectedVarieties.filter(
                  (id) => !advice.unplacedVarietyIds!.includes(id)
                )
              )
            }
          >
            <Text style={styles.secondaryBtnText}>
              Retirer les espèces sans place ({advice.unplacedVarietyIds.length})
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: { fontWeight: "700", fontSize: 16, color: colors.text },
  message: { fontSize: 14, color: colors.text, marginTop: 6, lineHeight: 20 },
  list: { marginTop: 12, gap: 6 },
  listItem: { fontSize: 14, color: colors.text, lineHeight: 20 },
  bold: { fontWeight: "700" },
  actions: { marginTop: 14, gap: 8 },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.redBorder,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#991b1b", fontWeight: "600", fontSize: 14 },
});
