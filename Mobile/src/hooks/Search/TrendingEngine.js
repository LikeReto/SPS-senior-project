import { getInteractions } from "./InteractionTracker";

export async function getTrendingWorkers(workers) {
  const interactions = await getInteractions();

  const now = Date.now();
  const TREND_WINDOW = 24 * 60 * 60 * 1000; // last 24h

  const trendScores = {};

  interactions.forEach((i) => {
    const age = now - i.timestamp;

    // Newer events get more weight
    const timeWeight = 1 - Math.min(age / TREND_WINDOW, 1);

    if (!trendScores[i.workerId]) trendScores[i.workerId] = 0;

    if (i.type === "open_profile") trendScores[i.workerId] += 3 * timeWeight;
    if (i.type === "clicked") trendScores[i.workerId] += 1.5 * timeWeight;
    if (i.type === "request_sent") trendScores[i.workerId] += 6 * timeWeight;
  });

  return workers
    .map((w) => ({
      ...w,
      trendScore: trendScores[w.User_$ID] || 0,
    }))
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 10);
}
