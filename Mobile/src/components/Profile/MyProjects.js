import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddProjectModal from "@/src/components/Sheets/AddProjectModal";
import ProjectList from "@/src/components/Profile/Projects/ProjectList";

export default function MyProjects({
  isDark,
  projects, // array: { title, price, image, description }
  App_Language,
  onAddProject, // callback when user adds a project
  onRequestProject, // callback when someone clicks Request
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "700", color: isDark ? "white" : "#111" }}>
          {App_Language.startsWith("ar") ? "مشاريعي" : "My Projects"}
        </Text>
        {/* ADD NEW PROJECT CARD */}
        {projects.length > 0 &&
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              styles.addCard,
              { backgroundColor: isDark ? "#1a1a1a" : "#e6f9f0" },
            ]}
          >
            <Ionicons name="add"
              size={24}
              color={isDark ? "#fff" : "#10b981"} />
          </TouchableOpacity>
        }
      </View>

      {/* PROJECTS LIST */}
      <ProjectList
        projects={projects}
        isDark={isDark}
        App_Language={App_Language}
        onRequestProject={onRequestProject}
        setModalVisible={(visible) => setModalVisible(visible)}
      />

      {/* ADD PROJECT MODAL */}
      <AddProjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isDark={isDark}
        App_Language={App_Language}
        onSubmit={(p) => {
          onAddProject(p);
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addCard: {
    width: 33,
    height: 33,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 160,
    padding: 12,
    borderRadius: 14,
    marginRight: 12,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  projectImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  requestBtn: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: "#10b981",
    borderRadius: 8,
    alignItems: "center",
  },
});
