import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchHistoryList({
  history,
  onPressItem,
  onClear,
  onDeleteItem,  // ← NEW
  darkMode,
  App_Language,
}) {
  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.title,
            { color: darkMode === "dark" ? "#fff" : "#111" },
          ]}
        >
          {App_Language.startsWith("ar")
            ? "عمليات البحث الأخيرة"
            : "Recent Searches"}
        </Text>

        {/* Clear All */}
        <TouchableOpacity onPress={onClear}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={darkMode === "dark" ? "#f87171" : "#dc2626"}
          />
        </TouchableOpacity>
      </View>

      {/* Horizontal list */}
      <FlatList
        data={history}
        horizontal
        keyExtractor={(item, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.historyItem,
              {
                backgroundColor:
                  darkMode === "dark" ? "#1e1e1e" : "#e6f6ef",
              },
            ]}
          >
            {/* Tap item */}
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => onPressItem(item)}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={darkMode === "dark" ? "#aaa" : "#10b981"}
                style={{ marginRight: 5 }}
              />

              <Text
                style={{
                  color: darkMode === "dark" ? "#fff" : "#0f5132",
                  fontWeight: "600",
                  marginRight: 6,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>

            {/* Delete Single Item */}
            <TouchableOpacity onPress={() => onDeleteItem(item)}>
              <Ionicons
                name="close-circle"
                size={20}
                color={darkMode === "dark" ? "#f87171" : "#d33"}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 6 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  historyItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
