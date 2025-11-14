import { useAuth } from "@/src/Contexts/AuthContext";
import workers from "@/src/data/workers";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import axios from "axios";
import { useState } from "react";

export default function WorkerScreen() {
  const { Expo_Router, darkMode, currentUser } = useAuth();

  const { id } = useLocalSearchParams();
  const worker = workers.find((w) => w.id === id);

  const [loading, setLoading] = useState(false);

  if (!worker) {
    return (
      <View style={[styles.container, { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a"}]}>
        <Text style={{ color: darkMode === "light" ? "#111" : "white", fontSize: 18, textAlign: "center", marginTop: 100 }}>
          Worker not found
        </Text>
      </View>
    );
  }

  const skills = worker.skills || [];
  const degree = worker.degree || "High School";
  const phoneVisible = worker.phoneHidden !== true;

  const handleChatRequest = async () => {
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to start a chat.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API}/api/sps/create_new_Conversation`, {
        participants: [currentUser._id, worker.id],
      });

      const conversation = response.data;

      if (conversation.status === "pending") {
        Alert.alert("Request Sent", "Your chat request has been sent. Wait for the worker to accept.");
      } else if (conversation.status === "accepted") {
        // Go directly to chat screen
        Expo_Router.push(`/dm/${conversation._id}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to send chat request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a"}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Expo_Router.back()}>
          <Ionicons name="arrow-back" size={28} color={darkMode === "light" ? "#111" : "white"} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: darkMode === "light" ? "#111" : "white" }]}>{worker.User_Name}</Text>
      </View>

      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: darkMode === "light" ? "#fff" : "#1a1a1a" }]}>
        <Image source={{ uri: worker.image }} style={styles.image} />
        <Text style={[styles.name, { color: darkMode === "light" ? "#111" : "white" }]}>{worker.User_Name}</Text>
        <Text style={[styles.job, { color: darkMode === "light" ? "#00a36c" : "#10b981" }]}>{worker.User_Job}</Text>
        <Text style={{ color: darkMode === "light" ? "#111" : "white", marginTop: 2 }}>{degree}</Text>
        <Text style={{ color: darkMode === "light" ? "#555" : "#aaa", marginTop: 2 }}>
          {worker.freelancer ? "Freelancer" : "Employee"}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={phoneVisible ? "#10b981" : "#555"} />
          <Text style={{ marginLeft: 6, color: darkMode === "light" ? "#111" : "white" }}>
            {phoneVisible ? worker.phone : "Hidden"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={{ marginLeft: 6, color: darkMode === "light" ? "#111" : "white" }}>
            {worker.rating?.toFixed(1) || "0.0"}
          </Text>
        </View>

        {/* Chat Button */}
        <TouchableOpacity
          style={[styles.chatBtn, { backgroundColor: loading ? "#6ee7b7" : "#10b981" }]}
          onPress={handleChatRequest}
          disabled={loading}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {loading ? "Sending..." : "Chat"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Skills */}
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: darkMode === "light" ? "#111" : "white" }}>Skills</Text>
        <View style={styles.skills}>
          {skills.length === 0 ? (
            <Text style={{ color: darkMode === "light" ? "#555" : "#aaa", marginTop: 6 }}>No skills listed</Text>
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
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  chatBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  skills: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  skillTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 8, marginTop: 6 },
});
