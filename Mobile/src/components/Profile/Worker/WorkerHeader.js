// src/components/Profile/WorkerHeader.js
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getStatusColor,
  getStatusLabel
} from "@/src/utils/USER/statusHelpers";

export default function WorkerHeader({ workerName, App_Language, darkMode, onBack, userStatus }) {
  const statusColor = getStatusColor(userStatus);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={darkMode === "dark" ? "white" : "#111"}
        />
      </TouchableOpacity>

      <View>
        <Text
          style={[
            styles.title,
            { color: darkMode === "dark" ? "white" : "#111" },
          ]}
        >
          {workerName}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 3
          }}
        >
          {/* STATUS DOT */}
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />

          {/* STATUS LABEL */}
          <Text style={[styles.statusText, { color: getStatusColor(userStatus) }]}>
            {getStatusLabel({
              userOnline: userStatus !== "offline",
              liveStatus: userStatus,
              App_Language
            })}
          </Text>
        </View>
      </View>

      <View style={{ width: 28 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 7,
    position: "relative",
    borderWidth: 2,
    borderColor: "#fff",
  },
  statusText: { fontSize: 12, fontWeight: "500", marginLeft: 4 },

});
