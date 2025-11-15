import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import WorkerCard from "@/src/components/WorkerCard";
import { useUser2Store } from "@/src/hooks/CurrentPage_States/useGlobal_States";
import { useSocket } from "@/src/Contexts/SocketContext";

// Distance calculation
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Search() {
  const { Expo_Router, currentUser, darkMode, Providers, location, App_Language } = useAuth();
  const { getUserStatus } = useSocket();

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("nearest");
  const [visibleCount, setVisibleCount] = useState(6); // initially show 6
  const increment = 6;

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

  // Filter & sort workers safely
  const filteredWorkers = useMemo(() => {
    if (!Providers || !Array.isArray(Providers)) return [];

    let workers = Providers.map((w) => ({
      ...w,
      distance: location
        ? getDistance(location.latitude, location.longitude, w.latitude, w.longitude)
        : null,
      rating: Number(w?.User_Rating) || 0,
    }));

    if (query) {
      workers = workers.filter(
        (w) =>
          (w.User_Name || "").toLowerCase().includes(query.toLowerCase()) ||
          (w.User_Job || "").toLowerCase().includes(query.toLowerCase())
      );
    }

    if (!query) {
      if (sortBy === "nearest") workers.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      else if (sortBy === "top") workers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return workers.slice(0, visibleCount);
  }, [Providers, query, sortBy, location, visibleCount]);

  const loadMoreWorkers = useCallback(() => {
    if (visibleCount < Providers.length) {
      setVisibleCount((prev) => Math.min(prev + increment, Providers.length));
    }
  }, [visibleCount, Providers]);

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
    [currentUser, darkMode, getUserStatus, handleProfilePress]
  );

  if (!Providers) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" },
        ]}
      >
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" }]}>
      {/* Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Expo_Router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={darkMode === "light" ? "#111" : "#fff"} />
        </TouchableOpacity>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search workers..."
          placeholderTextColor={darkMode === "light" ? "#888" : "#aaa"}
          style={[
            styles.searchInput,
            { backgroundColor: darkMode === "light" ? "#fff" : "#1f1f1f", color: darkMode === "light" ? "#111" : "#fff" },
          ]}
        />

        {query ? (
          <TouchableOpacity onPress={() => setQuery("")} style={styles.clearButton}>
            <Ionicons name="close" size={20} color={darkMode === "light" ? "#111" : "#fff"} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity
          onPress={() => setSortBy("nearest")}
          style={[
            styles.filterButton,
            { backgroundColor: sortBy === "nearest" ? "#10b981" : darkMode === "light" ? "#e6f9f0" : "#1f1f1f" },
          ]}
        >
          <Text style={{ color: sortBy === "nearest" ? "#fff" : darkMode === "light" ? "#111" : "#fff" }}>Nearest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortBy("top")}
          style={[
            styles.filterButton,
            { backgroundColor: sortBy === "top" ? "#10b981" : darkMode === "light" ? "#e6f9f0" : "#1f1f1f" },
          ]}
        >
          <Text style={{ color: sortBy === "top" ? "#fff" : darkMode === "light" ? "#111" : "#fff" }}>Top Rated</Text>
        </TouchableOpacity>
      </View>

      {/* Workers List */}
      <FlatList
        data={filteredWorkers}
        keyExtractor={(item) => item.User_$ID}
        renderItem={renderWorker}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={loadMoreWorkers}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header & Search Bar
  header: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 10,
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
  },

  // Filters
  filters: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
