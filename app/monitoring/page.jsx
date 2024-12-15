"use client";

import { useState, useEffect } from "react";

// Dummy data for meal orders
const dummyOrders = [
  {
    id: 1,
    time: "07:00",
    type: "Sarapan",
    subDepartment: "Pemeliharaan",
    quantity: 25,
    menu: [
      { item: "Nasi Goreng", quantity: 15 },
      { item: "Bubur Ayam", quantity: 10 },
    ],
    dropPoint: "Gedung A",
    status: "Selesai",
  },
  {
    id: 2,
    time: "12:00",
    type: "Makan Siang",
    subDepartment: "Operator",
    quantity: 30,
    menu: [
      { item: "Nasi Ayam", quantity: 20 },
      { item: "Gado-gado", quantity: 10 },
    ],
    dropPoint: "Gedung B",
    status: "Sedang Diproses",
  },
  {
    id: 3,
    time: "15:30",
    type: "Sore",
    subDepartment: "Humas",
    quantity: 20,
    menu: [{ item: "Kue Putu", quantity: 20 }],
    dropPoint: "Gedung C",
    status: "Terjadwal",
  },
  {
    id: 4,
    time: "18:00",
    type: "Malam",
    subDepartment: "Pemeliharaan",
    quantity: 35,
    menu: [
      { item: "Nasi Uduk", quantity: 20 },
      { item: "Soto Ayam", quantity: 15 },
    ],
    dropPoint: "Gedung A",
    status: "Terjadwal",
  },
];

export default function MealSchedule() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState(dummyOrders);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTimeWIB = (date) => {
    return date
      .toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\./g, ":");
  };

  const totalOrders = orders.reduce((sum, order) => sum + order.quantity, 0);
  const completedOrders = orders
    .filter((order) => order.status === "Selesai")
    .reduce((sum, order) => sum + order.quantity, 0);

  return (
    <div className="container mx-auto p-6">
      <div className="relative bg-white py-4">
        <div className="flex flex-col items-center justify-center">
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <div className="flex space-x-2">
              <div className="w-32 rounded-lg border bg-blue-50 p-4 text-center">
                <p className="mb-1 text-sm font-semibold text-blue-500">
                  Total Pesanan
                </p>
                <p className="text-4xl font-bold text-blue-700">
                  {totalOrders}
                </p>
              </div>
              <div className="w-32 rounded-lg border bg-green-50 p-4 text-center">
                <p className="mb-1 text-sm font-semibold text-green-600">
                  Pesanan Selesai
                </p>
                <p className="text-4xl font-bold text-green-700">
                  {completedOrders}
                </p>
              </div>
            </div>
          </div>
          <h1 className="mb-1 text-4xl font-bold tracking-wide">
            PESANAN MAKANAN
          </h1>
          <div className="text-3xl font-semibold tracking-widest">
            {formatTimeWIB(currentTime)}
          </div>
          <div className="absolute right-0 flex w-32 flex-col items-center rounded-xl border bg-muted/20 px-8 py-6">
            <span className="text-xl font-semibold text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", { month: "short" })}
            </span>
            <span className="text-4xl font-bold">
              {currentTime.toLocaleDateString("en-US", { day: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-primary/10">
              <th className="p-4 text-left font-semibold uppercase text-primary">
                No
              </th>
              <th className="p-4 text-left font-semibold uppercase text-primary">
                Waktu
              </th>
              <th className="p-4 text-left font-semibold uppercase text-primary">
                Tipe
              </th>
              <th className="p-4 text-left font-semibold uppercase text-primary">
                Sub Bidang
              </th>
              <th className="p-4 text-left font-semibold uppercase text-primary">
                Jumlah Pesanan
              </th>
              <th className="p-4 text-left font-semibold uppercase text-primary">
                Menu
              </th>
              <th className="p-4 text-left font-semibold uppercase text-primary">
                Drop Point
              </th>
              <th className="p-4 text-left font-semibold uppercase text-primary">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.time}</td>
                <td className="p-4">{order.type}</td>
                <td className="p-4">{order.subDepartment}</td>
                <td className="p-4 text-center">
                  <span className="flex h-8 w-20 items-center justify-center rounded-xl bg-green-600 text-xl font-medium text-primary-foreground">
                    {order.quantity}
                  </span>
                </td>
                <td className="p-4">
                  <ul className="space-y-1">
                    {order.menu.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.item}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-4">{order.dropPoint}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2 py-2 text-xs font-semibold uppercase ${
                      order.status === "Selesai"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Sedang Diproses"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
