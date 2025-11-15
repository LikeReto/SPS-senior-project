import { useMemo, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useUser2Store } from '@/src/hooks/CurrentPage_States/useGlobal_States';
import { useAuth } from "@/src/Contexts/AuthContext";

export default function WorkerScreen() {
  const { Expo_Router, darkMode, currentUser } = useAuth();
  const { id } = useLocalSearchParams();
  const user2Data = useUser2Store((state) => state.user2);

  const worker = useMemo(() => user2Data || {}, [user2Data]);

  useEffect(() => {
    return () => {
      useUser2Store.getState().clearUser2();
    };
  }, []);

  if (!worker || !worker?.User_Name) {
    return (
      <View style={[styles.container, { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" }]}>
        <Text style={[styles.notFoundText, { color: darkMode === "light" ? "#111" : "white" }]}>
          Worker not found
        </Text>
      </View>
    );
  }

  const skills = worker.skills || [];
  const degree = worker.degree || "High School";
  const phoneVisible = worker.phoneHidden !== true;

  // ⭐ SAFE IMAGE
  const imageUri =
    worker?.User_Profile_Picture && worker?.User_Profile_Picture !== ""
      ? worker?.User_Profile_Picture
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  const goToChat = async () => {
    if (!currentUser) return alert("You must be logged in");

    await useUser2Store.getState().setUser2(worker);
    // ✔ New rule → just go to chat screen
    Expo_Router.push(`/DM/${worker.User_$ID}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Expo_Router.back()}>
          <Ionicons name="arrow-back" size={28} color={darkMode === "light" ? "#111" : "white"} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: darkMode === "light" ? "#111" : "white" }]}>{worker.User_Name}</Text>
      </View>

      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: darkMode === "light" ? "#fff" : "#1a1a1a" }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <Text style={[styles.name, { color: darkMode === "light" ? "#111" : "white" }]}>{worker.User_Name}</Text>
        <Text style={[styles.job, { color: darkMode === "light" ? "#00a36c" : "#10b981" }]}>{worker.User_Job}</Text>
        <Text style={[styles.degree, { color: darkMode === "light" ? "#111" : "white" }]}>{degree}</Text>
        <Text style={[styles.freelancerText, { color: darkMode === "light" ? "#555" : "#aaa" }]}>
          {worker.freelancer ? "Freelancer" : "Employee"}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={phoneVisible ? "#10b981" : "#555"} />
          <Text style={[styles.infoText, { color: darkMode === "light" ? "#111" : "white" }]}>
            {phoneVisible ? worker.phone : "Hidden"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={[styles.infoText, { color: darkMode === "light" ? "#111" : "white" }]}>
            {worker.rating?.toFixed(1) || "0.0"}
          </Text>
        </View>

        {/* ⭐ NEW CLEAN CHAT BUTTON */}
        <TouchableOpacity style={styles.chatBtn} onPress={goToChat}>
          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Skills */}
      <View style={styles.skillsContainer}>
        <Text style={[styles.skillsTitle, { color: darkMode === "light" ? "#111" : "white" }]}>Skills</Text>
        <View style={styles.skills}>
          {skills.length === 0 ? (
            <Text style={[styles.noSkillsText, { color: darkMode === "light" ? "#555" : "#aaa" }]}>No skills listed</Text>
          ) : (
            skills.map((skill, index) => (
              <View
                key={index}
                style={[styles.skillTag, { backgroundColor: darkMode === "light" ? "#e6f9f0" : "#0f0f0f" }]}
              >
                <Text style={{ color: darkMode === "light" ? "#10b981" : "white" }}>{skill}</Text>
              </View>
            ))
          )}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFoundText: { fontSize: 18, textAlign: "center", marginTop: 100 },
  header: { flexDirection: "row", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginLeft: 16 },

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
  degree: { marginTop: 2 },
  freelancerText: { marginTop: 2 },

  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  infoText: { marginLeft: 6 },

  chatBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#10b981",
  },
  chatBtnText: { color: "white", fontWeight: "700" },

  skillsContainer: { marginHorizontal: 20, marginTop: 20 },
  skillsTitle: { fontSize: 18, fontWeight: "700" },
  skills: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  skillTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 8, marginTop: 6 },
  noSkillsText: { marginTop: 6 },
});
