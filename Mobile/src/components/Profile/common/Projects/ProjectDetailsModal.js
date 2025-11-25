import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProjectDetailsModal({
  project,
  isDark,
  isCurrentUser,
  App_Language,
  onClose,
  onRequestProject,
  onDeleteProject,
  onEditProject,
}) {
  const isArabic = App_Language.startsWith("ar");

  // ⭐ Favorites (local)
  const [isFavorite, setIsFavorite] = useState(false);

  // ⭐ Share button
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${project.Project_Title}\n\n${project.Project_Description || ""
          }\n\nPrice: ${project.Project_Price} SAR`,
      });
    } catch (err) {
      console.log("Share Error:", err);
    }
  };

  // ⭐ Rating (local example)
  const [rating, setRating] = useState(4.3);

  // ⭐ MOCK REVIEWS — replace with backend later
  const reviews = [
    {
      name: "Abdullah",
      stars: 5,
      date: "2025-11-20",
      text: isArabic ? "عمل ممتاز وجودة عالية!" : "Amazing work and high quality!",
    },
    {
      name: "Sarah",
      stars: 4,
      date: "2025-11-19",
      text: isArabic
        ? "التواصل سريع والمشروع كان رهيب."
        : "Fast communication and great project.",
    },
    {
      name: "Yousef",
      stars: 4.5,
      date: "2025-11-18",
      text: isArabic ? "أنصح بالتعامل معه." : "Recommended working with him.",
    },
  ];

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <View
        style={[
          styles.overlay,
          { backgroundColor: isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.45)" },
        ]}
      >
        <View
          style={[
            styles.sheet,
            { backgroundColor: isDark ? "#0c0c0c" : "#ffffff" },
          ]}
        >
          {/* Close */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={isDark ? "#fff" : "#111"} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* IMAGE */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: project.Project_Image }} style={styles.image} />
              <View style={styles.gradientTop} />

              {/* TYPE + PRICE */}
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.16)"
                        : "rgba(0,0,0,0.16)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      { color: isDark ? "#fff" : "#111" },
                    ]}
                  >
                    {project.Project_Type}
                  </Text>
                </View>

                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>
                    {project.Project_Price} SAR
                  </Text>
                </View>
              </View>
            </View>

            {/* TITLE */}
            <Text
              style={[
                styles.title,
                { color: isDark ? "#fff" : "#111" },
              ]}
            >
              {project.Project_Title}
            </Text>

            {/* FAVORITE + SHARE ROW */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => setIsFavorite(!isFavorite)}
                style={[
                  styles.smallBtn,
                  { backgroundColor: isDark ? "#1f1f1f" : "#f1f1f1" },
                ]}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={22}
                  color={isFavorite ? "#ff4d6d" : isDark ? "#fff" : "#111"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                style={[
                  styles.smallBtn,
                  { backgroundColor: isDark ? "#1f1f1f" : "#f1f1f1" },
                ]}
              >
                <Ionicons
                  name="share-social"
                  size={20}
                  color={isDark ? "#fff" : "#111"}
                />
              </TouchableOpacity>
            </View>

            {/* RATING */}
            <View style={styles.ratingRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={
                    i + 1 <= Math.floor(rating)
                      ? "star"
                      : i + 0.5 <= rating
                        ? "star-half"
                        : "star-outline"
                  }
                  size={20}
                  color="#facc15"
                />
              ))}
              <Text
                style={{
                  color: isDark ? "#aaa" : "#444",
                  marginLeft: 6,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {rating.toFixed(1)}
              </Text>
            </View>

            {/* STATUS + DATE */}
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      project.Project_Status === "active"
                        ? "#10b981"
                        :
                        project.Project_Status === "inactive"
                          ? "#F59F0BB6"
                          : "#6B72805E"
                    ,
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {isArabic
                    ? project.Project_Status === "active"
                      ? "نشط"
                      : "غير نشط"
                    : project.Project_Status === "active"
                      ? "Active"
                      : "Inactive"}
                </Text>
              </View>

              <Text
                style={[
                  styles.dateText,
                  { color: isDark ? "#999" : "#666" },
                ]}
              >
                {new Date(project.Project_Created_At).toLocaleDateString(
                  "en-US",
                  {
                    timeZone: "Asia/Riyadh",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Text>
            </View>

            {/* BUTTONS */}
            {!isCurrentUser ? (
              <TouchableOpacity
                style={[
                  styles.requestBtn,
                  {
                    backgroundColor:
                      project.Project_Status === "active"
                        ? "#10b981"
                        : "#6b7280",

                    opacity:
                      project.Project_Status === "active" ? 1 : 0.6,
                  },
                ]}
                disabled={project.Project_Status !== "active"}
                onPress={() => {
                  onRequestProject(project);
                  onClose();
                }}
              >
                <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
                <Text style={styles.requestBtnText}>
                  {isArabic ?
                    project.Project_Status === "active" ?
                      "اطلب الآن"
                      : "غير متاح للطلب"

                    : project.Project_Status === "active" ?
                      "Request Now"
                      : "Not Available"
                  }
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 20,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
                  onPress={() => {
                    onEditProject(project);
                    onClose();
                  }}
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                  <Text style={styles.actionText}>
                    {isArabic ? "تعديل المشروع" : "Edit Project"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}
                  onPress={() => {
                    onDeleteProject(project);
                    onClose();
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text style={styles.actionText}>
                    {isArabic ? "حذف" : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* DESCRIPTION */}
            <Text
              style={[
                styles.sectionLabel,
                { color: isDark ? "#fff" : "#111" },
              ]}
            >
              {isArabic ? "الوصف" : "Description"}
            </Text>

            <Text
              style={[
                styles.description,
                { color: isDark ? "#bbb" : "#444" },
              ]}
            >
              {project.Project_Description?.trim()
                ? project.Project_Description
                : isArabic
                  ? "لا يوجد وصف لهذا المشروع."
                  : "No description provided."}
            </Text>

            {/* ⭐⭐ REVIEWS SECTION ⭐⭐ */}
            <Text
              style={[
                styles.sectionLabel,
                { marginTop: 20, color: isDark ? "#fff" : "#111" },
              ]}
            >
              {isArabic ? "التقييمات" : "Reviews"}
            </Text>

            {reviews
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((rev, i) => (
                <View
                  key={i}
                  style={[
                    styles.reviewCard,
                    {
                      backgroundColor: isDark ? "#111" : "#f7f7f7",
                      borderColor: isDark ? "#222" : "#e4e4e4",
                    },
                  ]}
                >
                  <View style={styles.reviewerRow}>
                    <Text
                      style={{
                        color: isDark ? "#fff" : "#111",
                        fontWeight: "700",
                        fontSize: 15,
                      }}
                    >
                      {rev.name}
                    </Text>

                    <Text
                      style={{
                        color: isDark ? "#888" : "#666",
                        fontSize: 12,
                      }}
                    >
                      {new Date(rev.date).toLocaleDateString("en-US")}
                    </Text>
                  </View>

                  {/* Stars */}
                  <View style={{ flexDirection: "row", marginVertical: 3 }}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Ionicons
                        key={s}
                        name={
                          s + 1 <= Math.floor(rev.stars)
                            ? "star"
                            : s + 0.5 <= rev.stars
                              ? "star-half"
                              : "star-outline"
                        }
                        size={18}
                        color="#facc15"
                      />
                    ))}
                  </View>

                  <Text
                    style={{
                      color: isDark ? "#ccc" : "#444",
                      marginTop: 4,
                      lineHeight: 20,
                      fontSize: 14,
                    }}
                  >
                    {rev.text}
                  </Text>
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    height: "90%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
  },
  closeBtn: {
    position: "absolute",
    top: -45,
    right: 20,
    zIndex: 999,
  },
  imageWrapper: {
    width: "100%",
    height: 270,
    borderRadius: 22,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    height: 90,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  badgeRow: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  priceBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: "#10b981",
    borderRadius: 10,
  },
  priceText: {
    color: "#fff",
    fontWeight: "700",
  },
  /* FAVORITE + SHARE */
  actionRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  smallBtn: {
    padding: 10,
    borderRadius: 12,
  },
  /* TEXT */
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
  },
  dateText: {
    fontSize: 13,
  },

  sectionLabel: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    marginTop: 4,
  },

  /* REVIEWS */
  reviewCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
  },
  reviewerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  /* BUTTONS */
  requestBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 40,
  },
  requestBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    marginTop: 15,
    width: "auto",
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 10,
  },
});
