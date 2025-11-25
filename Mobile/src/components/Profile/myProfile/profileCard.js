import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStatusColor } from "@/src/utils/USER/statusHelpers";

export default function MyProfileCard({
  isDark,
  currentUser,
  currentUser_Data,
  liveStatus,
  App_Language,
}) {
  const isArabic = App_Language.startsWith("ar");

  const textColor = isDark ? "#fff" : "#111";
  const subText = isDark ? "#bbb" : "#666";

  const img = currentUser_Data?.User_Profile_Picture;

  const neonShadow = getStatusColor(liveStatus)

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? "rgba(22,22,22,0.85)"
            : "rgba(255,255,255,0.95)",
          borderTopColor: neonShadow,
        },
      ]}
    >
      {/* COVER */}
      <View
        style={[
          styles.cover,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      />

      {/* PROFILE IMAGE */}
      <View style={styles.avatarWrapper}>
        {img ? (
          <Image source={{ uri: img }} style={styles.avatar} />
        ) : (
          <Ionicons
            name="person-circle"
            size={88}
            color={isDark ? "#888" : "#444"}
          />
        )}
      </View>

      {/* USER INFO */}
      <View style={{ marginTop: 45, alignItems: "center" }}>
        {/* NAME + VERIFIED */}
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: textColor }]}>
            {currentUser?.name?.length > 16
              ? currentUser.name.slice(0, 16) + "…"
              : currentUser?.name}
          </Text>

          {currentUser_Data?.User_VerifiedBadge && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#42C1FC"
              style={{ marginLeft: 6 }}
            />
          )}
        </View>

        {/* JOB */}
        <Text style={[styles.job, { color: isDark ? "#10b981" : "#059669" }]}>
          {currentUser_Data?.User_Job ||
            (isArabic ? "بدون وظيفة" : "No job listed")}
        </Text>

        {/* FREELANCER BADGE */}
        {currentUser_Data?.User_Freelancer && (
          <View style={styles.freelancerBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.freelancerText}>
              {isArabic ? "مستقل" : "Freelancer"}
            </Text>
          </View>
        )}
      </View>

      {/* CONTACT INFO */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons
            name="call-outline"
            size={20}
            color={isDark ? "#10b981" : "#059669"}
          />
          <Text style={[styles.infoText, { color: textColor }]}>
            {currentUser_Data?.User_PhoneNumber || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="school-outline"
            size={20}
            color={isDark ? "#10b981" : "#059669"}
          />
          <Text style={[styles.infoText, { color: textColor }]}>
            {currentUser_Data?.User_Degree || "N/A"}
          </Text>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: textColor }]}>
            {currentUser_Data?.User_Projects?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: subText }]}>
            {isArabic ? "مشاريع" : "Projects"}
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="star" size={14} color="#FACC15" />
            <Text
              style={[
                styles.statNumber,
                { marginLeft: 4, color: textColor },
              ]}
            >
              {currentUser_Data?.User_Rating || 4.7}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: subText }]}>
            {isArabic ? "التقييم" : "Rating"}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: textColor }]}>
            {currentUser_Data?.User_JobsDone || 0}
          </Text>
          <Text style={[styles.statLabel, { color: subText }]}>
            {isArabic ? "منجز" : "Completed"}
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 24,
    paddingBottom: 28,
    overflow: "hidden",
    borderWidth: 1.3,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  /* COVER */
  cover: {
    width: "100%",
    height: 105,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  /* AVATAR */
  avatarWrapper: {
    width: 94,
    height: 94,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#333",
    position: "absolute",
    alignSelf: "center",
    top: 55,
    borderWidth: 3,
    borderColor: "rgba(16,185,129,0.45)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },

  /* NAME */
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
  },

  job: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },

  freelancerBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(255,215,0,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  freelancerText: {
    marginLeft: 6,
    color: "#FFD700",
    fontWeight: "700",
    fontSize: 12,
  },

  /* INFO ROWS */
  infoSection: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },

  /* STATS */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 17,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 13,
    marginTop: 3,
  },
});
