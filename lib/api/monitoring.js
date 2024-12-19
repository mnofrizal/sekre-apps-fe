import { getSession } from "next-auth/react";
import { API_BASE_URL } from "../constant";

export async function getMonitoringData() {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/requests/monitoring`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch monitoring data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    throw error;
  }
}
