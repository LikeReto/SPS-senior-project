import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SuggestCard({ item, onPress, isDark }) {
  const fullStars = Math.floor(item.rating);
  const halfStar = item.rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1a1a1a" : "#fff",
          shadowColor: isDark ? "#000" : "#10b981",
        },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={[styles.name, { color: isDark ? "white" : "#111" }]}>
        {item.User_Name}
      </Text>
      <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
        {item.User_Job}
      </Text>

      <View style={styles.ratingContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Ionicons key={"full" + i} name="star" size={16} color="#FFD700" />
        ))}
        {halfStar === 1 && <Ionicons name="star-half" size={16} color="#FFD700" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons key={"empty" + i} name="star-outline" size={16} color="#FFD700" />
        ))}
        <Text style={[styles.ratingText, { color: isDark ? "#aaa" : "#555" }]}>
          {item.rating.toFixed(1)}
        </Text>
      </View>

      {item.distance !== undefined && (
        <Text style={[styles.distance, { color: isDark ? "#aaa" : "#555" }]}>
          {item.distance} km away
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 250,
    borderRadius: 20,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    padding: 10,
  },
  image: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 15, fontWeight: "600", textAlign: "center" },
  job: { fontSize: 13, marginTop: 2, textAlign: "center" },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { marginLeft: 4, fontSize: 12 },
  distance: { marginTop: 4, fontSize: 12 },
});
