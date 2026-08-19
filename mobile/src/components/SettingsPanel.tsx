import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { usePlanner } from "../context/PlannerContext";
import { SOIL_ICONS, SOIL_TYPES } from "../constants/soil";
import { Card } from "./ui/Card";
import { colors } from "../theme/colors";
import type { SoilType } from "../types";

export function SettingsPanel() {
  const {
    config,
    location,
    updateConfig,
    locatePostal,
    locating,
    postalError,
  } = usePlanner();

  return (
    <Card
      title="⚙️ Réglages"
      subtitle="Votre code postal adapte le climat, les variétés et les produits."
    >
      <Text style={styles.label}>Code postal</Text>
      <Text style={styles.hint}>France métropolitaine — 5 chiffres</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={5}
        placeholder="94450"
        placeholderTextColor="#86efac"
        value={config.postalCode}
        onChangeText={(v) => {
          updateConfig({ postalCode: v.replace(/\D/g, "").slice(0, 5) });
        }}
        onBlur={() => {
          void locatePostal();
        }}
        returnKeyType="done"
        onSubmitEditing={() => {
          void locatePostal();
        }}
      />
      {postalError ? (
        <Text style={styles.error}>{postalError}</Text>
      ) : null}
      {locating ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : null}
      <View style={styles.locationBox}>
        {location ? (
          <>
            <Text style={styles.locationTitle}>
              {location.cityHint} ({location.postalCode})
            </Text>
            <Text style={styles.locationDetail}>
              {location.regionName} · {location.climateZone} ·{" "}
              {location.avgRainfallMm} mm/an · {location.frostFreeDays} j sans
              gel
            </Text>
          </>
        ) : (
          <Text style={styles.locationPlaceholder}>
            Saisissez votre code postal pour personnaliser les recommandations.
          </Text>
        )}
      </View>

      <Text style={[styles.label, { marginTop: 16 }]}>Type de terre</Text>
      <View style={styles.soilGrid}>
        {SOIL_TYPES.map((s) => {
          const selected = config.soilType === s.type;
          return (
            <Pressable
              key={s.type}
              onPress={() => updateConfig({ soilType: s.type as SoilType })}
              style={[styles.soilBtn, selected && styles.soilBtnSelected]}
            >
              <Text style={styles.soilIcon}>{SOIL_ICONS[s.type]}</Text>
              <Text style={styles.soilName}>{s.name}</Text>
              <Text style={styles.soilDesc}>{s.description}</Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: "600", color: colors.text },
  hint: { fontSize: 12, color: colors.textMuted, marginBottom: 8, marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    letterSpacing: 4,
    color: colors.text,
    backgroundColor: "#fff",
  },
  error: { color: "#b91c1c", fontSize: 13, marginTop: 6 },
  loader: { marginTop: 8 },
  locationBox: {
    marginTop: 12,
    backgroundColor: colors.bg,
    borderRadius: 10,
    padding: 12,
  },
  locationTitle: { fontWeight: "700", color: colors.text },
  locationDetail: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  locationPlaceholder: { fontSize: 13, color: colors.textMuted },
  soilGrid: { gap: 8, marginTop: 8 },
  soilBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  soilBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: "#dcfce7",
  },
  soilIcon: { fontSize: 20 },
  soilName: { fontWeight: "600", color: colors.text, marginTop: 4 },
  soilDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
