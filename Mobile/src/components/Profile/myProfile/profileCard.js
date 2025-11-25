import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MyProfileCard({
  isDark,
  currentUser,
  currentUser_Data,
  App_Language,
}) {
  const isArabic = App_Language.startsWith("ar");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#0f0f0f" : "#ffffff",
          shadowColor: isDark ? "#000" : "#555",
        },
      ]}
    >
      {/* COVER + PROFILE IMAGE */}
      <View style={styles.headerArea}>
        {/* COVER */}
        <View
          style={[
            styles.cover,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        />

        {/* PROFILE IMAGE */}
        <View style={styles.profileWrapper}>
          {currentUser_Data?.User_Profile_Picture ? (
            <Image
              source={{ uri: currentUser_Data.User_Profile_Picture }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons
              name="person-circle"
              size={88}
              color={isDark ? "#999" : "#444"}
            />
          )}
        </View>
      </View>

      {/* NAME + VERIFIED */}
      <View style={{ alignItems: "center", marginTop: 45 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={[
              styles.name,
              { color: isDark ? "#fff" : "#111" },
            ]}
          >
            {currentUser?.name?.length > 15
              ? currentUser.name.slice(0, 15) + "…"
              : currentUser?.name}
          </Text>

          {currentUser_Data?.User_VerifiedBadge && (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color="#42C1FCFF"
              style={{ marginLeft: 6 }}
            />
          )}
        </View>

        {/* JOB */}
        <Text
          style={[
            styles.job,
            {
              color: isDark ? "#10b981" : "#00a36c",
            },
          ]}
        >
          {currentUser_Data?.User_Job || (isArabic ? "بدون وظيفة" : "No job listed")}
        </Text>

        {/* BADGE */}
        {currentUser_Data?.User_Freelancer && (
          <View style={styles.freelancerBadge}>
            <Ionicons
              name="star"
              size={14}
              color="#ffcc00"
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: "#ffcc00", fontWeight: "700" }}>
              {isArabic ? "مستقل" : "Freelancer"}
            </Text>
          </View>
        )}
      </View>

      {/* INFO ROWS */}
      <View style={{ marginTop: 18, width: "100%", paddingHorizontal: 20 }}>
        {/* PHONE */}
        <View style={styles.infoRow}>
          <Ionicons
            name="call-outline"
            size={20}
            color={isDark ? "#10b981" : "#00a36c"}
          />
          <Text
            style={[
              styles.infoText,
              { color: isDark ? "#fff" : "#111" },
            ]}
          >
            {currentUser_Data?.User_PhoneNumber || "N/A"}
          </Text>
        </View>

        {/* DEGREE */}
        <View style={styles.infoRow}>
          <Ionicons
            name="school-outline"
            size={20}
            color={isDark ? "#10b981" : "#00a36c"}
          />
          <Text
            style={[
              styles.infoText,
              { color: isDark ? "#fff" : "#111" },
            ]}
          >
            {currentUser_Data?.User_Degree || "N/A"}
          </Text>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statNumber,
              { color: isDark ? "#fff" : "#111" },
            ]}
          >
            {currentUser_Data?.User_Projects?.length || 0}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#aaa" : "#555" },
            ]}
          >
            {isArabic ? "مشاريع" : "Projects"}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text
            style={[
              styles.statNumber,
              { color: isDark ? "#fff" : "#111" },
            ]}
          >
            <Ionicons name="star" size={14} color="#facc15" />
            {currentUser_Data?.User_Rating || 4.7}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#aaa" : "#555" },
            ]}
          >
            {isArabic ? "التقييم" : "Rating"}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text
            style={[
              styles.statNumber,
              { color: isDark ? "#fff" : "#111" },
            ]}
          >
            {currentUser_Data?.User_JobsDone || 0}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#aaa" : "#555" },
            ]}
          >
            {isArabic ? "منجز" : "Completed"}
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    paddingBottom: 25,
    overflow: "hidden",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },

  headerArea: {
    width: "100%",
    height: 100,
  },

  cover: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  profileWrapper: {
    position: "absolute",
    bottom: -40,
    alignSelf: "center",
    width: 90,
    height: 90,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#aaa",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
  },

  job: {
    fontSize: 14,
    marginTop: 6,
  },

  freelancerBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(255, 204, 0, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 14,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 16,
    fontWeight: "800",
  },

  statLabel: {
    fontSize: 13,
    marginTop: 3,
  },
});
