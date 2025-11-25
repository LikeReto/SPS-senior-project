import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Rating from "@/src/components/common/Rating";
import DistancePill from "@/src/components/common/DistancePill";
import { DEFAULT_PROFILE_PIC } from "@/src/constants/aConstants";

function TrendingCard({ worker, isCurrentUser, isDark, App_Language, onPress }) {
  if (!worker) return null;

  const imageUri =
    worker?.User_Profile_Picture && worker.User_Profile_Picture !== ""
      ? worker.User_Profile_Picture
      : DEFAULT_PROFILE_PIC;

  const skills =
    Array.isArray(worker?.User_Skills) && worker.User_Skills.length > 0
      ? worker.User_Skills.slice(0, 2).join(" • ")
      : null;

  const textColor = isDark ? "#fff" : "#111";
  const secondaryText = isDark ? "#b3b3b3" : "#666";

  const neonGlow = isDark
    ? {
        shadowColor: "#ff6b00",
        shadowOpacity: 0.35,
        shadowRadius: 14,
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
            ? "rgba(20,20,20,0.75)"
            : "rgba(255,255,255,0.85)",
          borderColor: "rgba(255, 107, 0, 0.45)",
        },
        neonGlow,
      ]}
    >
      {/* AVATAR + TRENDING CHIP */}
      <View style={styles.topRow}>
        <View style={styles.avatarWrapper}>
          <Image
            source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
            style={styles.avatar}
          />
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.trendingChip}>
            <Ionicons name="flame" size={14} color="#ff6b00" />
            <Text style={styles.trendingText}>
              {App_Language.startsWith("ar") ? "رائج الآن" : "Trending"}
            </Text>
          </View>

          {isCurrentUser && (
            <Text
              style={[
                styles.selfTag,
                { color: isDark ? "#3b82f6" : "#2563eb" },
              ]}
            >
              {App_Language.startsWith("ar") ? "(أنت)" : "(You)"}
            </Text>
          )}
        </View>
      </View>

      {/* NAME */}
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {worker.User_Name?.length > 17
          ? worker.User_Name.slice(0, 18) + "…"
          : worker.User_Name}
      </Text>

      {/* JOB */}
      {worker?.User_Job && (
        <Text style={[styles.job, { color: isDark ? "#ff6b00" : "#ff7d1a" }]} 
        >
          {worker.User_Job}
        </Text>
      )}

      {/* SKILLS */}
      {skills && (
        <Text
          style={[styles.skills, { color: secondaryText }]}
          numberOfLines={2}
        >
          {skills}
        </Text>
      )}

      {/* RATING */}
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

export default memo(TrendingCard);

const styles = StyleSheet.create({
  card: {
    width: 175,
    padding: 14,
    borderRadius: 22,
    borderWidth: 1.3,
    marginRight: 14,
    marginLeft: 8,
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    transform: [{ scale: 0.999 }],
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  /* AVATAR */
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  trendingChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,107,0,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  trendingText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#ff6b00",
  },

  selfTag: {
    fontSize: 10,
    fontWeight: "600",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },

  job: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },

  skills: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 16,
  },
});
