import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "USER_INTERACTIONS";

export async function trackInteraction(type, workerId) {
  try {
    const old = await AsyncStorage.getItem(KEY);
    let data = old ? JSON.parse(old) : [];

    data.unshift({
      type,             // "open_profile" | "clicked" | "request_sent"
      workerId,
      timestamp: Date.now(),
    });

    // Keep last 100 interactions only
    data = data.slice(0, 100);

    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    console.log("❌ trackInteraction error:", err);
  }
}

export async function getInteractions() {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.log("❌ getInteractions error:", err);
    return [];
  }
}
