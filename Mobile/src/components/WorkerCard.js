import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Rating from "@/src/components/common/Rating";
import DistancePill from "@/src/components/common/DistancePill";

import {
  getStatusColor,
  getStatusLabel,
} from "@/src/utils/USER/statusHelpers";

import { DEFAULT_PROFILE_PIC } from "@/src/constants/aConstants";

function WorkerCard({
  item,
  distance,
  onPress,
  App_Language,
  isDark,
  isCurrentUser,
  userStatus,
}) {
  if (!item) return null;

  const imageUri =
    item?.User_Profile_Picture && item.User_Profile_Picture !== ""
      ? item.User_Profile_Picture
      : DEFAULT_PROFILE_PIC;

  const skills =
    Array.isArray(item?.User_Skills) && item.User_Skills?.length > 0
      ? item.User_Skills.slice(0, 3).join(" • ")
      : null;

  const textColor = isDark ? "#ffffff" : "#111";
  const secondaryColor = isDark ? "#9ca3af" : "#666";
  const jobColor = isDark ? "#34d399" : "#059669";

  const neonShadow = isDark
    ? {
        shadowColor: getStatusColor(userStatus),
        shadowOpacity: 0.35,
        shadowRadius: 15,
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
            ? "rgba(20,20,20,0.85)"
            : "rgba(255,255,255,0.85)",
        },
        neonShadow,
      ]}
    >
      <View style={styles.row}>
        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <Image
            source={
              typeof imageUri === "string"
                ? { uri: imageUri }
                : imageUri
            }
            style={styles.avatar}
          />

          {/* ONLINE STATUS */}
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(userStatus) },
            ]}
          />
        </View>

        {/* RIGHT INFO */}
        <View style={styles.info}>
          {/* NAME + BADGE */}
          <View style={styles.topRow}>
            <Text
              style={[styles.name, { color: textColor }]}
              numberOfLines={1}
            >
              {item.User_Name.length > 18
                ? item.User_Name.slice(0, 18) + "…"
                : item.User_Name}
            </Text>

            {item?.User_Freelancer && (
              <View style={styles.badge}>
                <Ionicons name="sparkles" size={13} color="#facc15" />
                <Text style={styles.badgeText}>
                  {App_Language.startsWith("ar")
                    ? "مستقل"
                    : "Freelancer"}
                </Text>
              </View>
            )}
          </View>

          {/* SELF TAG */}
          {isCurrentUser && (
            <Text
              style={[
                styles.selfTag,
                { color: isDark ? "#38bdf8" : "#0284c7" },
              ]}
            >
              {App_Language.startsWith("ar") ? "(أنت)" : "(You)"}
            </Text>
          )}

          {/* STATUS LABEL */}
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(userStatus) },
            ]}
          >
            {getStatusLabel({
              userOnline: userStatus !== "offline",
              liveStatus: userStatus,
              App_Language,
            })}
          </Text>

          {/* JOB */}
          {item.User_Job && (
            <Text
              style={[styles.job, { color: jobColor }]}
              numberOfLines={1}
            >
              {item.User_Job}
            </Text>
          )}

          {/* SKILLS */}
          {skills && (
            <Text
              style={[
                styles.skills,
                { color: secondaryColor },
              ]}
              numberOfLines={2}
            >
              {skills}
            </Text>
          )}

          {/* RATING */}
          <Rating
            value={item?.User_Rating}
            reviews={
              Array.isArray(item?.User_Reviews)
                ? item.User_Reviews.length
                : 0
            }
            size={15}
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
    marginHorizontal: 18,
    marginVertical: 10,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1.4,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    transform: [{ scale: 0.999 }],
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* AVATAR */
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    marginRight: 14,
    backgroundColor: "#222",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
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

  /* RIGHT INFO */
  info: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  selfTag: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "600",
  },

  statusText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },

  job: {
    fontSize: 13.5,
    marginTop: 4,
    fontWeight: "600",
  },

  /* BADGE */
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(250, 204, 21, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
  },
  badgeText: {
    color: "#facc15",
    marginLeft: 4,
    fontWeight: "700",
    fontSize: 12,
  },

  skills: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.9,
    lineHeight: 17,
  },
});
