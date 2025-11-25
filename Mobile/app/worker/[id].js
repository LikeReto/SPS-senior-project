// app/(protected)/WorkerProfile.js
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/src/Contexts/AuthContext";
import { useUser2Store } from "@/src/hooks/CurrentPage_States/useGlobal_States";
import { DEFAULT_PROFILE_PIC } from "@/src/constants/aConstants";

import WorkerHeader from "@/src/components/Profile/Worker/WorkerHeader";
import WorkerProfileCard from "@/src/components/Profile/Worker/WorkerProfileCard";
import WorkerSkills from "@/src/components/Profile/Worker/WorkerSkills";
import WorkerProjects from "@/src/components/Profile/Worker/WorkerProjects";
import UserReviews from "@/src/components/Profile/common/UserReviews";

import { skillsList } from "@/src/constants/Degrees_Fields";

import { useSocket } from "@/src/Contexts/SocketContext";

export default function WorkerScreen() {
  const { Expo_Router, darkMode, currentUser, App_Language } = useAuth();
  const user2Data = useUser2Store((state) => state.user2);

  const worker = useMemo(() => user2Data || {}, [user2Data]);

  const { getUserStatus } = useSocket();
  const userStatus = getUserStatus(worker?.User_$ID);


  useEffect(() => {
    return () => useUser2Store.getState().clearUser2();
  }, []);


  if (!worker.User_Name) {
    return (
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
          {App_Language.startsWith("ar")
            ? "العامل غير موجود"
            : "Worker not found"}
        </Text>
      </View>
    );
  }

  const imageUri =
    worker.User_Profile_Picture?.trim() || DEFAULT_PROFILE_PIC;

  const goToChat = async () => {
    if (!currentUser) return alert("You must be logged in");
    await useUser2Store.getState().setUser2(worker);

    Expo_Router.push({
      pathname: `/DM/${worker.User_$ID}`,
      params: {
        receiverId: worker.User_$ID,
        receiverName: worker.User_Name,
        receiverImage: worker.User_Profile_Picture,
      },
    });
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" },
      ]}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <WorkerHeader
        workerName={worker.User_Name}
        darkMode={darkMode}
        onBack={() => Expo_Router.back()}
        userStatus={userStatus}
        App_Language={App_Language}
      />

      <WorkerProfileCard
        isDark={darkMode === "light" ? false : true}
        worker={worker}
        imageUri={imageUri}
        onChatPress={goToChat}
        App_Language={App_Language}
      />

      <WorkerSkills
        isDark={darkMode === "light" ? false : true}
        skills={worker.User_Skills || []}
        allSkills={skillsList}
        App_Language={App_Language}
      />

      <WorkerProjects
        isDark={darkMode === "light" ? false : true}
        projects={worker.User_Projects || []}
        App_Language={App_Language}
        isCurrentUser={false}
      />
      <UserReviews
        userData={worker}
        isDark={darkMode === "dark"}
        App_Language={App_Language}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
