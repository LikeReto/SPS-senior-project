// app/(protected)/myProfile.js
import { useAuth } from "@/src/Contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSocket } from "@/src/Contexts/SocketContext";
import StatusModal from "@/src/components/Sheets/ProfileStatus";

export default function MyProfileScreen() {
  const { Expo_Router, App_Language, darkMode,
    currentUser, currentUser_Data, setCurrentUser_Data, User_Status, setUser_Status } = useAuth();
  const { isUserOnline } = useSocket();

  const isDark = darkMode === "dark";
  const userOnline = isUserOnline(currentUser?.$id);

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);



  const [skills, setSkills] = useState(currentUser_Data?.User_Skills || []);
  const [projects, setProjects] = useState(currentUser_Data?.projects || []);

  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState("");

  const handleSelectStatus = (status) => {
    setUser_Status(status);
    setShowStatusMenu(false);
  };

  const statusOptions = [
    { label: "Online", value: "online", color: "#10b981" },
    { label: "Busy", value: "busy", color: "#FFAA00" },
    { label: "Do Not Disturb", value: "do not disturb", color: "#FF0000" },
    { label: "Offline", value: "offline", color: "#888" },
  ];

  const addSkill = () => {
    if (newSkill.trim() === "") return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
    setCurrentUser_Data({ ...currentUser_Data, skills: [...skills, newSkill.trim()] });
  };

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    setCurrentUser_Data({ ...currentUser_Data, skills: updated });
  };

  const addProject = () => {
    if (newProject.trim() === "") return;
    setProjects([...projects, newProject.trim()]);
    setNewProject("");
    setCurrentUser_Data({ ...currentUser_Data, projects: [...projects, newProject.trim()] });
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    setCurrentUser_Data({ ...currentUser_Data, projects: updated });
  };

  const getStatusLabel = () => {
    if (!userOnline) return App_Language.startsWith("ar") ? "غير متصل" : "Offline";
    switch (User_Status) {
      case "online":
        return App_Language.startsWith("ar") ? "متصل" : "Online";
      case "busy":
      case "away":
        return App_Language.startsWith("ar") ? "مشغول" : "Busy";
      case "do not disturb":
        return App_Language.startsWith("ar") ? "عدم الإزعاج" : "Do Not Disturb";
      default:
        return App_Language.startsWith("ar") ? "غير متصل" : "Offline";
    }
  };

  const getStatusColor = () => {
    if (!userOnline) return "#888";
    switch (User_Status) {
      case "online":
        return "#10b981";
      case "busy":
      case "away":
        return "#FFAA00";
      case "do not disturb":
        return "#FF0000";
      default:
        return "#888";
    }
  };

  if (!currentUser) {
    return (
      <View
        style={[styles.container, { backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5" }]}
      >
        <Text style={{ color: isDark ? "white" : "#111", marginTop: 100, textAlign: "center" }}>
          {App_Language.startsWith("ar") ? "المستخدم غير موجود" : "User not found"}
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: "#10b981",
            padding: 12,
            borderRadius: 8,
            alignSelf: "center",
          }}
          onPress={() => Expo_Router.replace("/login")}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            {App_Language.startsWith("ar") ? "تسجيل الدخول" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5" }]}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStatusModalVisible(!statusModalVisible)}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: isDark ? "white" : "#111",
              }}
            >
              {getStatusLabel()}
            </Text>

            <Ionicons
              name="ellipse"
              size={12}
              color={getStatusColor()}
              style={{ marginLeft: 4 }}
            />
            <Ionicons
              name={showStatusMenu ? "chevron-up" : "chevron-down"}
              size={16}
              color={isDark ? "white" : "#111"}
            />
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity onPress={() => Expo_Router.push("/EditProfileScreen")}>
            <Ionicons name="create-outline" size={28} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Expo_Router.push("/Settings")}>
            <Ionicons name="settings-outline" size={28} color={isDark ? "white" : "#111"} />
          </TouchableOpacity>
        </View>
      </View>


      <View style={[styles.profileCard, { backgroundColor: isDark ? "#1a1a1a" : "#fff" }]}>
        {currentUser_Data && currentUser_Data.image ? (
          <Image source={{ uri: currentUser_Data?.image }} style={styles.image} />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={100}
            color={isDark ? "white" : "#555"}
          />
        )}

        <Text style={[styles.name, { color: isDark ? "white" : "#111" }]}>{currentUser?.name}</Text>
        <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
          {currentUser_Data?.User_Job}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={currentUser_Data?.User_PhoneNumber ? "#10b981" : "#555"} />
          <Text style={{ marginLeft: 6, color: isDark ? "white" : "#111" }}>
            {currentUser?.User_PhoneNumber?.length > 0 ? currentUser?.User_PhoneNumber : "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="school" size={20} color="#10b981" />
          <Text style={{ marginLeft: 6, color: isDark ? "white" : "#111" }}>
            {currentUser_Data?.User_Degree || "N/A"}
          </Text>
        </View>
      </View>

      {/* --- My Skills Section --- */}
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: isDark ? "white" : "#111" }}>
          {App_Language.startsWith("ar") ? "مهاراتي" : "My Skills"}
        </Text>
        <View style={styles.skills}>
          {skills.map((skill, index) => (
            <View
              key={index}
              style={[styles.skillTag, { backgroundColor: isDark ? "#292828FF" : "#e6f9f0" }]}
            >
              <Text style={{ color: isDark ? "white" : "#10b981" }}>{skill}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* if no skills, show placeholder text */}
          <Text
            style={{
              color: isDark ? "#aaa" : "#888",
              marginRight: 8,
              alignSelf: "center",
            }}
          >
            {skills.length === 0 ? App_Language.startsWith("ar") ? "لا توجد مهارات" : "No skills " : null}
          </Text>
        </View>
      </View>

      {/* --- My Projects Section --- */}
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: isDark ? "white" : "#111" }}>
          {App_Language.startsWith("ar") ? "مشاريعي" : "My Projects"}
        </Text>
        <View style={styles.skills}>
          {projects.map((project, index) => (
            <View
              key={index}
              style={[styles.skillTag, { backgroundColor: isDark ? "#0f0f0f" : "#e6f9f0" }]}
            >
              <Text style={{ color: isDark ? "white" : "#10b981" }}>{project}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* if no projects, show placeholder text */}
          <Text
            style={{
              color: isDark ? "#aaa" : "#888",
              marginRight: 8,
              alignSelf: "center",
            }}
          >
            {projects.length === 0 ? App_Language.startsWith("ar") ? "لا توجد مشاريع" : "No projects " : null}
          </Text>
        </View>
      </View>

      {/* Dropdown menu */}
      <StatusModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        currentStatus={User_Status}
        onSelectStatus={(s) => setUser_Status(s)}
        darkMode={darkMode}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "700" },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "700" },
  job: { fontSize: 15, marginTop: 2 },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  skills: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  skillTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
