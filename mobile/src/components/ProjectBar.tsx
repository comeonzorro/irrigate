import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { colors } from "../theme/colors";
import type { SavedProject } from "../lib/projectStorage";

interface ProjectBarProps {
  projects: SavedProject[];
  activeProjectId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  syncing?: boolean;
}

export function ProjectBar({
  projects,
  activeProjectId,
  onSelect,
  onCreate,
  onDelete,
  syncing,
}: ProjectBarProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>
          📁 Mes potagers{syncing ? " · sync…" : ""}
        </Text>
        <Pressable style={styles.addBtn} onPress={onCreate}>
          <Text style={styles.addBtnText}>+ Nouveau</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {projects.map((project) => {
            const selected = project.id === activeProjectId;
            return (
              <View
                key={project.id}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Pressable onPress={() => onSelect(project.id)}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {project.name}
                    {project.localOnly ? " · local" : " · ☁️"}
                  </Text>
                </Pressable>
                {projects.length > 1 ? (
                  <Pressable
                    onPress={() => onDelete(project.id)}
                    hitSlop={8}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteText}>×</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 15, fontWeight: "700", color: colors.text },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  row: { flexDirection: "row", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 6,
    backgroundColor: colors.bg,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: "#dcfce7",
  },
  chipText: { fontSize: 13, color: colors.text, fontWeight: "500" },
  chipTextSelected: { color: colors.primaryDark, fontWeight: "700" },
  deleteBtn: { paddingHorizontal: 8 },
  deleteText: { fontSize: 16, color: "#b91c1c", fontWeight: "700" },
});
