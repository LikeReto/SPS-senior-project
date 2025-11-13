import { useEffect, useRef } from "react";
import {
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  Pressable,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatusModal({
  visible,
  onClose,
  currentStatus,
  onSelectStatus,
  darkMode,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const isDark = darkMode === "dark";

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(40);
    }
  }, [visible]);

  const statuses = [
    { label: "Online", value: "online", color: "#10b981" },
    { label: "Busy", value: "busy", color: "#FFAA00" },
    { label: "Do Not Disturb", value: "do not disturb", color: "#FF0000" },
    { label: "Offline", value: "offline", color: "#888" },
  ];

  return (
    <Modal transparent visible={visible} animationType="none">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.modalBox,
            {
              backgroundColor: isDark ? "#1a1a1a" : "white",
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
            Select Your Status
          </Text>

          <ScrollView style={{ maxHeight: 330 }}>
            {statuses.map((status) => {
              const active = currentStatus === status.value;

              return (
                <TouchableOpacity
                  key={status.value}
                  onPress={() => onSelectStatus(status.value)}
                  style={[
                    styles.statusBtn,
                    {
                      backgroundColor: active
                        ? status.color + "33" // light tint of the status color
                        : isDark
                        ? "#262626"
                        : "#f2f2f2",
                      borderWidth: active ? 1.2 : 0,
                      borderColor: active ? status.color : "transparent",
                    },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="ellipse"
                      size={14}
                      color={status.color}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        color: isDark ? "#fff" : "#111",
                        fontWeight: active ? "700" : "500",
                      }}
                    >
                      {status.label}
                    </Text>
                  </View>

                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={status.color}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
            <Text style={{ color: "white", fontWeight: "600" }}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalBox: {
    width: "100%",
    padding: 18,
    paddingBottom: 40,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center",
  },
  statusBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  doneBtn: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
});
