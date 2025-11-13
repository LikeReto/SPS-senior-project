import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WorkerCard({ item, onPress, isDark }) {
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
      <View style={styles.row}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
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

          {item.distance && (
            <Text style={[styles.distance, { color: isDark ? "#aaa" : "#555" }]}>
              {item.distance.toFixed(1)} km away
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

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
  info: { flex: 1, flexDirection: "column" },
  name: { fontSize: 16, fontWeight: "600" },
  job: { fontSize: 14, marginTop: 2 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { marginLeft: 4, fontSize: 12 },
  distance: { marginTop: 4, fontSize: 12 },
});
