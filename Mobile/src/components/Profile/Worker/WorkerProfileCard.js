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

  const [isSaved, setIsSaved] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [notificationOn, setNotificationOn] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const text = isDark ? "#fff" : "#111";
  const sub = isDark ? "#bbb" : "#666";

  return (
    <View style={{ position: "relative" }}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? "rgba(22,22,22,0.85)"
              : "rgba(255,255,255,0.95)",
            borderColor: isDark
              ? "rgba(16,185,129,0.28)"
              : "rgba(16,185,129,0.32)",
          },
        ]}
      >
        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: isDark ? "#1a1a1acc" : "#ffffffdd" },
          ]}
          onPress={() => setIsSaved(!isSaved)}
        >
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={22}
            color={isSaved ? "#ff4d6d" : text}
          />
        </TouchableOpacity>

        {/* MENU BTN */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setShowActions(!showActions)}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={22}
            color={isDark ? "#fff" : "#111"}
          />
        </TouchableOpacity>

        {/* MENU */}
        {showActions && (
          <View
            style={[
              styles.dropdown,
              { backgroundColor: isDark ? "#111" : "#fff" },
            ]}
          >
            {/* NOTIFY */}
            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => setNotificationOn(!notificationOn)}
            >
              <Ionicons
                name={
                  notificationOn
                    ? "notifications"
                    : "notifications-outline"
                }
                size={22}
                color={notificationOn ? "#10b981" : text}
              />
              <Text style={[styles.dropdownText, { color: text }]}>
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
              style={styles.dropdownRow}
              onPress={() => setIsBlocked(!isBlocked)}
            >
              <Ionicons name="close-circle" size={22} color="#e11d48" />
              <Text style={[styles.dropdownText, { color: "#e11d48" }]}>
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
              style={styles.dropdownRow}
              onPress={() => alert("🚨 Report submitted")}
            >
              <Ionicons name="flag-outline" size={22} color="#fb7185" />
              <Text style={[styles.dropdownText, { color: "#fb7185" }]}>
                {isArabic ? "إبلاغ" : "Report"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* HEADER */}
        <View style={styles.header}>
          <View
            style={[
              styles.cover,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          />

          {/* AVATAR */}
          <View style={styles.avatarWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
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
                : worker?.User_Name}
            </Text>

            {worker?.User_VerifiedBadge && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#42C1FC"
                style={{ marginLeft: 6 }}
              />
            )}
          </View>

          <Text style={[styles.job, { color: isDark ? "#10b981" : "#059669" }]}>
            {worker?.User_Job ||
              (isArabic ? "بدون وظيفة" : "No job listed")}
          </Text>

          {worker?.User_Freelancer && (
            <View style={styles.freelancerBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.freelancerText}>
                {isArabic ? "مستقل" : "Freelancer"}
              </Text>
            </View>
          )}
        </View>

        {/* CONTACT INFO */}
        <View style={styles.info}>
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
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: text }]}>
              {worker?.User_Projects?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: sub }]}>
              {isArabic ? "مشاريع" : "Projects"}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: text }]}>
              <Ionicons name="star" size={14} color="#facc15" />
              {worker?.User_Rating || 4.8}
            </Text>
            <Text style={[styles.statLabel, { color: sub }]}>
              {isArabic ? "التقييم" : "Rating"}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: text }]}>
              {worker?.User_JobsDone || 0}
            </Text>
            <Text style={[styles.statLabel, { color: sub }]}>
              {isArabic ? "منجز" : "Completed"}
            </Text>
          </View>
        </View>

        {/* CHAT BUTTON */}
        <TouchableOpacity style={styles.chatBtn} onPress={onChatPress}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
          <Text style={styles.chatBtnText}>
            {isArabic ? "مراسلة" : "Chat"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ======================= STYLES ======================= */
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 24,
    paddingBottom: 28,
    borderWidth: 1.3,
    overflow: "visible",
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 7,
  },

  /* SAVE BTN */
  saveBtn: {
    position: "absolute",
    top: 14,
    left: 14,
    padding: 6,
    borderRadius: 14,
    zIndex: 50,
  },

  /* MENU */
  menuBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 5,
    zIndex: 50,
  },

  dropdown: {
    position: "absolute",
    top: 50,
    right: 14,
    width: 210,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 8,
    zIndex: 60,
  },

  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  dropdownText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
  },

  /* HEADER */
  header: {
    width: "100%",
    height: 105,
  },

  cover: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  avatarWrapper: {
    width: 95,
    height: 95,
    borderRadius: 50,
    overflow: "hidden",
    position: "absolute",
    bottom: -40,
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "rgba(16,185,129,0.45)",
    backgroundColor: "#333",
  },

  avatar: { width: "100%", height: "100%" },

  /* NAME + BADGES */
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
  },

  job: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },

  freelancerBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(255,215,0,0.13)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  freelancerText: {
    marginLeft: 5,
    color: "#FFD700",
    fontWeight: "700",
    fontSize: 12,
  },

  /* INFO */
  info: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 24,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "500",
  },

  /* STATS */
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
    paddingHorizontal: 10,
  },

  statItem: {
    alignItems: "center",
  },

  statValue: {
    fontSize: 17,
    fontWeight: "800",
  },

  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },

  /* CHAT BTN */
  chatBtn: {
    marginTop: 25,
    marginHorizontal: 22,
    backgroundColor: "#10b981",
    paddingVertical: 15,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  chatBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
