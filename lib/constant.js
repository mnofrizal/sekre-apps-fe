export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
export const WA_BASE_URL = process.env.NEXT_PUBLIC_WA_URL;

export const getStatusColor = (status) => {
  switch (status) {
    case "PENDING_SUPERVISOR":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "REJECTED_SUPERVISOR":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "PENDING_GA":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
    case "REJECTED_GA":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "PENDING_KITCHEN":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "REJECTED_KITCHEN":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export const getStatusName = (status) => {
  switch (status) {
    case "PENDING_SUPERVISOR":
      return "PENDING ASMAN";
    case "REJECTED_SUPERVISOR":
      return "REJECT ASMAN";
    case "PENDING_GA":
      return "PENDING ADMIN";
    case "REJECTED_GA":
      return "REJECT ADMIN";
    case "PENDING_KITCHEN":
      return "PENDING KITCHEN";
    case "REJECTED_KITCHEN":
      return "REJECT KITCHEN";
    case "IN_PROGRESS":
      return "IN KITCHEN";
    case "COMPLETED":
      return "COMPLETED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "UNKNOWN";
  }
};

export const getMealCategory = (date) => {
  const hours = new Date(date).getHours();

  // Breakfast 4 AM - 11:59 AM WIB (21:00 - 04:59 UTC)
  if (hours >= 4 && hours < 12) {
    return "Sarapan";
  }
  // Lunch 12 PM - 2 PM WIB (05:00 - 07:00 UTC)
  else if (hours >= 12 && hours < 14) {
    return "Makan Siang";
  }
  // Afternoon meal 2 PM - 6 PM WIB (07:00 - 11:00 UTC)
  else if (hours >= 14 && hours < 18) {
    return "Makan Sore";
  }
  // Dinner 7 PM - 4 AM WIB (12:00 - 21:00 UTC)
  else if (hours >= 19 || hours < 4) {
    return "Makan Malam";
  }
  return ""; // fallback
};
