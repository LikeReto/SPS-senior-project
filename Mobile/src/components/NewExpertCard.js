import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Rating from "@/src/components/common/Rating";
import DistancePill from "@/src/components/common/DistancePill";
import { DEFAULT_PROFILE_PIC } from "@/src/constants/aConstants";

function NewExpertCard({ worker, isDark, App_Language, onPress }) {
  if (!worker) return null;

  const imageUri =
    worker?.User_Profile_Picture && worker.User_Profile_Picture !== ""
      ? worker.User_Profile_Picture
      : DEFAULT_PROFILE_PIC;

  const textColor = isDark ? "#fff" : "#111";
  const secondaryText = isDark ? "#b3b3b3" : "#666";

  // Neon cyan / teal glow for "new"
  const neonGlow = isDark
    ? {
        shadowColor: "#22d3ee",
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
      }
    : {};

  // Joined label (relative)
  let joinedLabel;
  if (worker?.createdAt) {
    const created = new Date(worker.createdAt).getTime();
    const diffDays = Math.floor(
      (Date.now() - created) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 1) {
      joinedLabel = App_Language.startsWith("ar")
        ? "انضم اليوم"
        : "Joined today";
    } else if (diffDays <= 7) {
      joinedLabel = App_Language.startsWith("ar")
        ? `انضم قبل ${diffDays} أيام`
        : `Joined ${diffDays}d ago`;
    } else if (diffDays <= 30) {
      joinedLabel = App_Language.startsWith("ar")
        ? "انضم هذا الشهر"
        : "Joined this month";
    } else {
      joinedLabel = App_Language.startsWith("ar")
        ? "خبير جديد"
        : "New expert";
    }
  } else {
    joinedLabel = App_Language.startsWith("ar")
      ? "انضم مؤخراً"
      : "Recently joined";
  }

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? "rgba(17,24,39,0.78)" // dark glass blue
            : "rgba(239,246,255,0.98)", // light soft blue
          borderColor: "rgba(56,189,248,0.5)", // cyan border
        },
        neonGlow,
      ]}
    >
      {/* =============== TOP HEADER =============== */}
      <View style={styles.header}>
        {/* AVATAR */}
        <View style={styles.avatarWrapper}>
          <Image
            source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
            style={styles.avatar}
          />
        </View>

        {/* NEW CHIP */}
        <View style={styles.newChip}>
          <Ionicons name="sparkles" size={14} color="#22d3ee" />
          <Text style={styles.newText}>
            {App_Language.startsWith("ar") ? "خبير جديد" : "New Expert"}
          </Text>
        </View>
      </View>

      {/* NAME */}
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {worker.User_Name?.length > 18
          ? worker.User_Name.slice(0, 18) + "…"
          : worker.User_Name}
      </Text>

      {/* JOINED LABEL */}
      <Text style={[styles.joinedText, { color: secondaryText }]}>
        {joinedLabel}
      </Text>

      {/* JOB */}
      {worker?.User_Job && (
        <Text
          style={[
            styles.job,
            { color: isDark ? "#38bdf8" : "#0284c7" },
          ]}
          numberOfLines={1}
        >
          {worker.User_Job}
        </Text>
      )}

      {/* RATING (if exists) */}
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

export default memo(NewExpertCard);

const styles = StyleSheet.create({
  card: {
    width: 185,
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
    backgroundColor: "#1f2933",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  /* NEW CHIP */
  newChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34,211,238,0.14)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  newText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#22d3ee",
  },

  /* NAME */
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },

  joinedText: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },

  job: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 2,
    fontWeight: "600",
  },
});
