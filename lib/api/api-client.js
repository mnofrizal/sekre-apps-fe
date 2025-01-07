"use client";

import { signOut } from "next-auth/react";

export class ApiError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const ERROR_CODES = {
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  NETWORK_ERROR: "NETWORK_ERROR",
};

export async function handleApiResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      const errorMessage = data.message?.toLowerCase() || "";

      if (errorMessage.includes("user not found")) {
        await signOut({ callbackUrl: "/login" });
        throw new ApiError(
          "User not found. Please login again.",
          401,
          ERROR_CODES.USER_NOT_FOUND
        );
      }

      if (errorMessage.includes("invalid token")) {
        await signOut({ callbackUrl: "/login" });
        throw new ApiError(
          "Invalid token. Please login again.",
          401,
          ERROR_CODES.TOKEN_INVALID
        );
      }

      if (errorMessage.includes("expired")) {
        await signOut({ callbackUrl: "/login" });
        throw new ApiError(
          "Session expired. Please login again.",
          401,
          ERROR_CODES.TOKEN_EXPIRED
        );
      }

      // Generic unauthorized error
      await signOut({ callbackUrl: "/login" });
      throw new ApiError(
        "Unauthorized. Please login again.",
        401,
        ERROR_CODES.UNAUTHORIZED
      );
    }

    throw new ApiError(data.message || "An error occurred", response.status);
  }

  return data;
}

export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Network error occurred",
      500,
      ERROR_CODES.NETWORK_ERROR
    );
  }
}
