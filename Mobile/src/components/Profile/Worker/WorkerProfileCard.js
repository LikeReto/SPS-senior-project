import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WorkerProfileCard({
  isDark,
  worker,
  imageUri,
  onChatPress,
  App_Language,
}) {
  const isArabic = App_Language.startsWith("ar");

  // Local UI states
  const [isSaved, setIsSaved] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [notificationOn, setNotificationOn] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const bg = isDark ? "#0f0f0f" : "#ffffff";
  const text = isDark ? "#fff" : "#111";

  return (
    <View style={{ position: "relative" }}>

      <View
        style={[
          styles.container,
          {
            backgroundColor: bg,
            shadowColor: isDark ? "#000" : "#777",
          },
        ]}
      >
        {/* SAVE BUTTON — OUTSIDE MENU */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: isDark ? "#1a1a1ab8" : "#ffffffcc" },
          ]}
          onPress={() => setIsSaved(!isSaved)}
        >
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={22}
            color={isSaved ? "#ff4d6d" : text}
          />
        </TouchableOpacity>

        {/* 3 DOTS MENU */}
        <TouchableOpacity
          style={styles.actionMenuBtn}
          onPress={() => setShowActions(!showActions)}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={22}
            color={isDark ? "#fff" : "#111"}
          />
        </TouchableOpacity>

        {/* DROPDOWN MENU */}
        {showActions && (
          <View
            style={[
              styles.actionsDropdown,
              { backgroundColor: isDark ? "#1a1a1a" : "#fff" },
            ]}
          >
            {/* NOTIFICATIONS */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => setNotificationOn(!notificationOn)}
            >
              <Ionicons
                name={
                  notificationOn
                    ? "notifications"
                    : "notifications-outline"
                }
                size={20}
                color={notificationOn ? "#10b981" : text}
              />
              <Text style={[styles.actionText, { color: text }]}>
                {notificationOn
                  ? isArabic
                    ? "إيقاف الإشعارات"
                    : "Disable notifications"
                  : isArabic
                  ? "تفعيل الإشعارات"
                  : "Enable notifications"}
              </Text>
            </TouchableOpacity>

            {/* BLOCK */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => setIsBlocked(!isBlocked)}
            >
              <Ionicons
                name={isBlocked ? "close-circle" : "close-circle-outline"}
                size={20}
                color="#dc2626"
              />
              <Text style={[styles.actionText, { color: "#dc2626" }]}>
                {isBlocked
                  ? isArabic
                    ? "تم الحظر"
                    : "Blocked"
                  : isArabic
                  ? "حظر"
                  : "Block"}
              </Text>
            </TouchableOpacity>

            {/* REPORT */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => alert("🚨 Report submitted")}
            >
              <Ionicons name="flag-outline" size={20} color="#f43f5e" />
              <Text style={[styles.actionText, { color: "#f43f5e" }]}>
                {isArabic ? "إبلاغ" : "Report"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* HEADER AREA */}
        <View style={styles.headerArea}>
          <View
            style={[
              styles.cover,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          />
          <View style={styles.profileWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Ionicons
                name="person-circle"
                size={90}
                color={isDark ? "#999" : "#444"}
              />
            )}
          </View>
        </View>

        {/* NAME + BADGES */}
        <View style={{ alignItems: "center", marginTop: 45 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: text }]}>
              {worker?.User_Name?.length > 15
                ? worker.User_Name.slice(0, 15) + "…"
                : worker.User_Name}
            </Text>

            {worker?.User_VerifiedBadge && (
              <Ionicons name="checkmark-circle" size={18} color="#42C1FC" />
            )}
          </View>

          <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
            {worker?.User_Job || (isArabic ? "بدون وظيفة" : "No job listed")}
          </Text>

          {worker?.User_Freelancer && (
            <View style={styles.freelancerBadge}>
              <Ionicons name="star" size={14} color="#ffcc00" />
              <Text style={styles.freelancerText}>
                {isArabic ? "عمل حر" : "Freelancer"}
              </Text>
            </View>
          )}
        </View>

        {/* INFO */}
        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <Ionicons
              name="call-outline"
              size={20}
              color={worker?.User_PhoneNumber ? "#10b981" : "#777"}
            />
            <Text style={[styles.infoText, { color: text }]}>
              {worker?.User_PhoneNumber &&
              worker?.User_PhoneNumber_Hidden !== true
                ? `+${worker.User_CallingCode}${worker.User_PhoneNumber}`
                : "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color="#10b981" />
            <Text style={[styles.infoText, { color: text }]}>
              {worker?.User_Degree || "N/A"}
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: text }]}>
              {worker?.User_Projects?.length || 0}
            </Text>
            <Text style={styles.statLabel}>
              {isArabic ? "مشاريع" : "Projects"}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: text }]}>
              {worker?.User_Rating || 4.8}
            </Text>
            <Text style={styles.statLabel}>
              {isArabic ? "التقييم" : "Rating"}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: text }]}>
              {worker?.User_JobsDone || 0}
            </Text>
            <Text style={styles.statLabel}>
              {isArabic ? "منجز" : "Completed"}
            </Text>
          </View>
        </View>

        {/* CHAT BUTTON */}
        <TouchableOpacity style={styles.chatBtn} onPress={onChatPress}>
          <Ionicons name="chatbubbles-outline" size={18} color="#fff" />
          <Text style={styles.chatBtnText}>
            {isArabic ? "مراسلة" : "Chat"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  fullscreenCloseArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 49,
  },

  container: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    paddingBottom: 30,
    overflow: "visible",
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 7,
  },

  /* SAVE BTN */
  saveBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 50,
    padding: 6,
    borderRadius: 12,
  },

  /* MENU */
  actionMenuBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 50,
    padding: 5,
  },

  actionsDropdown: {
    position: "absolute",
    top: 48,
    right: 12,
    width: 200,
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 7,
    zIndex: 60,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  actionText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },

  /* HEADER */
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
    width: 95,
    height: 95,
    borderRadius: 50,
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  /* NAME */
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
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
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 204, 0, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  freelancerText: {
    marginLeft: 6,
    color: "#ffcc00",
    fontWeight: "700",
  },

  /* INFO */
  detailsContainer: {
    marginTop: 25,
    width: "100%",
    paddingHorizontal: 22,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },

  /* STATS */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 28,
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "800",
  },

  statLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#888",
  },

  /* CHAT BTN */
  chatBtn: {
    marginTop: 25,
    marginHorizontal: 20,
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  chatBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 6,
  },
});
