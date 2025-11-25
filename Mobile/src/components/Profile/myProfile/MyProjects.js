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
  const isArabic = App_Language.startsWith("ar");

  return (
    <View style={{ marginHorizontal: 20, marginTop: 30 }}>
      
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: isDark ? "#fff" : "#111" },
          ]}
        >
          {isArabic ? "مشاريعي" : "My Projects"}
        </Text>

        {projects.length > 0 && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              styles.addBtn,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(16,185,129,0.10)",
              },
            ]}
          >
            <Ionicons
              name="add"
              size={22}
              color={isDark ? "#fff" : "#10b981"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ================= NO PROJECTS ================= */}
      {projects.length === 0 ? (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[
            styles.emptyCard,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(16,185,129,0.10)",
            },
          ]}
        >
          <Ionicons
            name="add-circle"
            size={34}
            color={isDark ? "#fff" : "#10b981"}
          />
          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              color: isDark ? "#fff" : "#10b981",
              fontWeight: "600",
            }}
          >
            {isArabic ? "أضف مشروع" : "Add Project"}
          </Text>
        </TouchableOpacity>
      ) : (
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

      {/* ================= ADD PROJECT MODAL ================= */}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
  },

  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyCard: {
    width: 130,
    height: 160,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});
