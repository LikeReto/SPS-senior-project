import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useImagePicker from "@/src/hooks/CurrentUser/useImagePicker";
import { fixUploaded_File } from "@/src/utils/fixUploaded_File";
import { PREDEFINED_PROJECTS } from "@/src/constants/Degrees_Fields";

export default function AddProjectModal({
  visible,
  onClose,
  onSubmit,
  isDark,
  App_Language,
}) {
  const isArabic = App_Language.startsWith("ar");
  const { pickImage } = useImagePicker();

  const [step, setStep] = useState(1);
  const [projectTitle, setProjectTitle] = useState("");
  const [selectedProject_Type, setSelectedProject_Type] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  const STATUS_OPTIONS = [
    { key: "active", color: "#10b981" },
    { key: "inactive", color: "#f59e0b" },
    { key: "hidden", color: "#6b7280" },
  ];

  const resetAll = () => {
    setProjectTitle("");
    setDescription("");
    setImage(null);
    setPrice("");
    setStatus("active");
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!selectedProject_Type || !price) return;

    setLoading(true);
    let uploaded = null;

    try {
      if (image) uploaded = await fixUploaded_File(image);

      await onSubmit({
        Project_Title:
          projectTitle.length > 0 ? projectTitle : selectedProject_Type,
        Project_Type: selectedProject_Type,
        Project_Price: price,
        Project_Image: uploaded?.uri ? uploaded : null,
        Project_Description: description,
        Project_Status: status,
      });

      resetAll();
      onClose();
    } catch (err) {
      console.log("Project submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* BACKDROP */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      {/* BOTTOM SHEET */}
      <View
        style={[
          styles.sheet,
          { backgroundColor: isDark ? "#111" : "#ffffff" },
        ]}
      >
        <View
          style={[
            styles.dragLine,
            { backgroundColor: isDark ? "#555" : "#ccc" },
          ]}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* STEP 1 — CHOOSE TYPE */}
          {step === 1 && (
            <>
              <Text
                style={[
                  styles.title,
                  { color: isDark ? "white" : "#111" },
                ]}
              >
                {isArabic ? "اختر نوع المشروع" : "Select Project Type"}
              </Text>

              <View style={{ marginTop: 10 }}>
                {PREDEFINED_PROJECTS.map((p, index) => {
                  const label = isArabic ? p.ar : p.name;
                  const selected = selectedProject_Type === p.name;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.typeOption,
                        {
                          backgroundColor: selected
                            ? "#10b98122"
                            : isDark
                            ? "#1d1d1d"
                            : "#f1f1f1",
                        },
                      ]}
                      onPress={() => {
                        setSelectedProject_Type(p.name);
                        setStep(2);
                      }}
                    >
                      <Text
                        style={{
                          color: isDark ? "#fff" : "#111",
                          fontWeight: "600",
                        }}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* STEP 2 — DETAILS */}
          {step === 2 && (
            <>
              {/* BACK BTN */}
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  resetAll();
                  setStep(1);
                }}
              >
                <Ionicons name="chevron-back" size={20} color="#10b981" />
                <Text style={styles.backText}>
                  {isArabic ? "عودة" : "Back"}
                </Text>
              </TouchableOpacity>

              {/* IMAGE UPLOADER */}
              <TouchableOpacity
                style={[
                  styles.imagePicker,
                  {
                    borderColor: isDark ? "#10b98160" : "#10b98180",
                    backgroundColor: isDark ? "#0f0f0f" : "#fafafa",
                  },
                ]}
                onPress={async () => {
                  const picked = await pickImage({
                    multiple: false,
                    allowVideo: false,
                  });
                  if (picked) setImage(picked);
                }}
              >
                {image ? (
                  <Image source={{ uri: image.uri }} style={styles.previewImg} />
                ) : (
                  <>
                    <Ionicons
                      name="image-outline"
                      size={35}
                      color="#10b981"
                    />
                    <Text
                      style={{
                        marginTop: 6,
                        color: isDark ? "#ccc" : "#444",
                      }}
                    >
                      {isArabic ? "رفع صورة" : "Upload Image"}
                      <Text style={{ color: "#888" }}>
                        {isArabic ? " (اختياري)" : " (optional)"}
                      </Text>
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* TITLE */}
              <TextInput
                placeholder={
                  isArabic ? "عنوان المشروع..." : "Project Title..."
                }
                placeholderTextColor="#777"
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? "#1a1a1a" : "#f1f1f1",
                    color: isDark ? "white" : "#111",
                  },
                ]}
                value={projectTitle}
                onChangeText={setProjectTitle}
              />

              {/* PRICE */}
              <Text style={styles.requiredLabel}>*</Text>
              <TextInput
                placeholder={isArabic ? "السعر..." : "Price..."}
                placeholderTextColor="#777"
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? "#1a1a1a" : "#f1f1f1",
                    color: isDark ? "white" : "#111",
                    width: "50%",
                  },
                ]}
                value={price}
                onChangeText={setPrice}
              />

              {/* STATUS OPTIONS */}
              <Text
                style={[
                  styles.subLabel,
                  { color: isDark ? "#fff" : "#111" },
                ]}
              >
                {isArabic ? "الحالة" : "Status"}
              </Text>

              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map((item, index) => {
                  const active = status === item.key;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.statusOption,
                        {
                          borderColor: active ? item.color : "transparent",
                          backgroundColor: isDark
                            ? "#1a1a1a"
                            : "#f1f1f1",
                        },
                      ]}
                      onPress={() => setStatus(item.key)}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: item.color },
                        ]}
                      />
                      <Text
                        style={{
                          color: isDark ? "#fff" : "#111",
                          marginLeft: 6,
                        }}
                      >
                        {isArabic
                          ? item.key === "active"
                            ? "نشط"
                            : item.key === "inactive"
                            ? "غير نشط"
                            : "مخفي"
                          : item.key.charAt(0).toUpperCase() +
                            item.key.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* DESCRIPTION */}
              <TextInput
                placeholder={
                  isArabic
                    ? "الوصف (اختياري)"
                    : "Description (optional)"
                }
                placeholderTextColor="#777"
                style={[
                  styles.input,
                  {
                    height: 90,
                    backgroundColor: isDark ? "#1a1a1a" : "#f1f1f1",
                    color: isDark ? "white" : "#111",
                  },
                ]}
                multiline
                value={description}
                onChangeText={setDescription}
              />

              {/* SUBMIT */}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: "#10b981",
                    opacity: !selectedProject_Type || !price ? 0.4 : 1,
                  },
                ]}
                onPress={handleSubmit}
                disabled={!selectedProject_Type || !price || loading}
              >
                <Text style={styles.submitBtnText}>
                  {loading
                    ? isArabic
                      ? "جاري الإضافة..."
                      : "Adding..."
                    : isArabic
                    ? "إضافة المشروع"
                    : "Add Project"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "85%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 15,
  },

  dragLine: {
    width: 45,
    height: 5,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  typeOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backText: {
    marginLeft: 6,
    color: "#10b981",
    fontSize: 16,
    fontWeight: "600",
  },

  imagePicker: {
    width: "100%",
    height: 130,
    borderRadius: 12,
    borderWidth: 1.3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },

  previewImg: {
    width: "100%",
    height: "100%",
  },

  input: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  requiredLabel: {
    color: "#ff3333",
    marginBottom: -6,
    marginTop: -4,
    fontSize: 13,
  },

  subLabel: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 4,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1.2,
    borderRadius: 12,
    marginRight: 8,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },

  submitBtn: {
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },

  submitBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
