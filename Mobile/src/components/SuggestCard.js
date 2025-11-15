import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SuggestCard({ item, onPress, isDark, isCurrentUser, userStatus }) {
  if (!item) return null;

  // ⭐ Status color helper
  const getStatusColor = () => {
    switch (userStatus) {
      case "online": return "#10b981";
      case "busy":
      case "away": return "#FFAA00";
      case "do not disturb": return "#FF0000";
      default: return "#888";
    }
  };
  const statusColor = getStatusColor();

  // ⭐ SAFE RATING
  const rating = Number(item?.User_Rating) || 0;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  // ⭐ SAFE IMAGE
  const imageUri =
    item?.User_Profile_Picture && item.User_Profile_Picture !== ""
      ? item.User_Profile_Picture
      : "https://via.placeholder.com/80";

  // ⭐ SKILLS PREVIEW
  const skills =
    Array.isArray(item?.User_Skills) && item.User_Skills?.length > 0
      ? item.User_Skills.slice(0, 2).join(" • ")
      : null;

  // ⭐ Reviews Count
  const reviewsCount = Array.isArray(item?.User_Reviews)
    ? item.User_Reviews?.length
    : 4.2;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1a1a1a" : "#fff",
          borderColor: isCurrentUser === true ? "#10b981" : "#BB1313FF",
          shadowColor: isDark ? "#000" : "#10b981",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {/* STATUS DOT */}
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      {/* NAME */}
      <Text style={[styles.name, { color: isDark ? "white" : "#111" }]}>
        {item?.User_Name || "Unknown"}
      </Text>

      {/* JOB */}
      <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
        {item?.User_Job || "Freelancer"}
      </Text>

      {/* FREELANCER BADGE */}
      {item?.User_Freelancer && (
        <Text style={styles.freelancerBadge}>
          ⭐ Verified Freelancer
        </Text>
      )}

      {/* SKILLS PREVIEW */}
      {skills && (
        <Text
          style={[
            styles.skills,
            { color: isDark ? "#bbb" : "#666" },
          ]}
          numberOfLines={1}
        >
          {skills}
        </Text>
      )}

      {/* RATING */}
      <View style={styles.ratingContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Ionicons key={"full" + i} name="star" size={16} color="#FFD700" />
        ))}

        {halfStar === 1 && (
          <Ionicons name="star-half" size={16} color="#FFD700" />
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons key={"empty" + i} name="star-outline" size={16} color="#FFD700" />
        ))}

        <Text
          style={[
            styles.ratingText,
            { color: isDark ? "#aaa" : "#555" },
          ]}
        >
          {rating.toFixed(1)} ({reviewsCount})
        </Text>
      </View>

      {/* DISTANCE */}
      {item?.distance !== undefined && (
        <Text style={[styles.distance, { color: isDark ? "#aaa" : "#555" }]}>
          {item.distance} km away
        </Text>
      )}
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
  imageWrapper: {
    position: "relative",
  },
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: { marginLeft: 4, fontSize: 12 },
  distance: {
    marginTop: 6,
    fontSize: 12,
  },
});
