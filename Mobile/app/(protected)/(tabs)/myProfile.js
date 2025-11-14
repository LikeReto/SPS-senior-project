// app/(protected)/myProfile.js
import { useAuth } from "@/src/Contexts/AuthContext";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSocket } from "@/src/Contexts/SocketContext";
import StatusModal from "@/src/components/Sheets/ProfileStatus";
import MyProfileHeader from "@/src/components/Profile/Header";
import MyProfileCard from "@/src/components/Profile/profileCard";
import MySkills from "@/src/components/Profile/MySkills";
import MyProjects from "@/src/components/Profile/MyProjects";
import { skillsList } from "@/src/constants/Degrees_Fields";

export default function MyProfileScreen() {
  const {
    Expo_Router,
    App_Language,
    darkMode,
    currentUser,
    currentUser_Data,
    User_Status,
    setUser_Status,
  } = useAuth();

  const { isUserOnline, getUserStatus, updateUserStatus } = useSocket();

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // ⭐ Real-time online status for THIS profile user
  const userOnline = isUserOnline(currentUser?.$id);         // boolean
  const liveStatus = getUserStatus(currentUser?.$id);         // string (online/busy/etc.)


  // ⭐ When user selects new status
  const handleStatusChange = (status) => {
    setUser_Status(status);        // local
    updateUserStatus(status);      // socket real-time
  };
  
  // Refresh
  const handleRefresh = () => {
    try {
      Expo_Router.reload();
    }
    catch (error) {
      console.log("Error refreshing profile:", error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" }]}
      contentContainerStyle={{ paddingBottom: 50 }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={handleRefresh} />
      }
      
    >
      {/* --- Header Section --- */}
      <MyProfileHeader
        isUserLoggedIn={!!currentUser}
        userOnline={userOnline}                  // boolean
        liveStatus={liveStatus}                  // real-time status
        isDark={darkMode === "light" ? false : true}
        showStatusMenu={showStatusMenu}
        setShowStatusMenu={setShowStatusMenu}
        statusModalVisible={statusModalVisible}
        setStatusModalVisible={setStatusModalVisible}
      />

      {currentUser ? (
        <>
          {/* --- Profile Card Section --- */}
          <MyProfileCard
            isDark={darkMode === "light" ? false : true}
            currentUser={currentUser}
            currentUser_Data={currentUser_Data}
            fields
          />

          {/* --- My Skills Section --- */}
          <MySkills
            isDark={darkMode === "light" ? false : true}
            skills={currentUser_Data?.User_Skills || []}
            allSkills={skillsList} 
            App_Language={App_Language}
          />

          {/* --- My Projects Section --- */}
          <MyProjects
            isDark={darkMode === "light" ? false : true}
            projects={currentUser_Data?.User_Projects || []}
            App_Language={App_Language}
          />
        </>
      ) : (
        <View
          style={[
            styles.container,
            { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" },
          ]}
        >
          <Text
            style={{
              color: darkMode === "light" ? "#111" : "white",
              marginTop: 100,
              textAlign: "center",
            }}
          >
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
      )}

      {/* Status dropdown modal */}
      <StatusModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        currentStatus={User_Status}
        onSelectStatus={(s) => handleStatusChange(s)}   // ✨ FIX
        darkMode={darkMode}
        App_Language={App_Language}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
