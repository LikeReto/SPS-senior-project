import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

/**
 * Props:
 *  - label: string
 *  - icon: React element (e.g. <Ionicons name="..." size={20} color="..." />)
 *  - isDark: boolean
 *  - onPress: function (optional) -> if provided the whole card is pressable
 *  - children: React node (optional) -> custom right-side content (badge, toggle, etc.)
 */
export const SettingsCard = ({ label, icon, isDark, onPress, children }) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        { backgroundColor: isDark ? "#0f0f0f" : "#fff" }
      ]}
    >
      <View style={styles.cardRow}>
        {/* Icon on the left */}
        <View style={[
          styles.iconWrapper,
          { backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(16,185,129,0.08)" }
        ]}>
          {/* if no icon passed, show a placeholder */}
          {icon ? icon : <Ionicons name="settings-outline" size={20} color="#10b981" />}
        </View>

        {/* Label */}
        <Text style={[
          styles.label,
          { color: isDark ? "#e5e5e5" : "#111" }
        ]}>
          {label}
        </Text>

        {/* Right side: either children or chevron */}
        <View style={styles.rightContent}>
          {children ? (
            children
          ) : (
            onPress ? <Ionicons name="chevron-forward" size={20} color={isDark ? "#cfcfcf" : "#999"} /> : null
          )}
        </View>
      </View>
    </Wrapper>
  );
};
