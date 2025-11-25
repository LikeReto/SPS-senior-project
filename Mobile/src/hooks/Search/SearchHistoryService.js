// src/hooks/Search/SearchHistoryService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "USER_SEARCH_HISTORY";

export async function saveSearchQuery(query) {
  if (!query || query.trim().length === 0) return;

  try {
    const oldHistory = await AsyncStorage.getItem(KEY);
    let history = oldHistory ? JSON.parse(oldHistory) : [];

    // Remove duplicates
    history = history.filter((item) => item !== query);

    // Add new query at top
    history.unshift(query);

    // Keep max 10
    history = history.slice(0, 10);

    await AsyncStorage.setItem(KEY, JSON.stringify(history));
  } catch (err) {
    console.log("❌ saveSearchQuery error:", err);
  }
}

export async function getSearchHistory() {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.log("❌ getSearchHistory error:", err);
    return [];
  }
}

export const clearSearchHistory = async () => {
  await AsyncStorage.removeItem(KEY);
};

export const deleteSearchItem = async (item) => {
  const history = await AsyncStorage.getItem("search_history");
  if (!history) return;

  const parsed = JSON.parse(history);
  const updated = parsed.filter(h => h !== item);

  await AsyncStorage.setItem("search_history", JSON.stringify(updated));
};