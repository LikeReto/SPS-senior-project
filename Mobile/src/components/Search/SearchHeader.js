import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchHeader({
  query,
  setQuery,
  darkMode,
  App_Language,
  onBack,
}) {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={darkMode === "light" ? "#111" : "#fff"}
        />
      </TouchableOpacity>

      {/* Search Input */}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={
          App_Language.startsWith("ar")
            ? "البحث عن مقدمي الخدمات..."
            : "Search workers..."
        }
        placeholderTextColor={darkMode === "light" ? "#888" : "#aaa"}
        style={[
          styles.searchInput,
          {
            backgroundColor: darkMode === "light" ? "#fff" : "#1f1f1f",
            color: darkMode === "light" ? "#111" : "#fff",
          },
        ]}
      />

      {/* Clear Button */}
      {query !== "" && (
        <TouchableOpacity
          onPress={() => setQuery("")}
          style={styles.clearButton}
        >
          <Ionicons
            name="close"
            size={20}
            color={darkMode === "light" ? "#111" : "#fff"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 10,
    alignItems: "center",
  },

  backButton: {
    padding: 8,
    borderRadius: 12,
  },

  searchInput: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginLeft: 8,
  },

  clearButton: {
    marginLeft: 8,
  },
});
