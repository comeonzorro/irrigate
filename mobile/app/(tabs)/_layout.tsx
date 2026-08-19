import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "../../src/theme/colors";

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: colors.border,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Plan",
          tabBarIcon: () => <TabIcon emoji="🗺️" />,
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Config",
          tabBarIcon: () => <TabIcon emoji="⚙️" />,
        }}
      />
      <Tabs.Screen
        name="view3d"
        options={{
          title: "3D",
          tabBarIcon: () => <TabIcon emoji="🏗️" />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Shop",
          tabBarIcon: () => <TabIcon emoji="🛒" />,
        }}
      />
    </Tabs>
  );
}
