import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function SortButtons({
  sortBy,
  setSortBy,
  darkMode,
  App_Language,
}) {
  return (
    <View style={styles.filters}>
      {/* NEAREST BUTTON */}
      <TouchableOpacity
        onPress={() => setSortBy("nearest")}
        style={[
          styles.filterButton,
          {
            backgroundColor:
              sortBy === "nearest"
                ? "#10b981"
                : darkMode === "light"
                ? "#e6f9f0"
                : "#1f1f1f",
          },
        ]}
      >
        <Text style={styles.sortText(sortBy === "nearest", darkMode)}>
          {App_Language.startsWith("ar") ? "الأقرب" : "Nearest"}
        </Text>
      </TouchableOpacity>

      {/* TOP RATED BUTTON */}
      <TouchableOpacity
        onPress={() => setSortBy("top")}
        style={[
          styles.filterButton,
          {
            backgroundColor:
              sortBy === "top"
                ? "#10b981"
                : darkMode === "light"
                ? "#e6f9f0"
                : "#1f1f1f",
          },
        ]}
      >
        <Text style={styles.sortText(sortBy === "top", darkMode)}>
          {App_Language.startsWith("ar") ? "الأعلى تقييماً" : "Top Rated"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },

  sortText: (active, darkMode) => ({
    color:
      active
        ? "#fff"
        : darkMode === "light"
        ? "#111"
        : "#fff",
    fontWeight: "600",
  }),
});
