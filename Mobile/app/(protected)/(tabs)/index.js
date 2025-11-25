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
  const {
    Expo_Router,
    App_Language,
    currentUser,
    darkMode,
    location,
    Providers,
    fetchWorkersData,
  } = useAuth();
  const { getUserStatus } = useSocket();

  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const maxLoadings = 12;

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
      await onRefresh();
    })();
  }, []);

  // --- Compute distance & sort
  const sortedWorkers = useMemo(() => {
    if (!Providers) return [];
    if (!location) return Providers;

    return Providers.map((w) => {
      const lat = w?.User_Location_Coords?.latitude;
      const lng = w?.User_Location_Coords?.longitude;

      const distance =
        lat && lng
          ? getDistance(location.latitude, location.longitude, lat, lng)
          : null;

      return { ...w, distance };
    }).sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });
  }, [Providers, location]);

  // --- nearest only
  const visibleWorkers = sortedWorkers.slice(0, visibleCount);

  // --- providers WITH distance (for suggested)
  const validProviders = sortedWorkers.filter((w) => w.distance != null);

  // --- Load more
  const handleLoadMore = useCallback(() => {
    if (visibleCount + 6 > maxLoadings) {
      Expo_Router.push("/search");
    } else {
      setVisibleCount((v) => v + 6);
    }
  }, [visibleCount, maxLoadings, Expo_Router]);

  // --- Profile navigation
  const handleProfilePress = useCallback(
    async (provider) => {
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
    },
    [currentUser, Expo_Router]
  );

  // --- Render Worker Card
  const renderWorker = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);

      return (
        <WorkerCard
          item={item}
          distance={item.distance}
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

  // --- Render SuggestCard
  const renderSuggest = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);

      return (
        <SuggestCard
          App_Language={App_Language}
          item={item}
          distance={item.distance}
          onPress={() => handleProfilePress(item)}
          isCurrentUser={item.User_$ID === currentUser?.$id}
          isDark={darkMode !== "light"}
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
      }
      style={{
        flex: 1,
        backgroundColor: darkMode === "light" ? "#fefefe" : "#0a0a0a",
      }}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListHeaderComponent={
        <>
          <Header isDark={darkMode !== "light"} onSearch={() => Expo_Router.push("/search")} />

          <SectionTitle
            title="🔥 Suggested Experts"
            subtitle="AI-powered matches nearby"
            isDark={darkMode !== "light"}
          />

          <FlatList
            data={validProviders.slice(0, 10)}
            horizontal
            keyExtractor={(item) => item.User_$ID}
            renderItem={renderSuggest}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12, marginTop: 8 }}
          />

          <SectionTitle title="📍 Nearby Experts" isDark={darkMode !== "light"} />
        </>
      }
      ListFooterComponent={
        visibleCount < sortedWorkers.length && (
          <TouchableOpacity
            style={[
              styles.viewMore,
              { backgroundColor: darkMode === "light" ? "#10b981" : "#1b1b1b" },
            ]}
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
