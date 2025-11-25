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
  const isDark = darkMode === "dark";
  const isArabic = App_Language.startsWith("ar");

  const [UpdatingLoading, setUpdatingLoading] = useState(false);

  const [User_Name, setUser_Name] = useState(currentUser_Data?.User_Name || "");
  const [User_UserName, setUser_UserName] = useState(
    currentUser_Data?.User_UserName || ""
  );
  const [User_Job, setUser_Job] = useState(currentUser_Data?.User_Job || "");
  const [User_Freelancer, setUser_Freelancer] = useState(
    currentUser_Data?.User_Freelancer || false
  );
  const [User_PhoneNumber, setUser_PhoneNumber] = useState(
    currentUser_Data?.User_PhoneNumber || ""
  );
  const [User_Degree, setUser_Degree] = useState(
    currentUser_Data?.User_Degree || ""
  );
  const [User_Profile_Picture, setUser_Profile_Picture] = useState(
    currentUser_Data?.User_Profile_Picture || ""
  );
  const [selectedSkills, setSelectedSkills] = useState(
    currentUser_Data?.User_Skills || []
  );

  const [countryCode, setCountryCode] = useState(
    currentUser_Data?.User_CountryCode?.length > 1
      ? currentUser_Data?.User_CountryCode
      : "SA"
  );
  const [callingCode, setCallingCode] = useState(
    currentUser_Data?.User_CallingCode || "966"
  );

  const [showDegreeModal, setShowDegreeModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);

  const { pickImage } = useImagePicker();

  const profilePreviewUri =
    typeof User_Profile_Picture === "string"
      ? User_Profile_Picture
      : User_Profile_Picture?.uri;

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    if (!User_Name || !User_Job || !User_Degree || !User_UserName) {
      Alert.alert(
        isArabic ? "خطأ في التحقق" : "Validation Error",
        isArabic
          ? "الاسم واسم المستخدم والمسمى الوظيفي والدرجة مطلوبة!"
          : "Name, Username, Job, and Degree are required!"
      );
      return;
    }

    let fixed_ProfilePicture_response = "";

    try {
      setUpdatingLoading(true);

      if (
        User_Profile_Picture &&
        User_Profile_Picture?.uri?.length > 0
      ) {
        fixed_ProfilePicture_response = await fixUploaded_File(
          User_Profile_Picture
        );
      }

      const updatedData = {
        showSkip,
        _id: currentUser_Data?._id,
        User_Name,
        User_UserName,
        User_Job,
        User_Freelancer,
        User_PhoneNumber,
        User_CountryCode: countryCode,
        User_CallingCode: callingCode,
        User_Degree,
        User_Profile_Picture:
          fixed_ProfilePicture_response && fixed_ProfilePicture_response.uri
            ? fixed_ProfilePicture_response
            : User_Profile_Picture,
        User_Skills: selectedSkills,
        onBoarded_finished: true,
      };

      if (onSave) onSave(updatedData);
    } catch (error) {
      console.error("❌ Error in saving profile:", error?.message || error);
    } finally {
      setUpdatingLoading(false);
    }
  };

  return (
    <ScrollView
      style={[
        styles.screen,
        {
          backgroundColor: isDark ? "#0a0a0a" : "#FAFAFA",
        },
      ]}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* HEADER / SKIP */}
      <View style={styles.headerRow}>
        {showSkip ? (
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={onSkip}
              style={[
                styles.skipPill,
                { backgroundColor: isDark ? "#111827" : "#e5e7eb" },
              ]}
            >
              <Text
                style={[
                  styles.skipText,
                  { color: isDark ? "#e5e7eb" : "#111827" },
                ]}
              >
                {isArabic ? "تخطَّى" : "Skip"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {Expo_Router.canGoBack() && (
              <TouchableOpacity
                onPress={() => Expo_Router.back()}
                style={styles.backBtn}
              >
                <Ionicons
                  name={isArabic ? "arrow-forward" : "arrow-back"}
                  size={24}
                  color={isDark ? "#e5e7eb" : "#111827"}
                />
              </TouchableOpacity>
            )}
            <Text
              style={[
                styles.screenTitle,
                { color: isDark ? "#e5e7eb" : "#020617" },
              ]}
            >
              {isArabic ? "تعديل الملف الشخصي" : "Edit Profile"}
            </Text>
          </>
        )}
      </View>

      {/* AVATAR + FREELANCER TOGGLE */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          onPress={async () => {
            const pick_image_response = await pickImage({
              multiple: false,
              allowVideo: false,
            });
            if (pick_image_response) {
              setUser_Profile_Picture(pick_image_response);
            } else {
              console.log("❌ No image selected");
            }
          }}
          style={[
            styles.avatarWrapper,
            {
              borderColor: User_Profile_Picture
                ? "#10b981"
                : "rgba(148,163,184,0.8)",
            },
          ]}
        >
          {profilePreviewUri ? (
            <Image
              source={{ uri: profilePreviewUri }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={90}
              color={isDark ? "#64748b" : "#94a3b8"}
            />
          )}
          <View style={styles.avatarEditPill}>
            <Ionicons name="camera" size={14} color="#ecfdf5" />
            <Text style={styles.avatarEditText}>
              {isArabic ? "تغيير" : "Change"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUser_Freelancer(!User_Freelancer)}
          style={[
            styles.freelancerToggle,
            {
              backgroundColor: User_Freelancer
                ? "rgba(250, 204, 21, 0.12)"
                : isDark
                  ? "#020617"
                  : "#e5e7eb",
              borderColor: User_Freelancer ? "#FFD700" : "transparent",
            },
          ]}
        >
          <Ionicons
            name={User_Freelancer ? "star" : "star-outline"}
            size={16}
            color={User_Freelancer ? "#FFD700" : isDark ? "#e5e7eb" : "#111827"}
          />
          <Text
            style={[
              styles.freelancerText,
              {
                color: User_Freelancer
                  ? "#FFD700"
                  : isDark
                    ? "#e5e7eb"
                    : "#111827",
              },
            ]}
          >
            {isArabic ? "مستقل (Freelancer)" : "Freelancer"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CARD: BASIC INFO */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? "#020617" : "#ffffff",
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: isDark ? "#e5e7eb" : "#0f172a" },
          ]}
        >
          {isArabic ? "البيانات الأساسية" : "Basic Info"}
        </Text>

        <Field
          label={isArabic ? "الاسم الكامل" : "Full Name"}
          value={User_Name}
          setValue={setUser_Name}
          isDark={isDark}
          icon="person-outline"
        />

        <Field
          label={isArabic ? "اسم المستخدم" : "Username"}
          value={User_UserName}
          setValue={setUser_UserName}
          isDark={isDark}
          icon="at-outline"
        />

        <Field
          label={isArabic ? "المسمى الوظيفي" : "Job Title"}
          value={User_Job}
          setValue={setUser_Job}
          isDark={isDark}
          icon="briefcase-outline"
        />
      </View>

      {/* CARD: CONTACT */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? "#020617" : "#ffffff",
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: isDark ? "#e5e7eb" : "#0f172a" },
          ]}
        >
          {isArabic ? "التواصل" : "Contact"}
        </Text>

        <Text
          style={[
            styles.label,
            { color: isDark ? "#e5e7eb" : "#111827" },
          ]}
        >
          {isArabic ? "رقم الهاتف" : "Phone number"}
        </Text>

        <View
          style={[
            styles.phoneRow,
            {
              backgroundColor: isDark ? "#020617" : "#f9fafb",
              borderColor: isDark ? "#1e293b" : "#e5e7eb",
            },
          ]}
        >
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
          <Text
            style={{
              color: isDark ? "#e5e7eb" : "#111827",
              marginRight: 6,
              fontWeight: "600",
            }}
          >
            +{callingCode}
          </Text>
          <TextInput
            style={[
              styles.phoneInput,
              { color: isDark ? "#e5e7eb" : "#111827" },
            ]}
            value={User_PhoneNumber}
            onChangeText={setUser_PhoneNumber}
            placeholder={isArabic ? "رقم الهاتف" : "Phone number"}
            placeholderTextColor={isDark ? "#4b5563" : "#9ca3af"}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* CARD: EDUCATION & SKILLS */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? "#020617" : "#ffffff",
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: isDark ? "#e5e7eb" : "#0f172a" },
          ]}
        >
          {isArabic ? "التعليم والمهارات" : "Education & Skills"}
        </Text>

        {/* DEGREE PICKER */}
        <Text
          style={[
            styles.label,
            { color: isDark ? "#e5e7eb" : "#111827" },
          ]}
        >
          {isArabic ? "الدرجة العلمية" : "Degree"}
        </Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? "#020617" : "#f9fafb",
              borderColor: isDark ? "#1e293b" : "#e5e7eb",
            },
          ]}
          onPress={() => setShowDegreeModal(true)}
        >
          <Ionicons
            name="school-outline"
            size={18}
            color={isDark ? "#e5e7eb" : "#111827"}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: User_Degree
                ? isDark
                  ? "#e5e7eb"
                  : "#111827"
                : isDark
                  ? "#4b5563"
                  : "#9ca3af",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {User_Degree ||
              (isArabic ? "اختر الدرجة العلمية" : "Select degree")}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={isDark ? "#6b7280" : "#9ca3af"}
          />
        </TouchableOpacity>

        <DegreePicker
          visible={showDegreeModal}
          onClose={() => setShowDegreeModal(false)}
          onSelect={(deg) => setUser_Degree(deg)}
          selected={User_Degree}
          darkMode={darkMode}
          App_Language={App_Language}
        />

        {/* SKILLS PICKER */}
        <Text
          style={[
            styles.label,
            { color: isDark ? "#e5e7eb" : "#111827" },
          ]}
        >
          {isArabic ? "المهارات" : "Skills"}
        </Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? "#020617" : "#f9fafb",
              borderColor: isDark ? "#1e293b" : "#e5e7eb",
              minHeight: 56,
              paddingVertical: 8,
            },
          ]}
          onPress={() => setShowSkillsModal(true)}
          activeOpacity={0.9}
        >
          <Ionicons
            name="sparkles-outline"
            size={18}
            color={isDark ? "#e5e7eb" : "#111827"}
            style={{ marginRight: 8 }}
          />
          {selectedSkills.length > 0 ? (
            <View style={styles.skillsWrap}>
              {selectedSkills.map((skillName) => {
                const skill = skillsList.find((s) => s.name === skillName);
                const label = isArabic
                  ? skill?.label?.ar || skillName
                  : skill?.label?.en || skillName;

                return (
                  <View
                    key={skillName}
                    style={[
                      styles.skillTag,
                      {
                        backgroundColor: isDark
                          ? "#022c22"
                          : "rgba(16,185,129,0.09)",
                      },
                    ]}
                  >
                    {skill?.icon ? (
                      <skill.icon
                        size={13}
                        color={isDark ? "#a7f3d0" : "#047857"}
                        style={{ marginRight: 4 }}
                      />
                    ) : skill?.emoji ? (
                      <Text style={{ fontSize: 13, marginRight: 4 }}>
                        {skill.emoji}
                      </Text>
                    ) : null}
                    <Text
                      style={{
                        color: isDark ? "#a7f3d0" : "#047857",
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text
              style={{
                color: isDark ? "#4b5563" : "#9ca3af",
                flex: 1,
              }}
            >
              {isArabic ? "اختر المهارات" : "Select skills"}
            </Text>
          )}
          <Ionicons
            name="chevron-forward"
            size={18}
            color={isDark ? "#6b7280" : "#9ca3af"}
          />
        </TouchableOpacity>

        <SkillsBottomSheet
          visible={showSkillsModal}
          onClose={() => setShowSkillsModal(false)}
          skills={skillsList}
          selectedSkills={selectedSkills}
          toggleSkill={toggleSkill}
          darkMode={darkMode}
          App_Language={App_Language}
        />
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: UpdatingLoading ? "#15803d" : "#10b981",
            shadowColor: "#10b981",
          },
        ]}
        onPress={handleSave}
        disabled={UpdatingLoading}
        activeOpacity={0.9}
      >
        {UpdatingLoading ? (
          <ActivityIndicator color="#ecfdf5" />
        ) : (
          <>
            <Ionicons name="save-outline" size={18} color="#ecfdf5" />
            <Text style={styles.saveButtonText}>
              {isArabic ? "حفظ التغييرات" : "Save Changes"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* Reusable Field with Icon & pill style */
function Field({
  label,
  value,
  setValue,
  isDark,
  icon,
  keyboardType = "default",
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={[
          styles.label,
          { color: isDark ? "#e5e7eb" : "#111827" },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? "#020617" : "#f9fafb",
            borderColor: isDark ? "#1e293b" : "#e5e7eb",
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={isDark ? "#e5e7eb" : "#111827"}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          style={[
            styles.textInput,
            { color: isDark ? "#e5e7eb" : "#111827" },
          ]}
          value={value}
          onChangeText={setValue}
          placeholder={label}
          placeholderTextColor={isDark ? "#4b5563" : "#9ca3af"}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  skipPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  skipText: {
    fontWeight: "600",
    fontSize: 14,
  },

  /* AVATAR SECTION */
  avatarSection: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarEditPill: {
    position: "absolute",
    bottom: 4,
    right: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,118,110,0.95)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
  },
  avatarEditText: {
    color: "#ecfdf5",
    fontSize: 10,
    marginLeft: 3,
    fontWeight: "600",
  },

  freelancerToggle: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  freelancerText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },

  /* CARDS */
  card: {
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },

  /* LABELS / INPUTS */
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
  },

  /* PHONE */
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    marginTop: 2,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
  },

  /* SKILLS */
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  skillTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },

  /* SAVE BUTTON */
  saveButton: {
    marginTop: 20,
    marginHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  saveButtonText: {
    color: "#ecfdf5",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 6,
  },
});
