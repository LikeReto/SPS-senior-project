// components/Home/Header.js
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ isDark, onSearch }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { color: isDark ? "#fff" : "#000" }]}>
        S<Text style={{ color: "#10b981" }}>P</Text><Text style={[styles.logo, { color: isDark ? "#fff" : "#000" }]}>
        S</Text>
      </Text>

      <TouchableOpacity onPress={onSearch} style={[styles.searchBtn, { backgroundColor: isDark ? "#151515" : "#e9faf2" }]}>
        <Ionicons name="search-outline" size={24} color={isDark ? "#fff" : "#10b981"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
  },
  searchBtn: {
    padding: 10,
    borderRadius: 50,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
