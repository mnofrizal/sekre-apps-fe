"use client";

import { getSession } from "next-auth/react";
import { API_BASE_URL } from "../constant";

export async function getUsers() {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function updateUserNotifyStatus(userId, userData) {
  const session = await getSession();
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/changeNotifyStatus`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(userData),
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to update user notify status");
    }

    return data;
  } catch (error) {
    console.error("Error updating user notify status:", error);
    throw error;
  }
}
