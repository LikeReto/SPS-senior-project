// components/Home/SectionTitle.js
import { View, Text, StyleSheet } from "react-native";

export default function SectionTitle({ title, subtitle, isDark }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#666" }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18, marginTop: 8 },
  title: { fontSize: 17, fontWeight: "800" },
  subtitle: { fontSize: 13, marginTop: 2 },
});
