import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
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

  const isArabic = App_Language.startsWith("ar");

  const openModal = (p) => setSelectedProject(p);
  const closeModal = () => setSelectedProject(null);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {projects.map((project, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.92}
            onPress={() => openModal(project)}
            style={[
              styles.card,
              {
                backgroundColor: isDark
                  ? "rgba(25,25,25,0.75)"
                  : "rgba(255,255,255,0.92)",
                shadowColor: isDark ? "#000" : "#10b981",
              },
            ]}
          >
            {/* IMAGE */}
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: project.Project_Image }}
                style={styles.image}
              />

              {/* Fade Overlay */}
              <View style={styles.overlay} />

              {/* TYPE */}
              <View style={styles.typeBadge}>
                <Text style={styles.typeTxt}>{project.Project_Type}</Text>
              </View>

              {/* PRICE */}
              <View style={styles.priceBadge}>
                <Text style={styles.priceTxt}>
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

            {/* DESC PREVIEW */}
            <Text
              numberOfLines={1}
              style={[
                styles.desc,
                { color: isDark ? "#bbb" : "#666" },
              ]}
            >
              {project.Project_Description?.trim()
                ? project.Project_Description
                : isArabic
                ? "بدون وصف"
                : "No description"}
            </Text>

            {/* RATING PREVIEW */}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#facc15" />
              <Text
                style={{
                  marginLeft: 6,
                  color: isDark ? "#ccc" : "#444",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                4.5
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  scroll: {
    paddingVertical: 18,
    paddingLeft: 2,
  },

  card: {
    width: 185,
    borderRadius: 20,
    padding: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.35)",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  /* IMAGE */
  imageWrapper: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#ddd",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    height: "55%",
    width: "100%",
    top: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  typeBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  typeTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },

  priceBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "#10b981",
  },
  priceTxt: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
  },

  desc: {
    marginTop: 4,
    fontSize: 13,
  },

  ratingRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
});
