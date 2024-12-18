"use client";

import { getSession } from "next-auth/react";

export async function getAllOrders() {
  const session = await getSession();
  try {
    const response = await fetch("http://localhost:4000/api/service-requests", {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function createOrder(orderDetail) {
  const session = await getSession();
  try {
    const response = await fetch("http://localhost:4000/api/service-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(orderDetail),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create order");
    }

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getOrderById(id) {
  const session = await getSession();
  try {
    const response = await fetch(
      `http://localhost:4000/api/service-requests/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch order");
    }

    return data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}
