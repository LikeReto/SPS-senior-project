import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "@/src/Contexts/AuthContext";
import workers from "@/src/data/workers";
import { getDistance } from "@/src/utils/location";
import Header from "@/src/components/Home/Header";
import SectionTitle from "@/src/components/Home/SectionTitle";
import SuggestCard from "@/src/components/SuggestCard";
import WorkerCard from "@/src/components/WorkerCard";

export default function Home() {
  const { Expo_Router, darkMode, location } = useAuth();
  const isDark = darkMode === "dark";

  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [maxLoadings] = useState(12);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  let sortedWorkers = workers;
  if (location) {
    sortedWorkers = workers
      .map(w => ({
        ...w,
        distance: getDistance(location.latitude, location.longitude, w.latitude, w.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  const visibleWorkers = sortedWorkers.slice(0, visibleCount);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#0a0a0a" : "#fefefe" }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
    >
      <Header isDark={isDark} onSearch={() => Expo_Router.push("/search")} />

      <SectionTitle
        title="🔥 Suggested Experts"
        subtitle="AI-powered matches nearby"
        isDark={isDark}
      />

      <FlatList
        data={sortedWorkers.slice(0, 10)}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SuggestCard item={item} onPress={() => Expo_Router.push(`/worker/${item.id}`)} isDark={isDark} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 6 }}
      />

      <SectionTitle title="📍 Nearby Experts" isDark={isDark} />

      <View style={{ paddingHorizontal: 16 }}>
        {visibleWorkers.map((item) => (
          <WorkerCard key={item.id} item={item} onPress={() => Expo_Router.push(`/worker/${item.id}`)} isDark={isDark} />
        ))}
      </View>

      {visibleCount < sortedWorkers.length && (
        <TouchableOpacity
          style={[styles.viewMore, { backgroundColor: isDark ? "#1b1b1b" : "#10b981" }]}
          onPress={() => {
            // if the next load exceeds maxLoadings, push the all search screen
            if (visibleCount + 6 > maxLoadings) {
              Expo_Router.push("/search");
            }
            else {
              setVisibleCount((prev) => prev + 6)
            }
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Load More</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewMore: {
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 30,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});
