import { useMemo, useCallback } from "react";
import { getDistance } from "../../utils/location";
import { categories } from "../../constants/categories";

export default function useWorkersFilter({
  Providers,
  location,
  sortBy,
  query,
  selectedCategory,
  visibleCount,
  setVisibleCount,
}) {
  const increment = 10;

  const sortedWorkers = useMemo(() => {
    if (!Providers) return [];

    return Providers.map((w) => {
      const lat = w?.User_Location_Coords?.latitude;
      const lng = w?.User_Location_Coords?.longitude;

      const distance =
        location && lat && lng
          ? getDistance(location.latitude, location.longitude, lat, lng)
          : null;

      return {
        ...w,
        distance,
        rating: Number(w?.User_Rating) || 0,
      };
    }).sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });
  }, [Providers, location]);

  const filteredWorkers = useMemo(() => {
    let workers = [...sortedWorkers];

    if (query) {
      const q = query.toLowerCase();
      workers = workers.filter(
        (w) =>
          (w.User_Name || "").toLowerCase().includes(q) ||
          (w.User_Job || "").toLowerCase().includes(q) ||
          (Array.isArray(w.User_Skills) &&
            w.User_Skills.some((skill) =>
              skill.toLowerCase().includes(q)
            ))
      );
    }

    if (selectedCategory) {
      const cat = categories.find((c) => c.key === selectedCategory);
      if (cat) {
        const matches = (cat.matches || []).map((m) => m.toLowerCase());

        workers = workers.filter((w) => {
          const job = (w.User_Job || "").toLowerCase();
          const skills = Array.isArray(w.User_Skills)
            ? w.User_Skills.map((x) => x.toLowerCase())
            : [];

          return (
            matches.some((m) => job.includes(m)) ||
            matches.some((m) => skills.some((s) => s.includes(m)))
          );
        });
      }
    }

    if (sortBy === "top") {
      workers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return workers.slice(0, visibleCount);
  }, [sortedWorkers, query, selectedCategory, sortBy, visibleCount]);

  const loadMoreWorkers = useCallback(() => {
    if (visibleCount < sortedWorkers.length) {
      setVisibleCount((prev) =>
        Math.min(prev + increment, sortedWorkers.length)
      );
    }
  }, [visibleCount, sortedWorkers.length]);

  return { filteredWorkers, loadMoreWorkers };
}
