import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getStatusColor } from "@/src/utils/USER/statusHelpers";
import { DEFAULT_PROFILE_PIC } from "@/src/constants/aConstants";
import Rating from "@/src/components/common/Rating";
import DistancePill from "@/src/components/common/DistancePill";


function SuggestCard({ App_Language, item, distance, onPress, isDark, isCurrentUser, userStatus }) {
  if (!item) return null;

  const statusColor = getStatusColor(userStatus);

  // ⭐ SAFE IMAGE
  const imageUri =
    item?.User_Profile_Picture && item.User_Profile_Picture !== ""
      ? item.User_Profile_Picture
      : DEFAULT_PROFILE_PIC;

  // ⭐ SKILLS PREVIEW
  const skills =
    Array.isArray(item?.User_Skills) && item.User_Skills?.length > 0
      ? item.User_Skills.slice(0, 2).join(" • ")
      : null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1a1a1a" : "#fff",
          borderColor: isCurrentUser ? "#10b981" : "#BB1313FF",
          shadowColor: isDark ? "#000" : "#10b981",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
          style={styles.image}
        />

        {/* STATUS DOT */}
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      {/* NAME */}
      <Text style={[styles.name, { color: isDark ? "white" : "#111" }]}>
        {item?.User_Name?.length > 11
          ? item.User_Name.substring(0, 11) + "..."
          : item?.User_Name}
      </Text>

      {/* JOB */}
      {item?.User_Job && (
        <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
          {item?.User_Job}
        </Text>
      )}

      {/* FREELANCER BADGE */}
      {item?.User_Freelancer && (
        <Text style={styles.freelancerBadge}>
          {App_Language.startsWith("ar") ? "عمل حر ⭐" : "⭐ Freelancer"}
        </Text>
      )}

      {/* SKILLS PREVIEW */}
      {skills && (
        <Text
          style={[
            styles.skills,
            { color: isDark ? "#bbb" : "#666" },
          ]}
          numberOfLines={2}
        >
          {skills}
        </Text>
      )}

      {/* ⭐ RATING (Reusable Component) */}
      <Rating
        value={item?.User_Rating}
        reviews={Array.isArray(item?.User_Reviews) ? item.User_Reviews.length : 0}
        size={16}
        isDark={isDark}
      />

      {/* DISTANCE */}
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
    width: 165,
    height: 260,
    borderRadius: 20,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    padding: 12,
  },
  imageWrapper: { position: "relative" },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "#ddd",
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
  name: { fontSize: 15, fontWeight: "600", textAlign: "center" },
  job: { fontSize: 13, marginTop: 2, textAlign: "center" },
  freelancerBadge: {
    fontSize: 12,
    color: "#10b981",
    marginTop: 4,
    fontWeight: "bold",
  },
  skills: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
  distance: { marginTop: 4, fontSize: 12 },
});
