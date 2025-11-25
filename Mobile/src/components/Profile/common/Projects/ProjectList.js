import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProjectDetailsModal from "./ProjectDetailsModal";

export default function ProjectList({
  projects,
  isDark,
  isCurrentUser,
  App_Language,
  onRequestProject,
  onDeleteProject,
  onEditProject,
}) {
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  const isArabic = App_Language.startsWith("ar");

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 15, paddingLeft: 2 }}
      >
        {projects.length > 0 ? (
          projects.map((project, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.9}
              onPress={() => openModal(project)}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? "#111" : "#fff",
                  shadowColor: isDark ? "#000" : "#444",
                },
              ]}
            >
              {/* IMAGE */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: project.Project_Image }}
                  style={styles.projectImage}
                />

                {/* TOP GRADIENT */}
                <View style={styles.gradientTop} />

                {/* TYPE BADGE */}
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.18)",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isDark ? "#fff" : "#fff",
                      fontWeight: "700",
                      fontSize: 11,
                    }}
                  >
                    {project.Project_Type}
                  </Text>
                </View>

                {/* PRICE BADGE */}
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>
                    {project.Project_Price} SAR
                  </Text>
                </View>
              </View>

              {/* TITLE */}
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  { color: isDark ? "#fff" : "#111" },
                ]}
              >
                {project.Project_Title}
              </Text>

              {/* SMALL DESCRIPTION PREVIEW */}
              <Text
                numberOfLines={1}
                style={[
                  styles.descPreview,
                  { color: isDark ? "#aaa" : "#666" },
                ]}
              >
                {project.Project_Description?.trim()
                  ? project.Project_Description
                  : isArabic
                  ? "بدون وصف"
                  : "No description"}
              </Text>

              {/* RATING PREVIEW (STATIC for now OR you can calculate average later) */}
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#facc15" />
                <Text
                  style={{
                    color: isDark ? "#ccc" : "#444",
                    marginLeft: 4,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  4.5
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text
            style={{
              color: isDark ? "#aaa" : "#888",
              marginTop: 15,
              marginLeft: 14,
            }}
          >
            {isArabic ? "لا توجد مشاريع" : "No projects"}
          </Text>
        )}
      </ScrollView>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isDark={isDark}
          isCurrentUser={isCurrentUser}
          App_Language={App_Language}
          onClose={closeModal}
          onRequestProject={onRequestProject}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    borderRadius: 18,
    marginRight: 16,
    padding: 10,
    paddingBottom: 12,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  imageWrapper: {
    width: "100%",
    height: 110,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
  },

  projectImage: {
    width: "100%",
    height: "100%",
  },

  gradientTop: {
    position: "absolute",
    top: 0,
    height: 55,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.32)",
  },

  typeBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 20,
  },

  priceBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#10b981",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 20,
  },

  priceText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  descPreview: {
    fontSize: 13,
    marginTop: 3,
    marginBottom: 6,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
