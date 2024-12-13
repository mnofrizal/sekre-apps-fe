"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Car, FileBox, Building2 } from "lucide-react";
import React from "react";

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
    needsApproval: true,
  },
  {
    id: 2,
    type: "transport",
    title: "Airport Pickup",
    requester: "Jane Smith",
    date: "2023-06-11",
    status: "Approved",
    needsApproval: false,
  },
  {
    id: 3,
    type: "stationary",
    title: "Office Supplies",
    requester: "Mike Johnson",
    date: "2023-06-12",
    status: "Pending",
    needsApproval: true,
  },
  {
    id: 4,
    type: "room",
    title: "Meeting Room Booking",
    requester: "Sarah Brown",
    date: "2023-06-13",
    status: "Rejected",
    needsApproval: false,
  },
  {
    id: 5,
    type: "meal",
    title: "Dinner Order",
    requester: "Emily Davis",
    date: "2023-06-14",
    status: "Pending",
    needsApproval: true,
  },
  {
    id: 6,
    type: "transport",
    title: "Client Visit",
    requester: "Tom Wilson",
    date: "2023-06-15",
    status: "Approved",
    needsApproval: false,
  },
];

export function MobileOrders() {
  const [orders, setOrders] = useState(sampleOrders);
  const [activeTab, setActiveTab] = useState("needApproval");

  const handleApprove = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status: "Approved", needsApproval: false }
          : order
      )
    );
  };

  const handleReject = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status: "Rejected", needsApproval: false }
          : order
      )
    );
  };

  const filteredOrders = orders.filter((order) =>
    activeTab === "needApproval" ? order.needsApproval : !order.needsApproval
  );

  return (
    <div className="space-y-4 pb-16">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <Tabs defaultValue="needApproval" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="needApproval">Need Approval</TabsTrigger>
          <TabsTrigger value="otherOrders">Other Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="needApproval">
          <h2 className="mb-2 text-lg font-semibold">
            Orders Needing Approval
          </h2>
        </TabsContent>
        <TabsContent value="otherOrders">
          <h2 className="mb-2 text-lg font-semibold">Other Orders</h2>
        </TabsContent>
      </Tabs>
      <AnimatePresence>
        {filteredOrders.map((order) => (
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
                        (() => {
                          const IconComponent = getIconComponent(
                            orderTypes[order.type].icon
                          );
                          return (
                            <IconComponent className="h-4 w-4 text-white" />
                          );
                        })()}
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
                {order.needsApproval && (
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
