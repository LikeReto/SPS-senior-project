import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/src/Contexts/AuthContext";
import { getDistance } from "@/src/utils/location";
import Header from "@/src/components/Home/Header";
import SectionTitle from "@/src/components/Home/SectionTitle";
import SuggestCard from "@/src/components/SuggestCard";
import WorkerCard from "@/src/components/WorkerCard";

import TrendingCard from "@/src/components/TrendingCard";
import TopRatedCard from "@/src/components/TopRatedCard";
import NewExpertCard from "@/src/components/NewExpertCard";

import { useUser2Store } from "@/src/hooks/CurrentPage_States/useGlobal_States";
import { useSocket } from "@/src/Contexts/SocketContext";

import { getFinalHomeFeed } from "@/src/hooks/Search/FinalRankingEngine";
import { trackInteraction } from "@/src/hooks/Search/InteractionTracker";

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

  // AI + Smart Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newExperts, setNewExperts] = useState([]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchWorkersData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchWorkersData]);

  // Load on mount
  useEffect(() => {
    (async () => {
      await onRefresh();
    })();
  }, []);

  // Compute distance & sorting
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

  const visibleWorkers = sortedWorkers.slice(0, visibleCount);
  const validProviders = sortedWorkers.filter((w) => w.distance != null);

  // Load more
  const handleLoadMore = useCallback(() => {
    if (visibleCount + 6 > maxLoadings) {
      Expo_Router.push("/search");
    } else {
      setVisibleCount((v) => v + 6);
    }
  }, [visibleCount]);

  // Profile navigation
  const handleProfilePress = useCallback(
    async (provider) => {
      if (provider?.User_$ID === currentUser?.$id) {
        Expo_Router.push("/myProfile");
      } else {
        await useUser2Store.getState().setUser2(provider);
        Expo_Router.push(`/worker/${provider.User_$ID}`);
      }
    },
    [currentUser]
  );

  // Load AI suggestions, trending, top rated, new experts
  useEffect(() => {
    if (!validProviders.length) return;

    (async () => {
      // AI-ranked suggestions
      const ranked = await getFinalHomeFeed(validProviders, location);
      setSuggestions(
        // add top 10 suggestions without current user
        ranked
          .filter((w) => w.User_$ID !== currentUser?.$id)
          .slice(0, 10)
      );

      // Trending: based on views, interactions (fake logic)
      setTrending(validProviders.slice(0, 8));

      // Top Rated
      setTopRated(
        validProviders
          .filter((w) => (w.User_Rating || 0) >= 4.7)
          .sort((a, b) => b.User_Rating - a.User_Rating)
          .slice(0, 10)
      );

      // New Experts (joined last 30 days)
      setNewExperts(
        validProviders
          .filter(
            (w) =>
              w.createdAt &&
              Date.now() - new Date(w.createdAt).getTime() <
              30 * 24 * 60 * 60 * 1000
          )
          .slice(0, 10)
      );
    })();
  }, [validProviders, location]);



  // Render Suggest Card
  const renderSuggest = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);

      return (
        <SuggestCard
          App_Language={App_Language}
          item={item}
          distance={item.distance}
          onPress={async () => {
            await trackInteraction("open_profile", item.User_$ID);
            handleProfilePress(item);
          }}
          isCurrentUser={item.User_$ID === currentUser?.$id}
          isDark={darkMode !== "light"}
          userStatus={userStatus}
        />
      );
    },
    [currentUser, darkMode, handleProfilePress, App_Language, getUserStatus]
  );

  // Render Trending Card
  const renderTrending = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);
      return (
        <TrendingCard
          worker={item}
          isDark={darkMode !== "light"}
          isCurrentUser={item.User_$ID === currentUser?.$id}
          App_Language={App_Language}
          onPress={async () => {
            await trackInteraction("open_profile", item.User_$ID);
            handleProfilePress(item);
          }}
          userStatus={userStatus}
        />
      );
    },
    [darkMode, handleProfilePress, App_Language, getUserStatus]
  );

  // Render Top Rated Card
  const renderTopRated = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);
      return (
        <TopRatedCard
          worker={item}
          isDark={darkMode !== "light"}
          App_Language={App_Language}
          onPress={async () => {
            await trackInteraction("open_profile", item.User_$ID);
            handleProfilePress(item);
          }}
          userStatus={userStatus}
        />
      );
    },
    [darkMode, handleProfilePress, App_Language, getUserStatus]
  );

  // Render New Expert Card
  const renderNewExpert = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);
      return (
        <NewExpertCard
          worker={item}
          isDark={darkMode !== "light"}
          App_Language={App_Language}
          onPress={async () => {
            await trackInteraction("open_profile", item.User_$ID);
            handleProfilePress(item);
          }}
          userStatus={userStatus}
        />
      );
    },
    [darkMode, handleProfilePress, App_Language, getUserStatus]
  );

  // Render Worker Card
  const renderWorker = useCallback(
    ({ item }) => {
      const userStatus = getUserStatus(item?.User_$ID);

      return (
        <WorkerCard
          item={item}
          distance={item.distance}
          onPress={async () => {
            await trackInteraction("open_profile", item.User_$ID);
            handleProfilePress(item);
          }}
          isCurrentUser={item.User_$ID === currentUser?.$id}
          isDark={darkMode !== "light"}
          userStatus={userStatus}
          App_Language={App_Language}
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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#10b981"
        />
      }
      style={{
        flex: 1,
        backgroundColor: darkMode === "light" ? "#fefefe" : "#0a0a0a",
      }}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListHeaderComponent={
        <>
          <Header
            isDark={darkMode !== "light"}
            onSearch={() => Expo_Router.push("/search")}
          />

          {/* 🔥 Suggested Experts */}
          <SectionTitle
            title="🔥 Suggested Experts"
            subtitle="AI-powered matches nearby"
            isDark={darkMode !== "light"}
          />
          <FlatList
            data={suggestions}
            horizontal
            keyExtractor={(item) => item.User_$ID}
            renderItem={renderSuggest}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12, marginTop: 8 }}
          />

          {/* 📈 Trending */}
          <SectionTitle
            title="📈 Trending Now"
            subtitle="Experts gaining attention"
            isDark={darkMode !== "light"}
          />
          <FlatList
            data={trending}
            horizontal
            keyExtractor={(item) => item.User_$ID}
            renderItem={renderTrending}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12, marginTop: 8 }}
          />

          {/* ⭐ Top Rated */}
          <SectionTitle
            title="⭐ Top Rated"
            subtitle="Experts with highest ratings"
            isDark={darkMode !== "light"}
          />
          <FlatList
            data={topRated}
            horizontal
            keyExtractor={(item) => item.User_$ID}
            renderItem={renderTopRated}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12, marginTop: 8, gap: 5 }}
          />

          {/* ✨ New Experts */}
          <SectionTitle
            title="✨ New Experts"
            subtitle="Recently joined professionals"
            isDark={darkMode !== "light"}
          />
          <FlatList
            data={newExperts}
            horizontal
            keyExtractor={(item) => item.User_$ID}
            renderItem={renderNewExpert}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12, marginTop: 8 }}
          />

          {/* 📍 Nearby Experts */}
          <SectionTitle title="📍 Nearby Experts" isDark={darkMode !== "light"} />
        </>
      }
      ListFooterComponent={
        visibleCount < sortedWorkers.length && (
          <TouchableOpacity
            style={[
              styles.viewMore,
              {
                backgroundColor:
                  darkMode === "light" ? "#10b981" : "#1b1b1b",
              },
            ]}
            onPress={handleLoadMore}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Load More
            </Text>
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
