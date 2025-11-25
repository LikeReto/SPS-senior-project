import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Rating from "@/src/components/common/Rating";
import DistancePill from "@/src/components/common/DistancePill";
import { DEFAULT_PROFILE_PIC } from "@/src/constants/aConstants";
import { getStatusColor } from "@/src/utils/USER/statusHelpers";

function SuggestCard({
  App_Language,
  item,
  distance,
  onPress,
  isDark,
  isCurrentUser,
  userStatus
}) {
  if (!item) return null;

  const statusColor = getStatusColor(userStatus);

  const imageUri =
    item?.User_Profile_Picture && item.User_Profile_Picture !== ""
      ? item.User_Profile_Picture
      : DEFAULT_PROFILE_PIC;

  const skills =
    Array.isArray(item?.User_Skills) && item.User_Skills.length > 0
      ? item.User_Skills.slice(0, 2).join(" • ")
      : null;

  const textColor = isDark ? "#fff" : "#111";
  const secondary = isDark ? "#b7b7b7" : "#666";

  // 🔵 Futuristic blue glow
  const neonGlow = isDark
    ? {
      shadowColor: "#3b82f6",
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
            ? "rgba(25,25,25,0.82)"
            : "rgba(255,255,255,0.92)",
          borderColor: "rgba(59,130,246,0.45)", // soft neon blue
        },
        neonGlow,
      ]}
    >
      {/* ================= TOP ================= */}
      <View style={styles.topRow}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
            style={styles.avatar}
          />

          {/* Status */}
          <View
            style={[styles.statusDot, { backgroundColor: statusColor }]}
          />
        </View>

        {/* Suggested Chip */}
        <View style={styles.suggestChip}>
          <View
            style={{
              flexDirection: "row", alignItems: "center",
            }}
          >
            <Ionicons name="sparkles" size={14} color="#3b82f6" />
            <Text style={styles.suggestText}>
              {App_Language.startsWith("ar") ? "مقترح لك" : "Suggested"}
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

      {/* ================= NAME ================= */}
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {item?.User_Name?.length > 18
          ? item.User_Name.slice(0, 18) + "…"
          : item?.User_Name}
      </Text>

      {/* ================= JOB ================= */}
      {item?.User_Job && (
        <Text
          style={[
            styles.job,
            { color: isDark ? "#3b82f6" : "#2563eb" },
          ]}
          numberOfLines={1}
        >
          {item.User_Job}
        </Text>
      )}

      {/* ================= FREELANCER BADGE ================= */}
      {item?.User_Freelancer && (
        <View style={styles.freelancerBadge}>
          <Ionicons name="star" size={13} color="#ffd700" />
          <Text style={styles.freelancerText}>
            {App_Language.startsWith("ar") ? "عمل حر" : "Freelancer"}
          </Text>
        </View>
      )}

      {/* ================= SKILLS ================= */}
      {skills && (
        <Text
          style={[styles.skills, { color: secondary }]}
          numberOfLines={2}
        >
          {skills}
        </Text>
      )}

      {/* ================= RATING ================= */}
      <Rating
        value={item?.User_Rating}
        reviews={Array.isArray(item?.User_Reviews) ? item.User_Reviews.length : 0}
        size={15}
        isDark={isDark}
      />

      {/* ================= DISTANCE ================= */}
      <DistancePill
        distance={distance}
        App_Language={App_Language}
        isDark={isDark}
      />
    </TouchableOpacity>
  );
}

export default memo(SuggestCard);

const styles = StyleSheet.create({
  card: {
    width: 185,
    borderRadius: 22,
    padding: 15,
    marginRight: 16,
    marginLeft: 8,
    borderWidth: 1.3,
    shadowOpacity: 0.23,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  /* TOP */
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  /* AVATAR */
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#e6e6e6",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    bottom: 4,
    right: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },

  /* CHIP */
  suggestChip: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(59,130,246,0.13)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  suggestText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#3b82f6",
  },

  /* TEXTS */
  name: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
  },
  job: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
  },

  /* FREELANCER */
  freelancerBadge: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,204,0,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  freelancerText: {
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 12,
    color: "#ffd700",
  },

  /* SKILLS */
  skills: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 15,
  },
});
