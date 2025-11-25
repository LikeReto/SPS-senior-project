// src/components/Reviews/ReviewCard.js
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewCard({ item, isDark }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#111" : "#f7f7f7",
          borderColor: isDark ? "#222" : "#e4e4e4",
        },
      ]}
    >
      {/* Avatar + Name + Date */}
      <View style={styles.header}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: isDark ? "#fff" : "#111",
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            {item.name}
          </Text>

          <Text
            style={{
              color: isDark ? "#888" : "#666",
              fontSize: 12,
            }}
          >
            {new Date(item.date).toLocaleDateString("en-US")}
          </Text>
        </View>
      </View>

      {/* Stars */}
      <View style={{ flexDirection: "row", marginVertical: 5, marginLeft: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={
              i + 1 <= Math.floor(item.stars)
                ? "star"
                : i + 0.5 <= item.stars
                ? "star-half"
                : "star-outline"
            }
            size={18}
            color="#facc15"
          />
        ))}
      </View>

      {/* Text */}
      <Text
        style={{
          color: isDark ? "#ccc" : "#444",
          marginTop: 4,
          lineHeight: 20,
          fontSize: 14,
        }}
      >
        {item.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 42,
    marginRight: 10,
  },
});
