import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Rating from "@/src/components/common/Rating";
import DistancePill from "@/src/components/common/DistancePill";

import {
  getStatusColor,
  getStatusLabel
} from "@/src/utils/USER/statusHelpers";

import { DEFAULT_PROFILE_PIC } from "@/src/constants/aConstants";
import { Ionicons } from "@expo/vector-icons";

function WorkerCard({ item, distance, onPress, App_Language, isDark, isCurrentUser, userStatus }) {

  if (!item) return null;

  // ⭐ SAFE IMAGE
  const imageUri =
    item?.User_Profile_Picture && item.User_Profile_Picture !== ""
      ? item.User_Profile_Picture
      : DEFAULT_PROFILE_PIC;

  // ⭐ SKILLS PREVIEW
  const skills =
    Array.isArray(item?.User_Skills) && item.User_Skills.length > 0
      ? item.User_Skills.slice(0, 3).join(" • ")
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
      <View style={styles.row}>
        <Image
          source={typeof imageUri === "string"
            ? { uri: imageUri }
            : imageUri}
          style={styles.image}
        />

        {/* STATUS DOT */}
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(userStatus) }]} />

        <View style={styles.info}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {/* NAME */}
            <Text style={[styles.name, { color: isDark ? "#fff" : "#111" }]}>
              {item?.User_Name}
            </Text>
            {/* FREELANCER BADGE */}
            {item?.User_Freelancer && (
              <View style={styles.freelancerBadge}>
                <Ionicons name="star" size={14} color="#ffcc00" />
                <Text style={styles.freelancerText}>
                  {App_Language.startsWith("ar") ? "عمل حر" : "Freelancer"}
                </Text>
              </View>
            )}
          </View>

          {/* STATUS LABEL */}
          <Text style={[styles.statusText, { color: getStatusColor(userStatus) }]}>
            {getStatusLabel({
              userOnline: userStatus !== "offline",
              liveStatus: userStatus,
              App_Language
            })}
          </Text>

          {/* JOB */}
          {item?.User_Job &&
            <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
              {item?.User_Job}
            </Text>
          }

          {/* SKILLS */}
          {skills && (
            <Text
              style={[styles.skills, { color: isDark ? "#bbb" : "#666" }]}
              numberOfLines={2}
            >
              {skills}
            </Text>
          )}

          {/* RATING */}
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "#ddd",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    bottom: 4,
    left: 46,
    borderWidth: 2,
    borderColor: "#fff",
  },
  info: { flex: 1, flexDirection: "column" },
  name: { fontSize: 16, fontWeight: "600" },
  statusText: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  job: { fontSize: 13, marginVertical: 4 },
  freelancerBadge: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 204, 0, 0.10)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  freelancerText: {
    marginLeft: 6,
    color: "#ffcc00",
    fontWeight: "700",
    fontSize: 13,
  },
  skills: {
    marginTop: 4,
    fontSize: 11,
    maxWidth: "90%",
  },
  distance: { marginTop: 4, fontSize: 12 },
});
