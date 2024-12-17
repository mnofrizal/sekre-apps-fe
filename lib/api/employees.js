"use client";

import { getSession } from "next-auth/react";

export async function getEmployees() {
  const session = await getSession();
  try {
    const response = await fetch("http://localhost:4000/api/employees", {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch employees");
    }

    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

export async function getSubBidangEmployees() {
  const session = await getSession();
  try {
    const response = await fetch(
      "http://localhost:4000/api/employees/sub-bidang",
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch employees");
    }

    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

export async function createEmployee(employeeData) {
  const session = await getSession();
  try {
    const response = await fetch("http://localhost:4000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(employeeData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create employee");
    }

    return data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
}
