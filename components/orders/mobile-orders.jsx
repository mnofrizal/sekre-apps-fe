"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Car, FileBox, Building2 } from "lucide-react";

const orderTypes = {
  meal: { icon: "UtensilsCrossed", color: "bg-green-500" },
  transport: { icon: "Car", color: "bg-blue-500" },
  stationary: { icon: "FileBox", color: "bg-yellow-500" },
  room: { icon: "Building2", color: "bg-purple-500" },
};

const getIconComponent = (iconName) => {
  switch (iconName) {
    case "UtensilsCrossed":
      return UtensilsCrossed;
    case "Car":
      return Car;
    case "FileBox":
      return FileBox;
    case "Building2":
      return Building2;
    default:
      return null;
  }
};

const sampleOrders = [
  {
    id: 1,
    type: "meal",
    title: "Lunch Order",
    requester: "John Doe",
    date: "2023-06-10",
    status: "Pending",
  },
  {
    id: 2,
    type: "transport",
    title: "Airport Pickup",
    requester: "Jane Smith",
    date: "2023-06-11",
    status: "Approved",
  },
  {
    id: 3,
    type: "stationary",
    title: "Office Supplies",
    requester: "Mike Johnson",
    date: "2023-06-12",
    status: "Pending",
  },
  {
    id: 4,
    type: "room",
    title: "Meeting Room Booking",
    requester: "Sarah Brown",
    date: "2023-06-13",
    status: "Rejected",
  },
];

export function MobileOrders() {
  const [orders, setOrders] = useState(sampleOrders);

  const handleApprove = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "Approved" } : order
      )
    );
  };

  const handleReject = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "Rejected" } : order
      )
    );
  };

  return (
    <div className="space-y-4 pb-16">
      <h1 className="mb-4 text-2xl font-bold">Orders for Approval</h1>
      <AnimatePresence>
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full ${
                        orderTypes[order.type].color
                      } mr-2`}
                    >
                      {orderTypes[order.type].icon &&
                        React.createElement(
                          getIconComponent(orderTypes[order.type].icon),
                          { className: "w-4 h-4 text-white" }
                        )}
                    </div>
                    <h2 className="text-lg font-semibold">{order.title}</h2>
                  </div>
                  <Badge
                    variant={
                      order.status === "Approved"
                        ? "success"
                        : order.status === "Rejected"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="mb-2 text-sm text-gray-600">
                  Requester: {order.requester}
                </p>
                <p className="mb-4 text-sm text-gray-600">Date: {order.date}</p>
                {order.status === "Pending" && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(order.id)}
                    >
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(order.id)}>
                      Approve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
