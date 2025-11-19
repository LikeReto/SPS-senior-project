import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  getStatusColor,
  getStatusLabel
} from "@/src/utils/USER/statusHelpers";

function WorkerCard({ item, onPress, App_Language, isDark, isCurrentUser, userStatus }) {

  if (!item) return null;


  // ⭐ SAFE RATING
  const rating = Number(item?.User_Rating) || 0;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  // ⭐ SAFE IMAGE
  const imageUri =
    item?.User_Profile_Picture && item.User_Profile_Picture !== ""
      ? item.User_Profile_Picture
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  // ⭐ SKILLS PREVIEW
  const skills =
    Array.isArray(item?.User_Skills) && item.User_Skills.length > 0
      ? item.User_Skills.slice(0, 3).join(" • ")
      : null;

  // ⭐ REVIEWS COUNT
  const reviewsCount = Array.isArray(item?.User_Reviews)
    ? item.User_Reviews.length
    : 0;

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
      <View style={styles.row}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        {/* STATUS DOT */}
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(userStatus) }]} />

        <View style={styles.info}>
          {/* NAME */}
          <Text style={[styles.name, { color: isDark ? "#fff" : "#111" }]}>
            {item?.User_Name}
          </Text>

          {/* STATUS LABEL */}
          <Text style={[styles.statusText, { color: getStatusColor(userStatus) }]}>
            {getStatusLabel({
              userOnline: userStatus !== "offline",
              liveStatus: userStatus,
              App_Language
            })}
          </Text>

          {/* JOB */}
          <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
            {item?.User_Job || "Freelancer"}
          </Text>

          {/* FREELANCER BADGE */}
          {item?.User_Freelancer && (
            <Text style={styles.freelancerBadge}>⭐ Verified Freelancer</Text>
          )}

          {/* SKILLS */}
          {skills && (
            <Text
              style={[styles.skills, { color: isDark ? "#bbb" : "#666" }]}
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

            <Text style={[styles.ratingText, { color: isDark ? "#aaa" : "#555" }]}>
              {rating.toFixed(1)} ({reviewsCount})
            </Text>
          </View>

          {/* DISTANCE */}
          {item?.distance !== undefined && (
            <Text style={[styles.distance, { color: isDark ? "#aaa" : "#555" }]}>
              {item.distance.toFixed(1)} km away
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(WorkerCard);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 14,
    borderRadius: 16,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  row: { flexDirection: "row", alignItems: "center" },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    top: 48,
    left: 48,
    borderWidth: 2,
    borderColor: "#fff",
  },
  info: { flex: 1, flexDirection: "column" },
  name: { fontSize: 16, fontWeight: "600" },
  statusText: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  job: { fontSize: 14, marginTop: 2 },
  freelancerBadge: {
    marginTop: 2,
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  skills: {
    marginTop: 4,
    fontSize: 12,
    maxWidth: "90%",
  },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { marginLeft: 4, fontSize: 12 },
  distance: { marginTop: 4, fontSize: 12 },
});
