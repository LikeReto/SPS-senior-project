import { useEffect, useRef } from "react";
import {
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

export default function SkillsModal({
  visible,
  onClose,
  skills,
  selectedSkills,
  toggleSkill,
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
            Select Your Skills
          </Text>

          <ScrollView style={{ maxHeight: 330 }}>
            {skills.map((skill) => {
              const active = selectedSkills.includes(skill);

              return (
                <TouchableOpacity
                  key={skill}
                  onPress={() => toggleSkill(skill)}
                  style={[
                    styles.skillBtn,
                    {
                      backgroundColor: active
                        ? "#10b981"
                        : isDark
                        ? "#262626"
                        : "#f2f2f2",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? "white" : isDark ? "#fff" : "#111",
                      fontWeight: active ? "700" : "500",
                    }}
                  >
                    {skill}
                  </Text>
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
  skillBtn: {
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
