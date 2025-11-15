import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { useAuth } from "@/src/Contexts/AuthContext";
import { getDistance } from "@/src/utils/location";
import Header from "@/src/components/Home/Header";
import SectionTitle from "@/src/components/Home/SectionTitle";
import SuggestCard from "@/src/components/SuggestCard";
import WorkerCard from "@/src/components/WorkerCard";
import { useUser2Store } from "@/src/hooks/CurrentPage_States/useGlobal_States";
import { useSocket } from "@/src/Contexts/SocketContext";

export default function Home() {
  const { Expo_Router, App_Language, currentUser, darkMode, location, Providers, fetchWorkersData } = useAuth();
  const { getUserStatus } = useSocket();

  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const maxLoadings = 12;
  const [loading, setLoading] = useState(true);

  // --- Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchWorkersData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchWorkersData]);

  // --- Fetch on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      await onRefresh();
      setLoading(false);
    })();
  }, []);

  // --- Memoized sorted Providers by distance
  const sortedWorkers = useMemo(() => {
    if (!Providers) return [];
    if (!location) return Providers;

    return Providers
      .map((w) => ({
        ...w,
        distance: getDistance(
          location.latitude,
          location.longitude,
          w.latitude,
          w.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [Providers, location]);

  const visibleWorkers = useMemo(() => sortedWorkers?.slice(0, visibleCount), [sortedWorkers, visibleCount]);

  // --- Load more
  const handleLoadMore = useCallback(() => {
    if (visibleCount + 6 > maxLoadings) {
      Expo_Router.push("/search");
    } else {
      setVisibleCount((v) => v + 6);
    }
  }, [visibleCount, maxLoadings, Expo_Router]);

  // --- Profile navigation
  const handleProfilePress = useCallback(async (provider) => {
    try {
      if (provider?.User_$ID === currentUser?.$id) {
        Expo_Router.push("/myProfile");
      } else {
        await useUser2Store.getState().setUser2(provider);
        Expo_Router.push(`/worker/${provider.User_$ID}`);
      }
    } catch (error) {
      console.log("Error handling profile press:", error);
    }
  }, [currentUser, Expo_Router]);

  // --- Render Worker with real-time status
  const renderWorker = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);
      return (
        <WorkerCard
          item={item}
          onPress={() => handleProfilePress(item)}
          isCurrentUser={item.User_$ID === currentUser?.$id}
          isDark={darkMode !== "light"}
          userStatus={userStatus}
          App_Language={App_Language}
        />
      );
    },
    [currentUser, darkMode, getUserStatus, handleProfilePress, App_Language]
  );

  // --- Render Suggest Cards
  const renderSuggest = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);
      return (
        <SuggestCard
          item={item}
          onPress={() => handleProfilePress(item)}
          isCurrentUser={item.User_$ID === currentUser?.$id}
          isDark={darkMode !== "light"}
          App_Language={App_Language}
          userStatus={userStatus}
        />
      );
    },
    [currentUser, darkMode, handleProfilePress, App_Language, getUserStatus]
  );

  return (
    <FlatList
      data={visibleWorkers}
      keyExtractor={(item) => item.User_$ID}
      renderItem={renderWorker}
      refreshing={refreshing}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
      }
      style={{ flex: 1, backgroundColor: darkMode === "light" ? "#fefefe" : "#0a0a0a" }}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListHeaderComponent={
        <>
          <Header isDark={darkMode !== "light"} onSearch={() => Expo_Router.push("/search")} />

          <SectionTitle
            title="🔥 Suggested Experts"
            subtitle="AI-powered matches nearby"
            isDark={darkMode !== "light"}
          />

          {Providers?.length > 0 && (
            <FlatList
              data={Providers?.slice(0, 10)}
              horizontal
              keyExtractor={(item) => item?.User_$ID}
              renderItem={renderSuggest}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12, marginTop: 8 }}
            />
          )}

          <SectionTitle title="📍 Nearby Experts" isDark={darkMode !== "light"} />
        </>
      }
      ListFooterComponent={
        visibleCount < sortedWorkers?.length && (
          <TouchableOpacity
            style={[styles.viewMore, { backgroundColor: darkMode === "light" ? "#10b981" : "#1b1b1b" }]}
            onPress={handleLoadMore}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Load More</Text>
          </TouchableOpacity>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  viewMore: {
    marginTop: 14,
    marginBottom: 26,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});
