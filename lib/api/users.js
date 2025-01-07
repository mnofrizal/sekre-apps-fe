"use client";

import { getSession } from "next-auth/react";
import { apiRequest } from "./api-client";
import { API_BASE_URL } from "../constant";

export async function getUsers() {
  const session = await getSession();
  return apiRequest(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
}

export async function createUser(userData) {
  const session = await getSession();
  return apiRequest(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(userData),
  });
}

export async function updateUser(userId, userData) {
  const session = await getSession();
  return apiRequest(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(userId) {
  const session = await getSession();
  return apiRequest(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
}

export async function exportUser() {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/users/data/export`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to export user");
    }

    // Create blob with proper type
    const data = await response.blob();
    return new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("Error exporting user:", error);
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
