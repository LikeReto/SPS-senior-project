import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WorkerListCard({ worker, onPress, isDark }) {
  const fullStars = Math.floor(worker.rating);
  const halfStar = worker.rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isDark ? "#1a1a1a" : "#fff", shadowColor: isDark ? "#000" : "#10b981" },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: worker.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: isDark ? "white" : "#111" }]}>{worker.User_Name}</Text>
        <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>{worker.User_Job}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(fullStars)].map((_, i) => (
            <Ionicons key={"full" + i} name="star" size={14} color="#FFD700" />
          ))}
          {halfStar === 1 && <Ionicons name="star-half" size={14} color="#FFD700" />}
          {[...Array(emptyStars)].map((_, i) => (
            <Ionicons key={"empty" + i} name="star-outline" size={14} color="#FFD700" />
          ))}
          <Text style={[styles.ratingText, { color: isDark ? "#aaa" : "#555" }]}>
            {worker.rating.toFixed(1)}
          </Text>
        </View>
        {worker.distance && (
          <Text style={[styles.distance, { color: isDark ? "#aaa" : "#555" }]}>
            {worker.distance.toFixed(1)} km away
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: "center",
  },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  job: { fontSize: 13, marginTop: 2 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: { marginLeft: 4, fontSize: 12 },
  distance: { marginTop: 2, fontSize: 12 },
});
