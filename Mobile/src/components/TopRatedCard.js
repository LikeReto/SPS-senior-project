import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Rating from "@/src/components/common/Rating";
import DistancePill from "@/src/components/common/DistancePill";
import { DEFAULT_PROFILE_PIC } from "@/src/constants/aConstants";

function TopRatedCard({ worker, isDark, App_Language, onPress }) {
  if (!worker) return null;

  const imageUri =
    worker?.User_Profile_Picture && worker.User_Profile_Picture !== ""
      ? worker.User_Profile_Picture
      : DEFAULT_PROFILE_PIC;

  const textColor = isDark ? "#fff" : "#111";
  const secondaryText = isDark ? "#b3b3b3" : "#666";

  // Neon gold glow for dark mode
  const neonGlow = isDark
    ? {
        shadowColor: "#facc15",
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
      }
    : {};

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? "rgba(25,25,25,0.75)"
            : "rgba(255,255,255,0.90)",
          borderColor: "rgba(250,204,21,0.4)", // soft gold border
        },
        neonGlow,
      ]}
    >
      {/* ================= TOP HEADER ================= */}
      <View style={styles.header}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
            style={styles.avatar}
          />
        </View>

        {/* GOLD Badge */}
        <View style={styles.goldChip}>
          <Ionicons name="trophy" size={14} color="#facc15" />
          <Text style={styles.goldText}>
            {App_Language.startsWith("ar") ? "الأعلى تقييماً" : "Top Rated"}
          </Text>
        </View>
      </View>

      {/* NAME */}
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {worker.User_Name?.length > 18
          ? worker.User_Name.slice(0, 18) + "…"
          : worker.User_Name}
      </Text>

      {/* JOB TITLE */}
      {worker?.User_Job && (
        <Text
          style={[
            styles.job,
            { color: isDark ? "#facc15" : "#b7791f" },
          ]}
          numberOfLines={1}
        >
          {worker.User_Job}
        </Text>
      )}

      {/* STAR SYSTEM */}
      <Rating
        value={worker?.User_Rating}
        reviews={
          Array.isArray(worker?.User_Reviews)
            ? worker.User_Reviews.length
            : 0
        }
        size={15}
        isDark={isDark}
      />

      {/* DISTANCE */}
      <DistancePill
        distance={worker?.distance}
        App_Language={App_Language}
        isDark={isDark}
      />
    </TouchableOpacity>
  );
}

export default memo(TopRatedCard);

const styles = StyleSheet.create({
  card: {
    width: 175,
    padding: 14,
    borderRadius: 22,
    marginRight: 14,
    marginLeft: 8,
    borderWidth: 1.3,
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  /* AVATAR */
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  /* GOLD CHIP */
  goldChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(250,204,21,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  goldText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#facc15",
  },

  /* NAME */
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },

  /* RATING ROW */
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
  },

  /* JOB */
  job: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 2,
    fontWeight: "600",
  },
});
