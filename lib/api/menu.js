import { getSession } from "next-auth/react";
import { API_BASE_URL } from "../constant";

export async function getMenuItems() {
  try {
    const session = await getSession();
    const response = await fetch(`${API_BASE_URL}/menu`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch menu items");
    }

    return data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
}

export async function createMenuItem(menuData) {
  try {
    const session = await getSession();
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(menuData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create menu item");
    }

    return data;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
}
