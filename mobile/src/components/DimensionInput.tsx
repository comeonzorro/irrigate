import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

interface DimensionInputProps {
  label: string;
  value: number;
  onCommit: (value: number) => void;
  min?: number;
  max?: number;
}

export function DimensionInput({
  label,
  value,
  onCommit,
  min = 1,
  max = 50,
}: DimensionInputProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = () => {
    const normalized = draft.replace(",", ".").trim();
    if (normalized === "" || normalized === ".") {
      setDraft(String(value));
      return;
    }
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    onCommit(clamped);
    setDraft(String(clamped));
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={draft}
        onChangeText={setDraft}
        onBlur={commitDraft}
        onSubmitEditing={commitDraft}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
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
});
