import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { useAuth } from "@/src/Contexts/AuthContext";
import { useSocket } from "@/src/Contexts/SocketContext";

import SearchHeader from "@/src/components/Search/SearchHeader";
import SortButtons from "@/src/components/Search/SortButtons";
import CategoryList from "@/src/components/Search/CategoryList";
import WorkersList from "@/src/components/Search/WorkersList";

import useWorkersFilter from "@/src/hooks/Search/useWorkersFilter";


export default function Search() {
  const {
    Expo_Router,
    currentUser,
    darkMode,
    Providers,
    location,
    App_Language,
    fetchWorkersData,
  } = useAuth();

  const { getUserStatus } = useSocket();

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("nearest");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => setVisibleCount(10), [query, selectedCategory]);

  const { filteredWorkers, loadMoreWorkers } = useWorkersFilter({
    Providers,
    location,
    sortBy,
    query,
    selectedCategory,
    visibleCount,
    setVisibleCount,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchWorkersData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchWorkersData]);

  if (!Providers) {
    return (
      <View style={styles.loading(darkMode)}>
        {/* you can add loading indicator if you want */}
      </View>
    );
  }

  return (
    <View style={styles.container(darkMode)}>
      <SearchHeader
        query={query}
        setQuery={setQuery}
        darkMode={darkMode}
        App_Language={App_Language}
        onBack={() => Expo_Router.back()}
      />

      <SortButtons
        sortBy={sortBy}
        setSortBy={setSortBy}
        darkMode={darkMode}
        App_Language={App_Language}
      />

      <CategoryList
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        darkMode={darkMode}
        App_Language={App_Language}
      />

      <WorkersList
        Expo_Router={Expo_Router}
        filteredWorkers={filteredWorkers}
        loadMoreWorkers={loadMoreWorkers}
        refreshing={refreshing}
        onRefresh={onRefresh}
        currentUser={currentUser}
        getUserStatus={getUserStatus}
        darkMode={darkMode}
        App_Language={App_Language}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: (darkMode) => ({
    flex: 1,
    backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a",
  }),

  loading: (darkMode) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a",
  }),
});
