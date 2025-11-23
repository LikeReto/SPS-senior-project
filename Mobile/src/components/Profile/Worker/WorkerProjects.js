// src/components/Profile/WorkerProjects.js
import { StyleSheet, Text, View } from "react-native";

export default function WorkerProjects({ isDark, projects, App_Language }) {
  return (
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      <Text
        style={[styles.title, { color: isDark ? "white" : "#111" }]}
      >
        {App_Language.startsWith("ar") ? "المشاريع" : "Projects"}
      </Text>

      <View style={styles.container}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <View
              key={index}
              style={[
                styles.tag,
                { backgroundColor: isDark ? "#0f0f0f" : "#e6f9f0" },
              ]}
            >
              <Text style={{ color: isDark ? "white" : "#10b981" }}>
                {project}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: isDark ? "#aaa" : "#888", marginTop: 10 }}>
            {App_Language.startsWith("ar")
              ? "لا توجد مشاريع"
              : "No projects"}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: "700" },
  container: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 6,
  },
});
