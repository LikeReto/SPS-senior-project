import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Distance({ distance, App_Language, isDark }) {
  // No coords saved in DB
  if (distance == null) {
    return (
      <Text style={{
        color: isDark ? "#aaa" : "#555",
        marginTop: 6,
        fontSize: 12
      }}>
        {App_Language.startsWith("ar")
          ? "المسافة غير متوفرة"
          : "Distance unavailable"}
      </Text>
    );
  }

  const isVeryNear = distance <= 2;
  const isNear = distance <= 10;

  const bgColor = isVeryNear
    ? "rgba(16,185,129,0.15)" // green
    : isNear
      ? "rgba(255,153,0,0.15)" // orange
      : "rgba(224,49,49,0.15)"; // red

  const textColor = isVeryNear
    ? "#10b981"
    : isNear
      ? "#ff9900"
      : "#e03131";

  const iconName = isVeryNear
    ? "location"
    : isNear
      ? "navigate"
      : "warning";

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
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Distance number */}
      <Text
        style={{
          color: isDark ? "#aaa" : "#555",
          fontSize: 12,
          marginRight: 10,
        }}
      >
        {distance.toFixed(1)} {App_Language.startsWith("ar") ? "كم 📍" : "km 📍"}
      </Text>

      {/* Pill */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
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
