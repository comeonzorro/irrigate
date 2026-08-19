import { View, Text, StyleSheet } from "react-native";
import { usePlanner } from "../context/PlannerContext";
import { getIrrigationMode } from "../constants/irrigation";
import { Card, Stat } from "./ui/Card";
import { colors } from "../theme/colors";

export function ResultsPanel() {
  const { config, plan } = usePlanner();
  const mode = getIrrigationMode(config.irrigationModeId);

  return (
    <Card title="📊 Arrosage & rentabilité">
      <Text style={styles.section}>Eau</Text>
      <View style={styles.grid}>
        <Stat label="Par jour" value={plan.water.litersPerDay} unit="L" />
        <Stat label="Par semaine" value={plan.water.litersPerWeek} unit="L" />
        <Stat label="Par mois" value={plan.water.litersPerMonth} unit="L" />
        <Stat
          label="Coût eau/mois"
          value={plan.water.estimatedWaterCostMonthly}
          unit="€"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{mode?.name}</Text> —{" "}
          {plan.water.sessionsPerWeek} sessions/sem · ~
          {plan.water.minutesPerSession} min/session
          {plan.water.wateringCanTrips !== undefined
            ? ` · ${plan.water.wateringCanTrips} arrosoirs/sem`
            : ""}
        </Text>
      </View>

      <Text style={styles.section}>Réseau</Text>
      <View style={styles.grid}>
        <Stat
          label="Longueur"
          value={plan.irrigation.totalPipeLengthM}
          unit="m"
        />
        <Stat label="Goutteurs" value={plan.irrigation.dripperCount || "—"} />
      </View>

      <Text style={styles.section}>Rendement estimé</Text>
      <View style={styles.grid}>
        <Stat label="Par jour" value={plan.yield.kgPerDay} unit="kg" />
        <Stat label="Par semaine" value={plan.yield.kgPerWeek} unit="kg" />
        <Stat
          label="Par mois"
          value={plan.yield.kgPerMonth}
          unit="kg"
          highlight
        />
      </View>

      <Text style={styles.section}>Valeur marchande</Text>
      <View style={styles.grid}>
        <Stat label="Par jour" value={plan.yield.revenuePerDay} unit="€" />
        <Stat label="Par semaine" value={plan.yield.revenuePerWeek} unit="€" />
        <Stat
          label="Par mois"
          value={plan.yield.revenuePerMonth}
          unit="€"
          highlight
        />
      </View>

      <Text style={styles.section}>Engrais</Text>
      <View style={styles.fertBox}>
        <Text style={styles.fertTitle}>
          {plan.fertilizer.type} — NPK {plan.fertilizer.npk}
        </Text>
        <Text style={styles.fertMeta}>
          {plan.fertilizer.amountKg} kg · {plan.fertilizer.frequency} · ~
          {plan.fertilizer.costEstimate} €/saison
        </Text>
        {plan.fertilizer.notes ? (
          <Text style={styles.fertNotes}>{plan.fertilizer.notes}</Text>
        ) : null}
      </View>

      <Text style={styles.section}>Budget</Text>
      <View style={styles.grid}>
        <Stat label="Installation" value={plan.setupCost} unit="€" />
        <Stat
          label="Coût mensuel"
          value={plan.monthlyOperatingCost}
          unit="€"
        />
        <Stat
          label="Rentabilité"
          value={
            plan.breakEvenMonths === Infinity ? "—" : plan.breakEvenMonths
          }
          unit={plan.breakEvenMonths === Infinity ? "" : "mois ROI"}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  infoBox: {
    backgroundColor: colors.sky,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  infoText: { fontSize: 13, color: "#0c4a6e", lineHeight: 20 },
  bold: { fontWeight: "700" },
  fertBox: {
    borderWidth: 1,
    borderColor: colors.amberBorder,
    backgroundColor: colors.amber,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  fertTitle: { fontWeight: "600", color: "#92400e" },
  fertMeta: { fontSize: 13, color: "#92400e", marginTop: 4 },
  fertNotes: { fontSize: 12, color: "#b45309", marginTop: 8, lineHeight: 18 },
});
