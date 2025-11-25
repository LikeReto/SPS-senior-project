import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddProjectModal from "@/src/components/Sheets/AddProjectModal";
import ProjectList from "@/src/components/Profile/common/Projects/ProjectList";

export default function MyProjects({
  isDark,
  projects,
  App_Language,
  onAddProject,
  onRequestProject,
  onEditProject,
  onDeleteProject,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: isDark ? "white" : "#111",
          }}
        >
          {App_Language.startsWith("ar") ? "مشاريعي" : "My Projects"}
        </Text>

        {/* Add Button if the user ALREADY has some projects */}
        {projects.length > 0 && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              styles.addCard,
              { backgroundColor: isDark ? "#1a1a1a" : "#e6f9f0" },
            ]}
          >
            <Ionicons
              name="add"
              size={24}
              color={isDark ? "#fff" : "#10b981"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* IF user has NO projects */}
      {projects.length === 0 ? (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: isDark ? "#1a1a1a" : "#e6f9f0",
            width: 110,
            height: 140,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <Ionicons
            name="add"
            size={32}
            color={isDark ? "#fff" : "#10b981"}
          />
          <Text
            style={{ color: isDark ? "#fff" : "#10b981", marginTop: 6 }}
          >
            {App_Language.startsWith("ar") ? "أضف مشروع" : "Add Project"}
          </Text>
        </TouchableOpacity>
      ) : (
        /* User has projects → show list */
        <ProjectList
          projects={projects}
          isDark={isDark}
          isCurrentUser={true}
          App_Language={App_Language}
          onRequestProject={onRequestProject}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
        />
      )}

      {/* ADD PROJECT MODAL */}
      <AddProjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isDark={isDark}
        App_Language={App_Language}
        onSubmit={(projectData) => {
          onAddProject(projectData);
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
});
