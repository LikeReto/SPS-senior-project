import React from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { categories } from "@/src/constants/categories";

export default function CategoryList({
  selectedCategory,
  setSelectedCategory,
  darkMode,
  App_Language,
}) {
  return (
    <FlatList
      data={categories}
      horizontal
      keyExtractor={(item) => item.key}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 10 }}
      renderItem={({ item }) => {
        const isSelected = selectedCategory === item.key;

        return (
          <TouchableOpacity
            onPress={() =>
              setSelectedCategory(isSelected ? null : item.key)
            }
            style={styles.categoryItem(isSelected, darkMode)}
          >
            <Text style={styles.categoryText(isSelected, darkMode)}>
              {item.emoji}{" "}
              {App_Language.startsWith("ar")
                ? item.label.ar
                : item.label.en}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  categoryItem: (isSelected, darkMode) => ({
    width: "auto",
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: isSelected
      ? "#10b981"
      : darkMode === "light"
        ? "#fff"
        : "#1f1f1f",
    borderWidth: 1,
    borderColor: isSelected ? "#10b981" : "#555",
  }),

  categoryText: (isSelected, darkMode) => ({
    color: isSelected
      ? "#fff"
      : darkMode === "light"
        ? "#111"
        : "#ddd",
    fontWeight: "600",
    fontSize: 13,
  }),
});
