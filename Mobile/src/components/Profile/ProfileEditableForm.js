import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CountryPicker from "react-native-country-picker-modal";

import DegreePicker from "@/src/components/Sheets/Degree-bottom-sheet";
import SkillsBottomSheet from "@/src/components/Sheets/SkillsBottomSheet";
import { useAuth } from "@/src/Contexts/AuthContext";

export default function ProfileEditableForm({
  onSave,
  showSkip = false,
  onSkip,
}) {
  const { App_Language, Expo_Router, darkMode, currentUser_Data } = useAuth();
  const isDark = darkMode === "dark";

  const [UpdatingLoading, setUpdatingLoading] = useState(false);
  const [User_Name, setUser_Name] = useState(currentUser_Data?.User_Name || "");
  const [User_UserName, setUser_UserName] = useState(currentUser_Data?.User_UserName || "");
  const [User_Job, setUser_Job] = useState(currentUser_Data?.User_Job || "");
  const [User_PhoneNumber, setUser_PhoneNumber] = useState(currentUser_Data?.User_PhoneNumber || "");
  const [User_Degree, setUser_Degree] = useState(currentUser_Data?.User_Degree || "");
  const [User_Profile_Picture, setUser_Profile_Picture] = useState(currentUser_Data?.User_Profile_Picture || "");
  const [selectedSkills, setSelectedSkills] = useState(currentUser_Data?.User_Skills || []);

  const [countryCode, setCountryCode] = useState(currentUser_Data?.User_CountryCode?.length > 4
    ? currentUser_Data?.User_CountryCode
    : "SA");
  const [callingCode, setCallingCode] = useState(currentUser_Data?.User_CallingCode || "966");

  const [showDegreeModal, setShowDegreeModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);

  const skillsList = [
    "Programming",
    "Web Design",
    "Video Editing",
    "Plumbing",
    "Electrician",
    "Carpentry",
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const pickImage = async () => {
    try {
      const { status } =
        Platform.OS !== "web"
          ? await ImagePicker.requestMediaLibraryPermissionsAsync()
          : { status: "granted" };

      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need access to your photos!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUser_Profile_Picture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick an image.");
      console.error("❌ Image Picker Error:", error);
    }
  };

  const handleSave = () => {
    if (!User_Name || !User_Job || !User_Degree || !User_UserName) {
      Alert.alert("Validation Error", "Name, Username, Job, and Degree are required!");
      return;
    }

    try {
      setUpdatingLoading(true);
      const updatedData = {
        showSkip: showSkip,
        _id: currentUser_Data?._id,
        User_Name,
        User_UserName,
        User_Job,
        User_PhoneNumber: User_PhoneNumber,
        User_CountryCode: countryCode,
        User_CallingCode: callingCode,
        User_Degree,
        User_Profile_Picture,
        User_Skills: selectedSkills,
        onBoarded_finished: true,
      };

      if (onSave) onSave(updatedData);
    }
    catch (error) {
      console.error("❌ Error in saving profile:", error.message);
    }
    finally {
      setUpdatingLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5"
      }}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Skip button */}
      {showSkip ? (
        <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 20 }}>
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={[styles.title, { color: isDark ? "white" : "#111" }]}>
              {App_Language.startsWith("ar") ? "تخطى" : "Skip"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.header}>
          {Expo_Router.canGoBack() && (
            <TouchableOpacity onPress={() => Expo_Router.back()}>
              <Ionicons name="arrow-back" size={28} color={isDark ? "white" : "#111"} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: isDark ? "white" : "#111" }]}>
            {App_Language.startsWith("ar") ? "تعديل الملف الشخصي" : "Edit Profile"}
          </Text>
        </View>
      )}

      {/* Profile Image */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {User_Profile_Picture ? (
            <Image source={{ uri: User_Profile_Picture }} style={styles.image} />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={100}
              color={isDark ? "white" : "#555"}
            />
          )}
          <Text style={{ marginTop: 8, color: "#10b981", fontWeight: "600" }}>
            {App_Language.startsWith("ar") ? "تغيير الصورة" : "Change Photo"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input fields */}
      <View style={styles.form}>
        <Field label={App_Language.startsWith("ar") ? "الاسم" : "Name"} value={User_Name} setValue={setUser_Name} isDark={isDark} />
        <Field label={App_Language.startsWith("ar") ? "اسم المستخدم" : "Username"} value={User_UserName} setValue={setUser_UserName} isDark={isDark} />
        <Field label={App_Language.startsWith("ar") ? "المسمى الوظيفي" : "Job"} value={User_Job} setValue={setUser_Job} isDark={isDark} />

        {/* Phone with country picker */}
        <Text style={[styles.label, { color: isDark ? "white" : "#111" }]}>
          {App_Language.startsWith("ar") ? "رقم الهاتف" : "Phone"}
        </Text>
        <View style={[styles.phoneContainer, { backgroundColor: isDark ? "#1a1a1a" : "#fff" }]}>
          <CountryPicker
            countryCode={countryCode}
            withFlag
            withCallingCode
            withFilter
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />
          <Text style={{ color: isDark ? "white" : "#111" }}>
            +{callingCode}
          </Text>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: "transparent", color: isDark ? "white" : "#111" }]}
            value={User_PhoneNumber}
            onChangeText={setUser_PhoneNumber}
            placeholder="Phone Number"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
          />
        </View>

        {/* Degree Picker */}
        <Text style={[styles.label, { color: isDark ? "white" : "#111" }]}>
          {App_Language.startsWith("ar") ? "الدرجة العلمية" : "Degree"}
        </Text>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: isDark ? "#1a1a1a" : "#fff" }]}
          onPress={() => setShowDegreeModal(true)}
        >
          <Text style={{ color: isDark ? "white" : "#111" }}>
            {User_Degree || (App_Language.startsWith("ar") ? "اختر الدرجة العلمية" : "Select Degree")}
          </Text>
        </TouchableOpacity>

        <DegreePicker
          visible={showDegreeModal}
          onClose={() => setShowDegreeModal(false)}
          onSelect={(deg) => setUser_Degree(deg)}
          selected={User_Degree}
          darkMode={darkMode}
        />

        {/* Skills Picker */}
        <Text style={[styles.label, { color: isDark ? "white" : "#111" }]}>
          {App_Language.startsWith("ar") ? "المهارات" : "Skills"}
        </Text>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: isDark ? "#1a1a1a" : "#fff" }]}
          onPress={() => setShowSkillsModal(true)}
        >
          <Text style={{ color: isDark ? "white" : "#111" }}>
            {selectedSkills.length > 0 ? selectedSkills.join(", ") : "Select Skills"}
          </Text>
        </TouchableOpacity>

        <SkillsBottomSheet
          visible={showSkillsModal}
          onClose={() => setShowSkillsModal(false)}
          skills={skillsList}
          selectedSkills={selectedSkills}
          toggleSkill={toggleSkill}
          darkMode={darkMode}
        />

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: UpdatingLoading ? "#323533FF" : "#10b981" }]}
          onPress={handleSave}
          disabled={UpdatingLoading}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {UpdatingLoading ? <ActivityIndicator color="#fff" /> : App_Language.startsWith("ar") ? "حفظ" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* Reusable Field Subcomponent */
function Field({ label, value, setValue, isDark, keyboardType = "default" }) {
  return (
    <>
      <Text style={[styles.label, { color: isDark ? "white" : "#111" }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: isDark ? "#1a1a1a" : "#fff", color: isDark ? "white" : "#111" }]}
        value={value}
        onChangeText={setValue}
        placeholder={label}
        placeholderTextColor="#666"
        keyboardType={keyboardType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 60,
    padding: 5,
    justifyContent: "center",

  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  form: {
    marginHorizontal: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  skipButton: {
    backgroundColor: "#484B4AFF",
    padding: 8,
    borderRadius: 20,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 16,
  },
});

