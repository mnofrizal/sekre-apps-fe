"use client";

import { getSession } from "next-auth/react";
import { API_BASE_URL } from "../constant";

// Custom error class for API errors
class RequestError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "RequestError";
    this.code = code;
    this.details = details;
  }
}

// Error codes mapping
const ERROR_CODES = {
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  UNAUTHORIZED: "UNAUTHORIZED",
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
};

// Helper function to handle API responses
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    // Handle specific error cases
    if (response.status === 401) {
      throw new RequestError("Unauthorized access", ERROR_CODES.UNAUTHORIZED);
    }

    // Handle token-specific errors
    if (response.status === 400) {
      if (data.message?.toLowerCase().includes("expired")) {
        throw new RequestError("Token has expired", ERROR_CODES.TOKEN_EXPIRED);
      }
      if (data.message?.toLowerCase().includes("invalid")) {
        throw new RequestError("Invalid token", ERROR_CODES.TOKEN_INVALID);
      }
    }

    // Handle server errors
    if (response.status >= 500) {
      throw new RequestError("Server error occurred", ERROR_CODES.SERVER_ERROR);
    }

    // Generic error case
    throw new RequestError(
      data.message || "An error occurred",
      ERROR_CODES.SERVER_ERROR,
      data.details
    );
  }

  return data;
}

export async function verifyApprovalToken(token) {
  const session = await getSession();

  try {
    if (!token) {
      throw new RequestError("Token is required", ERROR_CODES.TOKEN_INVALID);
    }

    const response = await fetch(
      `${API_BASE_URL}/requests/approval/verify/${token}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new RequestError(
        "Network error - Unable to connect to server",
        ERROR_CODES.NETWORK_ERROR
      );
    }

    // Re-throw RequestErrors
    if (error instanceof RequestError) {
      throw error;
    }

    // Handle unexpected errors
    throw new RequestError(
      "An unexpected error occurred",
      ERROR_CODES.SERVER_ERROR,
      error.message
    );
  }
}

export async function respondToRequest(token, approved, responseNote) {
  const session = await getSession();

  try {
    if (!token) {
      throw new RequestError("Token is required", ERROR_CODES.TOKEN_INVALID);
    }

    const response = await fetch(
      `${API_BASE_URL}/requests/approval/respond/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          response: approved,
          responseNote,
        }),
      }
    );

    return await handleResponse(response);
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new RequestError(
        "Network error - Unable to connect to server",
        ERROR_CODES.NETWORK_ERROR
      );
    }

    // Re-throw RequestErrors
    if (error instanceof RequestError) {
      throw error;
    }

    // Handle unexpected errors
    throw new RequestError(
      "An unexpected error occurred",
      ERROR_CODES.SERVER_ERROR,
      error.message
    );
  }
}

// Export error utilities for use in components
export async function confirmDelivery(token, imageData, timestamp) {
  const session = await getSession();

  try {
    if (!token) {
      throw new RequestError("Token is required", ERROR_CODES.TOKEN_INVALID);
    }

    const response = await fetch(
      `${API_BASE_URL}/requests/delivery/confirm/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          image: imageData,
          timestamp: timestamp,
        }),
      }
    );

    return await handleResponse(response);
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new RequestError(
        "Network error - Unable to connect to server",
        ERROR_CODES.NETWORK_ERROR
      );
    }

    // Re-throw RequestErrors
    if (error instanceof RequestError) {
      throw error;
    }

    // Handle unexpected errors
    throw new RequestError(
      "An unexpected error occurred",
      ERROR_CODES.SERVER_ERROR,
      error.message
    );
  }
}

export { RequestError, ERROR_CODES };
