import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

export default function SettingsHeader({ onBack, title, isDark }) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={28} color={isDark ? "#fff" : "#111"} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>{title}</Text>
      <View style={{ width: 28 }} />
    </View>
  );
}
