"use client";

import { getSession } from "next-auth/react";
import { API_BASE_URL } from "../constant";

export async function getAllOrders() {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/service-requests`, {
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

export async function getAllPendingOrders() {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/service-requests/pending`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch pending orders");
    }

    return data;
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    throw error;
  }
}

export async function createOrder(orderDetail) {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/service-requests`, {
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
    const response = await fetch(`${API_BASE_URL}/service-requests/${id}`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
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

export async function updateOrderStatus(id, status) {
  const session = await getSession();
  try {
    const response = await fetch(
      `${API_BASE_URL}/service-requests/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to update order status");
    }

    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function completeOrder(id) {
  const session = await getSession();
  try {
    const response = await fetch(
      `${API_BASE_URL}/service-requests/${id}/complete`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to complete order");
    }

    return data;
  } catch (error) {
    console.error("Error completing order:", error);
    throw error;
  }
}

export async function deleteOrder(id) {
  const session = await getSession();
  try {
    const response = await fetch(`${API_BASE_URL}/service-requests/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete order");
    }

    return data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

export async function exportOrder() {
  const session = await getSession();
  try {
    const response = await fetch(
      `${API_BASE_URL}/service-requests/data/export`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to export orders");
    }

    const data = await response.blob();
    return new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("Error exporting orders:", error);
    throw error;
  }
}
