"use client";

import { getSession } from "next-auth/react";
import { API_BASE_URL } from "../constant";

export async function getEmployees() {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
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
    const response = await fetch(`${API_BASE_URL}/employees/sub-bidang`, {
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

export async function createEmployee(employeeData) {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
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

export async function importEmployees(file) {
  const session = await getSession();
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/employees/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to import employees");
    }

    return data;
  } catch (error) {
    console.error("Error importing employees:", error);
    throw error;
  }
}
