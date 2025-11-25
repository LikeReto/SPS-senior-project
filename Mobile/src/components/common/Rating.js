import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Rating({ value = 0, reviews = 0, size = 16, isDark }) {
  const rating = Number(value) || 0;

  // Clamp between 0–5
  const clamped = Math.max(0, Math.min(5, rating));
  const decimal = clamped - Math.floor(clamped);

  let fullStars = Math.floor(clamped);
  let halfStar = 0;

  // ✔ Real-world rounding (Uber / Airbnb)
  if (decimal >= 0.75) {
    fullStars += 1;
  } else if (decimal >= 0.25) {
    halfStar = 1;
  }

  const emptyStars = 5 - fullStars - halfStar;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Ionicons key={"f" + i} name="star" size={size} color="#FFD700" />
      ))}

      {halfStar === 1 && (
        <Ionicons name="star-half" size={size} color="#FFD700" />
      )}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <Ionicons key={"e" + i} name="star-outline" size={size} color="#FFD700" />
      ))}

      {/* Number */}
      <Text
        style={{
          marginLeft: 4,
          fontSize: size - 2,
          color: isDark ? "#aaa" : "#555",
        }}
      >
        {clamped.toFixed(2)}
      </Text>
    </View>
  );
}
