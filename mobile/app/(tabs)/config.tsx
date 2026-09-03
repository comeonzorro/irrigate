import { ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsPanel } from "../../src/components/SettingsPanel";
import { PlotSetup } from "../../src/components/PlotSetup";
import { CropSelector } from "../../src/components/CropSelector";
import { IrrigationPanel } from "../../src/components/IrrigationPanel";
import { PlotGrid } from "../../src/components/PlotGrid";
import { AuthPanel } from "../../src/components/AuthPanel";
import { ProjectBar } from "../../src/components/ProjectBar";
import { usePlanner } from "../../src/context/PlannerContext";
import { colors } from "../../src/theme/colors";

export default function ConfigScreen() {
  const {
    projects,
    activeProjectId,
    syncing,
    selectProject,
    createProject,
    deleteProject,
  } = usePlanner();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <AuthPanel />
        <ProjectBar
          projects={projects}
          activeProjectId={activeProjectId}
          syncing={syncing}
          onSelect={(id) => void selectProject(id)}
          onCreate={() => void createProject()}
          onDelete={(id) => {
            Alert.alert(
              "Supprimer ce potager ?",
              "Cette action est irréversible.",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Supprimer",
                  style: "destructive",
                  onPress: () => void deleteProject(id),
                },
              ]
            );
          }}
        />
        <PlotGrid />
        <PlotSetup />
        <SettingsPanel />
        <CropSelector />
        <IrrigationPanel />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 32, gap: 16 },
});
