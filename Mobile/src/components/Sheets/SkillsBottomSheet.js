import { useEffect, useRef, useState } from "react";
import {
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  View,
} from "react-native";

export default function SkillsModal({
  visible,
  onClose,
  skills,
  selectedSkills,
  toggleSkill,
  darkMode,
  App_Language, // add this prop
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [search, setSearch] = useState("");

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
      setSearch("");
    }
  }, [visible]);

  const filteredSkills = skills.filter((skill) => {
    const label = App_Language?.startsWith("ar") ? skill.label.ar : skill.label.en;
    return label.toLowerCase().includes(search.toLowerCase());
  });

  // Highlight matching letters in search
  const highlightMatch = (text, query) => {
    if (!query) return <Text>{text}</Text>;
    const regex = new RegExp(`(${query})`, "i");
    const parts = text.split(regex);
    return (
      <Text>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Text key={i} style={{ backgroundColor: "#ffeb3b" }}>{part}</Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.modalBox,
            {
              backgroundColor: darkMode === "light" ? "#ffffff" : "#1a1a1a",
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: darkMode === "light" ? "#111" : "#fff" }]}>
            {App_Language?.startsWith("ar") ? "اختر مهاراتك" : "Select Your Skills"}
          </Text>

          {/* Search Input */}
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: darkMode === "light" ? "#f3f3f3" : "#2a2a2a",
                color: darkMode === "light" ? "#111" : "#fff",
              },
            ]}
            placeholder={App_Language?.startsWith("ar") ? "ابحث عن مهارة..." : "Search skill..."}
            placeholderTextColor={darkMode === "light" ? "#777" : "#aaa"}
            value={search}
            onChangeText={setSearch}
          />

          <ScrollView style={{ maxHeight: 330 }}>
            {filteredSkills.map((skill) => {
              const active = selectedSkills.includes(skill.name);
              const label = App_Language?.startsWith("ar") ? skill.label.ar : skill.label.en;

              return (
                <TouchableOpacity
                  key={skill.name}
                  onPress={() => toggleSkill(skill.name)}
                  style={[
                    styles.skillBtn,
                    {
                      backgroundColor: active
                        ? "#10b981"
                        : darkMode === "light"
                        ? "#f5f5f5"
                        : "#2a2a2a",
                    },
                  ]}
                >
                  <View style={styles.row}>
                    {skill.icon ? (
                      <skill.icon
                        size={18}
                        color={active ? "white" : darkMode === "light" ? "#111" : "#fff"}
                        style={{ marginRight: 10 }}
                      />
                    ) : (
                      <Text style={{ fontSize: 18, marginRight: 10 }}>{skill.emoji}</Text>
                    )}
                    <Text
                      style={{
                        color: active ? "white" : darkMode === "light" ? "#111" : "#fff",
                        fontWeight: active ? "700" : "500",
                      }}
                    >
                      {highlightMatch(label, search)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
            <Text style={{ color: "white", fontWeight: "600" }}>
              {App_Language?.startsWith("ar") ? "تم" : "Done"}
            </Text>
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
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
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
  row: { flexDirection: "row", alignItems: "center" },
});
