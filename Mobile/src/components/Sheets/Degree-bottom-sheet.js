import React, { useState, useEffect } from "react";
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
  darkMode,
  selected,
  App_Language,
}) {
  const [step, setStep] = useState(1);
  const [tempDegree, setTempDegree] = useState("");
  const [tempField, setTempField] = useState("");
  const [search, setSearch] = useState("");

  // Parse the selected value on open
  useEffect(() => {
    if (selected?.includes(" in ")) {
      const [deg, field] = selected.split(" in ");
      setTempDegree(deg);
      setTempField(field);
      setStep(2);
    } else if (selected) {
      setTempDegree(selected);
      setTempField("");
      setStep(selected === "High School" ? 1 : 2);
    } else {
      setTempDegree("");
      setTempField("");
      setStep(1);
    }
  }, [selected, visible]);

  const filteredFields = fields.filter((f) => {
    const label = App_Language?.startsWith("ar") ? f.label.ar : f.label.en;
    return label.toLowerCase().includes(search.toLowerCase());
  });

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
    setTempField(field);
    onSelect(`${tempDegree} in ${field}`);
    onClose();
    setStep(1);
  };

  const closeSheet = () => {
    setStep(1);
    onClose();
  };

  // ⭐ Highlight matched letters in yellow
  const highlightMatch = (text, query) => {
    if (!query) return <Text>{text}</Text>;
    const regex = new RegExp(`(${query})`, "i");
    const parts = text.split(regex);
    return (
      <Text>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Text key={i} style={{ backgroundColor: "yellow" }}>
              {part}
            </Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={styles.backdrop} onPress={closeSheet} />

      <View
        style={[
          styles.sheet,
          { backgroundColor: darkMode === "light" ? "#ffffff" : "#1a1a1a" },
        ]}
      >
        <View style={styles.dragLine} />

        {/* STEP 1: Select Degree */}
        {step === 1 && (
          <>
            <Text
              style={[
                styles.title,
                { color: darkMode === "light" ? "#111" : "#fff" },
              ]}
            >
              {App_Language?.startsWith("ar") ? "اختر الدرجة العلمية" : "Select Degree"}
            </Text>

            <FlatList
              data={degrees}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => {
                const isSelected = item.title === tempDegree;
                const label = App_Language?.startsWith("ar") ? item.label?.ar ?? item.title : item.label?.en ?? item.title;

                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      isSelected && {
                        backgroundColor:
                          darkMode === "light" ? "#d1fae5" : "#064e3b33",
                      },
                    ]}
                    onPress={() => handleDegreeSelect(item.title)}
                  >
                    <View style={styles.row}>
                      {item.icon ? (
                        <Ionicons
                          name={item.icon}
                          size={22}
                          color={
                            isSelected ? "#10b981" : darkMode === "light" ? "#111" : "#fff"
                          }
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
                          {
                            color: isSelected ? "#10b981" : darkMode === "light" ? "#111" : "#fff",
                          },
                        ]}
                      >
                        {highlightMatch(label, search)}
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
            <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={20} color="#10b981" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.title,
                { color: darkMode === "light" ? "#111" : "#fff" },
              ]}
            >
              {tempDegree}
               — {App_Language?.startsWith("ar") ? "اختر المجال" : "Select Field"}
            </Text>

            {/* Search */}
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: darkMode === "light" ? "#f3f3f3" : "#1a1a1a",
                  color: darkMode === "light" ? "#111" : "#fff",
                },
              ]}
              placeholder="Search field..."
              placeholderTextColor={darkMode === "light" ? "#777" : "#777"}
              value={search}
              onChangeText={setSearch}
            />

            <FlatList
              data={filteredFields}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => {
                const label = App_Language?.startsWith("ar") ? item.label?.ar ?? item.name : item.label?.en ?? item.name;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      tempField === item.name && {
                        backgroundColor:
                          darkMode === "light" ? "#d1fae5" : "#064e3b33",
                      },
                    ]}
                    onPress={() => handleFieldSelect(item.name)}
                  >
                    <View style={styles.row}>
                      {item.icon ? (
                        <item.icon
                          size={20}
                          color={darkMode === "light" ? "#111" : "#fff"}
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
                          { color: darkMode === "light" ? "#111" : "#fff" },
                        ]}
                      >
                        {highlightMatch(label, search)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
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
    fontSize: 17,
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
  backText: {
    color: "#10b981",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 4,
  },
});
