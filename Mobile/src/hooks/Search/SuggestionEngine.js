import { getSearchHistory } from "./SearchHistoryService";
import { getInteractions } from "./InteractionTracker";

export async function getAISuggestions({ workers, userLocation }) {
  const history = await getSearchHistory();
  const interactions = await getInteractions();

  return workers
    .map((w) => {
      let score = 0;

      const name = w.User_Name?.toLowerCase() || "";
      const job = w.User_Job?.toLowerCase() || "";
      const skills = (w.User_Skills || []).join(" ").toLowerCase();

      // 🔥 User search similarity
      history.forEach((q) => {
        q = q.toLowerCase();
        if (name.includes(q)) score += 5;
        if (job.includes(q)) score += 6;
        if (skills.includes(q)) score += 3;
      });

      // 🔥 Past interactions
      const relatedInteractions = interactions.filter(
        (i) => i.workerId === w.User_$ID
      ).length;

      score += relatedInteractions * 1.5;

      // 🔥 Boost by worker quality
      if (w.User_Freelancer) score += 3;
      if (w.User_Rating >= 4.8) score += 4;
      if (w.User_Projects?.length > 5) score += 2;

      // 🔥 Proximity boost
      if (w.distance != null) {
        if (w.distance < 3) score += 6;
        else if (w.distance < 10) score += 4;
        else score += 1;
      }

      return { ...w, aiScore: score };
    })
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 10);
}
