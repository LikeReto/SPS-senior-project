import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { degrees, fields } from "@/src/constants/Degrees_Fields";

export default function DegreePicker({
  visible,
  onClose,
  onSelect,
  darkMode = "light",
  selected,
}) {
  const isDark = darkMode === "dark";

  const [step, setStep] = useState(1);
  const [tempDegree, setTempDegree] = useState(selected || "");
  const [search, setSearch] = useState("");

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDegreeSelect = (deg) => {
    if (deg === "High School") {
      onSelect("High School");
      onClose();
      return;
    }

    setTempDegree(deg);
    setStep(2);
  };

  const handleFieldSelect = (field) => {
    onSelect(`${tempDegree} in ${field}`);
    onClose();
    setStep(1);
  };

  const closeSheet = () => {
    setStep(1);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={styles.backdrop} onPress={closeSheet} />

      <View
        style={[
          styles.sheet,
          { backgroundColor: isDark ? "#0f0f0f" : "#fff" },
        ]}
      >
        <View style={styles.dragLine} />

        {/* STEP 1: Select Degree */}
        {step === 1 && (
          <>
            <Text
              style={[styles.title, { color: isDark ? "#fff" : "#111" }]}
            >
              Select Degree
            </Text>

            <FlatList
              data={degrees}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => {
                const isSelected = item.title === selected;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      isSelected && {
                        backgroundColor: isDark ? "#222" : "#eaeaea",
                      },
                    ]}
                    onPress={() => handleDegreeSelect(item.title)}
                  >
                    <View style={styles.row}>
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={
                          isSelected
                            ? "#10b981"
                            : isDark
                            ? "#fff"
                            : "#111"
                        }
                        style={{ marginRight: 10 }}
                      />
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: isSelected
                              ? "#10b981"
                              : isDark
                              ? "#fff"
                              : "#111",
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}

        {/* STEP 2: Select Field */}
        {step === 2 && (
          <>
            <TouchableOpacity
              onPress={() => setStep(1)}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={20} color="#10b981" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text
              style={[styles.title, { color: isDark ? "#fff" : "#111" }]}
            >
              {tempDegree} — Choose Field
            </Text>

            {/* Search */}
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: isDark ? "#1a1a1a" : "#f3f3f3",
                  color: isDark ? "#fff" : "#111",
                },
              ]}
              placeholder="Search field..."
              placeholderTextColor={isDark ? "#777" : "#777"}
              value={search}
              onChangeText={setSearch}
            />

            <FlatList
              data={filteredFields}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleFieldSelect(item.name)}
                >
                  <View style={styles.row}>
                    {/* ICON OR EMOJI */}
                    {item.icon ? (
                      <item.icon
                        size={20}
                        color={isDark ? "#fff" : "#111"}
                        style={{ marginRight: 10 }}
                      />
                    ) : (
                      <Text style={{ fontSize: 18, marginRight: 10 }}>
                        {item.emoji}
                      </Text>
                    )}

                    <Text
                      style={[
                        styles.optionText,
                        { color: isDark ? "#fff" : "#111" },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    height: "60%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingTop: 10,
  },
  dragLine: {
    width: 45,
    height: 5,
    backgroundColor: "#777",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  row: { flexDirection: "row", alignItems: "center" },
  optionText: {
    fontSize: 16,
  },
  searchInput: {
    marginHorizontal: 15,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingBottom: 8,
  },
  backText: { color: "#10b981", fontSize: 15, fontWeight: "600", marginLeft: 4 },
});
