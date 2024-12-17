import { getSession } from "next-auth/react";

const session = await getSession();
export async function createOrder(orderDetail) {
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
