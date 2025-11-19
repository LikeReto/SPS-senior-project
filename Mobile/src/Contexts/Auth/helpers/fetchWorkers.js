import { backendGetWorkersData } from "@/src/api/USERS/Workers";

export const fetchWorkersData = async (setProviders) => {
  try {
    const workersResponse = await backendGetWorkersData();
    if (workersResponse?.success) {
      setProviders(workersResponse.workersData);
      return true;
    }
  } catch (error) {
    console.error("❌ fetchWorkersData error:", error.message);
  }

  return false;
};
