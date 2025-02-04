import { getSession } from "next-auth/react";
import { API_BASE_URL, WA_BASE_URL } from "../constant";

export async function getWhatsappGroups() {
  const session = await getSession();
  try {
    const response = await fetch(`${WA_BASE_URL}/api/messages/wa-groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch WhatsApp groups");
    }

    return data;
  } catch (error) {
    console.error("Error fetching WhatsApp groups:", error);
    throw error;
  }
}

export async function getDBWhatsappGroups() {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/notif/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch WhatsApp groups from database"
      );
    }

    return data;
  } catch (error) {
    console.error("Error fetching WhatsApp groups from database:", error);
    throw error;
  }
}

export async function saveGroupNotif(groupType, groupId, name) {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/notif/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        type: groupType,
        groupId,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save notification group");
    }

    return data;
  } catch (error) {
    console.error("Error saving notification group:", error);
    throw error;
  }
}
