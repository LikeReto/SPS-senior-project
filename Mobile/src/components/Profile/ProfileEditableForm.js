import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CountryPicker from "react-native-country-picker-modal";

import DegreePicker from "@/src/components/Sheets/Degree-bottom-sheet";
import SkillsBottomSheet from "@/src/components/Sheets/SkillsBottomSheet";
import { useAuth } from "@/src/Contexts/AuthContext";
import { skillsList } from "@/src/constants/Degrees_Fields";
import useImagePicker from "@/src/hooks/CurrentUser/useImagePicker";
import { fixUploaded_File } from "@/src/utils/fixUploaded_File";

export default function ProfileEditableForm({
  onSave,
  showSkip = false,
  onSkip,
}) {
  const { App_Language, Expo_Router, darkMode, currentUser_Data } = useAuth();

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


  const { pickImage } = useImagePicker();


  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };


  const handleSave = async () => {
    if (!User_Name || !User_Job || !User_Degree || !User_UserName) {
      Alert.alert("Validation Error", "Name, Username, Job, and Degree are required!");
      return;
    }
    let fixed_ProfilePicture_response = ''

    try {
      setUpdatingLoading(true);
      if (User_Profile_Picture && User_Profile_Picture?.uri?.length > 0) {
        fixed_ProfilePicture_response = await fixUploaded_File(User_Profile_Picture);
      }
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
        User_Profile_Picture: fixed_ProfilePicture_response.length > 0 ? fixed_ProfilePicture_response : User_Profile_Picture,
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
        backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a",
      }}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Skip button */}
      {showSkip ? (
        <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 20 }}>
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={[styles.title, { color: darkMode === "light" ? "#111" : "white" }]}>
              {App_Language.startsWith("ar") ? "تخطى" : "Skip"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.header}>
          {Expo_Router.canGoBack() && (
            <TouchableOpacity onPress={() => Expo_Router.back()}>
              <Ionicons name="arrow-back" size={28} color={darkMode === "light" ? "#111" : "white"} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: darkMode === "light" ? "#111" : "white" }]}>
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
        <TouchableOpacity onPress={async () => {
          const pick_image_response = await pickImage({ multiple: false, allowVideo: false });
          if (pick_image_response) {
            setUser_Profile_Picture(pick_image_response);
          }
          else {
            console.log("❌ No image selected");
          }
        }}
          style={styles.imageContainer}
        >
          {User_Profile_Picture ? (
            <Image source={{ uri: User_Profile_Picture }} style={styles.image} />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={100}
              color={darkMode === "light" ? "#555" : "white"}
            />
          )}
          <Text style={{ marginTop: 8, color: "#10b981", fontWeight: "600" }}>
            {App_Language.startsWith("ar") ? "تغيير الصورة" : "Change Photo"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input fields */}
      <View style={styles.form}>
        <Field label={App_Language.startsWith("ar") ? "الاسم" : "Name"} value={User_Name} setValue={setUser_Name} isDark={darkMode === "dark"} />
        <Field label={App_Language.startsWith("ar") ? "اسم المستخدم" : "Username"} value={User_UserName} setValue={setUser_UserName} isDark={darkMode === "dark"} />
        <Field label={App_Language.startsWith("ar") ? "المسمى الوظيفي" : "Job"} value={User_Job} setValue={setUser_Job} isDark={darkMode === "dark"} />

        {/* Phone with country picker */}
        <Text style={[styles.label, { color: darkMode === "dark" ? "white" : "#111" }]}>
          {App_Language.startsWith("ar") ? "رقم الهاتف" : "Phone"}
        </Text>
        <View style={[styles.phoneContainer, { backgroundColor: darkMode === "dark" ? "#1a1a1a" : "#fff" }]}>
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
          <Text style={{ color: darkMode === "dark" ? "white" : "#111" }}>
            +{callingCode}
          </Text>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: "transparent", color: darkMode === "dark" ? "white" : "#111" }]}
            value={User_PhoneNumber}
            onChangeText={setUser_PhoneNumber}
            placeholder="Phone Number"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
          />
        </View>

        {/* Degree Picker */}
        <Text style={[styles.label, { color: darkMode === "dark" ? "white" : "#111" }]}>
          {App_Language.startsWith("ar") ? "الدرجة العلمية" : "Degree"}
        </Text>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: darkMode === "dark" ? "#1a1a1a" : "#fff" }]}
          onPress={() => setShowDegreeModal(true)}
        >
          <Text style={{ color: darkMode === "dark" ? "white" : "#111" }}>
            {User_Degree || (App_Language.startsWith("ar") ? "اختر الدرجة العلمية" : "Select Degree")}
          </Text>
        </TouchableOpacity>

        <DegreePicker
          visible={showDegreeModal}
          onClose={() => setShowDegreeModal(false)}
          onSelect={(deg) => setUser_Degree(deg)}
          selected={User_Degree}
          darkMode={darkMode}
          App_Language={App_Language}
        />

        {/* Skills Picker */}
        <Text style={[styles.label, { color: darkMode === "dark" ? "white" : "#111" }]}>
          {App_Language.startsWith("ar") ? "المهارات" : "Skills"}
        </Text>

        <ScrollView
          style={{ maxHeight: 120 }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: darkMode === "dark" ? "#1a1a1a" : "#fff",
                minHeight: 50,
                paddingVertical: 8,
                paddingHorizontal: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              },
            ]}
            onPress={() => setShowSkillsModal(true)}
          >
            {selectedSkills.length > 0 ? (
              selectedSkills.map((skillName) => {
                const skill = skillsList.find((s) => s.name === skillName);
                const label = App_Language.startsWith("ar") ? skill?.label?.ar || skillName : skill?.label?.en || skillName;

                return (
                  <View
                    key={skillName}
                    style={[
                      styles.skillTag,
                      {
                        backgroundColor: darkMode === "dark" ? "#292828FF" : "#e6f9f0",
                        marginRight: 6,
                        marginBottom: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      },
                    ]}
                  >
                    {skill?.icon ? (
                      <skill.icon
                        size={14}
                        color={darkMode === "dark" ? "#fff" : "#10b981"}
                        style={{ marginRight: 4 }}
                      />
                    ) : skill?.emoji ? (
                      <Text style={{ fontSize: 14, marginRight: 4 }}>{skill.emoji}</Text>
                    ) : null}

                    <Text style={{ color: darkMode === "dark" ? "#fff" : "#10b981", fontSize: 14 }}>
                      {label}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={{ color: darkMode === "dark" ? "#aaa" : "#888" }}>
                {App_Language.startsWith("ar") ? "اختر المهارات" : "Select Skills"}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <SkillsBottomSheet
          visible={showSkillsModal}
          onClose={() => setShowSkillsModal(false)}
          skills={skillsList}
          selectedSkills={selectedSkills}
          toggleSkill={toggleSkill}
          darkMode={darkMode}
          App_Language={App_Language}
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
    fontSize: 16,
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

