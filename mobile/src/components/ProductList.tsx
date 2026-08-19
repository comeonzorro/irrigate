import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { usePlanner } from "../context/PlannerContext";
import { Card } from "./ui/Card";
import { colors } from "../theme/colors";
import type { RecommendedProduct } from "../types";

const CATEGORY_LABELS: Record<RecommendedProduct["category"], string> = {
  irrigation: "💧 Irrigation",
  semence: "🌱 Semences & plants",
  engrais: "🧪 Engrais",
  outil: "🛠️ Outils",
};

export function ProductList() {
  const { products, productsLoading, location } = usePlanner();

  const subtitle = location
    ? `Suggestions adaptées à ${location.regionName}.`
    : "Entrez votre code postal pour des recommandations localisées.";

  return (
    <Card title="🛒 Produits recommandés" subtitle={subtitle}>
      {productsLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : null}

      {!productsLoading && products.length === 0 ? (
        <Text style={styles.empty}>
          Sélectionnez des cultures et un mode d'irrigation pour voir des
          produits adaptés.
        </Text>
      ) : null}

      {products.map((p) => (
        <View key={p.id} style={styles.item}>
          <View style={styles.itemHeader}>
            <View style={styles.itemLeft}>
              <Text style={styles.category}>{CATEGORY_LABELS[p.category]}</Text>
              <Text style={styles.name}>{p.name}</Text>
            </View>
            <Text style={styles.price}>~{p.priceEstimate} €</Text>
          </View>
          <Text style={styles.desc}>{p.description}</Text>
          <Text style={styles.reason}>
            <Text style={styles.bold}>Pourquoi :</Text> {p.reason}
          </Text>
          <Text style={styles.hint}>{p.shopHint}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  empty: {
    backgroundColor: colors.bg,
    padding: 16,
    borderRadius: 10,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  item: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  itemLeft: { flex: 1 },
  category: { fontSize: 11, fontWeight: "600", color: colors.textMuted },
  name: { fontSize: 16, fontWeight: "600", color: colors.text, marginTop: 2 },
  price: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: "700",
    color: colors.text,
    fontSize: 14,
    overflow: "hidden",
  },
  desc: { fontSize: 14, color: colors.textMuted, marginTop: 8, lineHeight: 20 },
  reason: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  bold: { fontWeight: "700" },
  hint: { fontSize: 11, color: "#6b7280", marginTop: 4 },
});
