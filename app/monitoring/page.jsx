"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMonitoringData } from "@/lib/api/monitoring";
import { format } from "date-fns";

export default function MealSchedule() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Fetch monitoring data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMonitoringData();
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 30 seconds
    const refreshInterval = setInterval(fetchData, 30000);

    return () => {
      clearInterval(refreshInterval);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_SUPERVISOR":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-purple-100 text-purple-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  if (loading) {
    return (
      <div className="container mx-auto flex h-[400px] items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex h-[400px] items-center justify-center p-6 text-red-500">
        Error: {error}
      </div>
    );
  }

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
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`border-b transition-colors hover:bg-muted/50 ${
                  order.status === "COMPLETED" ? "bg-gray-100" : ""
                }`}
              >
                <td className="p-4">{index + 1}</td>
                <td className="p-4">
                  {format(new Date(order.requiredDate), "HH:mm")}
                </td>
                <td className="p-4">{order.type}</td>
                <td className="p-4">{order.supervisor.subBidang}</td>
                <td className="p-4 text-center">
                  <span className="flex h-8 w-20 items-center justify-center rounded-xl bg-green-600 text-xl font-medium text-primary-foreground">
                    {order.employeeOrders.length}
                  </span>
                </td>
                <td className="p-4">
                  <ul className="space-y-1">
                    {order.employeeOrders.map((employeeOrder) =>
                      employeeOrder.orderItems.map((item) => (
                        <li key={item.id}>
                          {item.quantity}x {item.menuItem.name}
                        </li>
                      ))
                    )}
                  </ul>
                </td>
                <td className="p-4">{order.dropPoint}</td>
                <td className="p-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
