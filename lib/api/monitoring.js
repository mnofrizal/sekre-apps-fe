"use client";

import { getSession } from "next-auth/react";

export async function getMonitoringData() {
  const session = await getSession();
  try {
    const response = await fetch(
      "http://localhost:4000/api/requests/monitoring",
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
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
