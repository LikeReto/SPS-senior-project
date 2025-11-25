import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import WorkerCard from "@/src/components/WorkerCard";
import { useUser2Store } from "@/src/hooks/CurrentPage_States/useGlobal_States";
import { trackInteraction } from "@/src/hooks/Search/InteractionTracker";

export default function WorkersList({
  filteredWorkers,
  loadMoreWorkers,
  refreshing,
  onRefresh,
  currentUser,
  getUserStatus,
  darkMode,
  App_Language,
  Expo_Router,
}) {
  const navigateToWorker = async (provider) => {
    if (provider.User_$ID === currentUser?.$id) {
      Expo_Router.push("/myProfile");
    } else {
      await useUser2Store.getState().setUser2(provider);
      Expo_Router.push(`/worker/${provider.User_$ID}`);
    }
  };

  return (
    <FlatList
      data={filteredWorkers}
      keyExtractor={(item) => item.User_$ID}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMoreWorkers}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#10b981"
        />
      }
      renderItem={({ item }) => (
        <WorkerCard
          item={item}
          distance={item.distance}
          isCurrentUser={item.User_$ID === currentUser?.$id}
          onPress={async () => {
            await trackInteraction("open_profile", item.User_$ID);
            navigateToWorker(item);
          }}
          isDark={darkMode !== "light"}
          userStatus={getUserStatus(item.User_$ID)}
          App_Language={App_Language}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 50,
  },
});
