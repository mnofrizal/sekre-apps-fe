"use client";

import { getSession } from "next-auth/react";

export async function getMenuItems() {
  const session = await getSession();
  try {
    const response = await fetch("http://localhost:4000/api/menu", {
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
  const session = await getSession();
  try {
    const response = await fetch("http://localhost:4000/api/menu", {
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
