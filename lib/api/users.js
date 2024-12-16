"use client";

import { getSession } from "next-auth/react";

const session = await getSession();
export async function getUsers() {
  try {
    const response = await fetch("http://localhost:4000/api/users", {
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

export async function createUser(userData) {
  try {
    const response = await fetch("http://localhost:4000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create user");
    }

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
