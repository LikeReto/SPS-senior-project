import { getAISuggestions } from "./SuggestionEngine";
import { getTrendingWorkers } from "./TrendingEngine";

export async function getFinalHomeFeed(workers, userLocation) {
  const ai = await getAISuggestions({ workers, userLocation });
  const trending = await getTrendingWorkers(workers);

  // mix both engines
  const combined = {};

  ai.forEach((w, idx) => {
    combined[w.User_$ID] = (combined[w.User_$ID] || 0) + (20 - idx);
  });

  trending.forEach((w, idx) => {
    combined[w.User_$ID] = (combined[w.User_$ID] || 0) + (15 - idx);
  });

  // final ranked list
  return workers
    .map((w) => ({
      ...w,
      finalScore: combined[w.User_$ID] || 0,
    }))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 12);
}
