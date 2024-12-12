export const orders = [
  {
    id: "ORD001",
    status: "pending",
    customer: "John Doe",
    items: [
      { name: "Chicken Rice", quantity: 2, price: 25000 },
      { name: "Ice Tea", quantity: 2, price: 8000 },
    ],
    total: 66000,
    orderDate: "2024-01-20 10:30",
  },
  {
    id: "ORD002",
    status: "processing",
    customer: "Jane Smith",
    items: [
      { name: "Beef Burger", quantity: 1, price: 35000 },
      { name: "French Fries", quantity: 1, price: 15000 },
      { name: "Cola", quantity: 1, price: 8000 },
    ],
    total: 58000,
    orderDate: "2024-01-20 11:15",
  },
  {
    id: "ORD003",
    status: "completed",
    customer: "Bob Wilson",
    items: [
      { name: "Pizza Margherita", quantity: 1, price: 45000 },
      { name: "Mineral Water", quantity: 2, price: 5000 },
    ],
    total: 55000,
    orderDate: "2024-01-20 09:45",
  },
];

export const statusStyles = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
