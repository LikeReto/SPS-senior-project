import {
    StyleSheet,
    Text,
    View
} from "react-native";


export default function MyProjects({
    isDark,
    projects,
    App_Language
}) {


    return (
        < View style = {{ marginHorizontal: 20, marginTop: 20 }
}>
        <Text style={{ fontSize: 17, fontWeight: "700", color: isDark ? "white" : "#111" }}>
          {App_Language.startsWith("ar") ? "مشاريعي" : "My Projects"}
        </Text>
        <View style={styles.skills}>
          {projects.map((project, index) => (
            <View
              key={index}
              style={[styles.skillTag, { backgroundColor: isDark ? "#0f0f0f" : "#e6f9f0" }]}
            >
              <Text style={{ color: isDark ? "white" : "#10b981" }}>{project}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* if no projects, show placeholder text */}
          <Text
            style={{
              color: isDark ? "#aaa" : "#888",
              marginRight: 8,
              alignSelf: "center",
            }}
          >
            {projects.length === 0 ? App_Language.startsWith("ar") ? "لا توجد مشاريع" : "No projects " : null}
          </Text>
        </View>
      </View >

  );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    profileCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    image: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
    name: { fontSize: 18, fontWeight: "700" },
    job: { fontSize: 15, marginTop: 2 },
    infoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
    skills: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
    skillTag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginRight: 8,
        marginTop: 6,
    },
});
