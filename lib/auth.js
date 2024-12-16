export async function login(credentials) {
  try {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    // Return the data regardless of success status
    // Let the calling function handle the success/failure logic
    return data;
  } catch (error) {
    throw new Error("Network error occurred during login");
  }
}

export function getAuthHeaders(session) {
  if (!session?.accessToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
}
