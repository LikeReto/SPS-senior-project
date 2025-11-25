import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Distance({ distance, App_Language, isDark }) {
  if (distance == null) {
    return (
      <Text
        style={{
          color: isDark ? "#aaa" : "#555",
          marginTop: 6,
          fontSize: 12,
        }}
      >
        {App_Language.startsWith("ar")
          ? "المسافة غير متوفرة"
          : "Distance unavailable"}
      </Text>
    );
  }

  const isVeryNear = distance <= 10;
  const isNear = distance <= 30 && distance > 10;

  const bgColor = isVeryNear
    ? "rgba(16,185,129,0.15)"
    : isNear
    ? "rgba(255,153,0,0.15)"
    : "rgba(224,49,49,0.15)";

  const textColor = isVeryNear
    ? "#10b981"
    : isNear
    ? "#ff9900"
    : "#e03131";

  const iconName = isVeryNear
    ? "location"
    : isNear
    ? "navigate"
    : "navigate-circle";

  const label = isVeryNear
    ? App_Language.startsWith("ar") ? "قريب جدًا" : "Very Near"
    : isNear
    ? App_Language.startsWith("ar") ? "قريب" : "Near"
    : App_Language.startsWith("ar") ? "بعيد" : "Far";

  return (
    <View
      style={{
        marginTop: 6,
        flexDirection: "row",
        flexWrap: "wrap", // ⭐ ENABLE WRAPPING
        alignItems: "center",
        gap: 10, // ⭐ Perfect spacing between pill + text
      }}
    >
      {/* LEFT TEXT */}
      <Text
        style={{
          color: isDark ? "#aaa" : "#555",
          fontSize: 12,
        }}
      >
        {distance.toFixed(1)} {App_Language.startsWith("ar") ? "كم 📍" : "km 📍"}
      </Text>

      {/* RIGHT PILL */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 14,
          backgroundColor: bgColor,
        }}
      >
        <Ionicons
          name={iconName}
          size={16}
          color={textColor}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            color: textColor,
            fontWeight: "700",
            fontSize: 12,
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}
