"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllOrders } from "@/lib/api/order";
import { format } from "date-fns";
import {
  UtensilsCrossed,
  Car,
  FileBox,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { OrderApprovalFooter } from "./orders-approval-button";

const orderTypes = {
  approval: {
    label: "Needs Approval",
    icon: AlertCircle,
    color: "text-red-600",
  },
  all: { label: "All Orders", icon: null, color: "text-gray-600" },
  MEAL: { label: "Meal", icon: UtensilsCrossed, color: "text-green-600" },
  TRANSPORT: { label: "Transport", icon: Car, color: "text-blue-600" },
  STATIONARY: { label: "Stationary", icon: FileBox, color: "text-yellow-600" },
  ROOM: { label: "Room", icon: Building2, color: "text-purple-600" },
};

const PENDING_STATUSES = [
  "PENDING_SUPERVISOR",
  "PENDING_GA",
  "PENDING_KITCHEN",
];

const getStatusColor = (status) => {
  switch (status) {
    case "PENDING_SUPERVISOR":
    case "PENDING_GA":
    case "PENDING_KITCHEN":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function DesktopOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const isSecretary = session?.user?.role === "SECRETARY";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status: "APPROVED", needsApproval: false }
          : order
      )
    );
  };

  const handleReject = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status: "REJECTED", needsApproval: false }
          : order
      )
    );
  };

  const filteredOrders = useMemo(() => {
    if (isSecretary) {
      // For secretary, show all orders regardless of status in the "all" tab
      if (activeTab === "all") {
        return orders;
      }
      // For other tabs, filter by type only
      return orders.filter((order) => order.type === activeTab);
    }

    // Original filtering logic for other roles
    if (activeTab === "approval") {
      return orders.filter((order) => PENDING_STATUSES.includes(order.status));
    }
    if (activeTab === "all") {
      return orders.filter((order) => !PENDING_STATUSES.includes(order.status));
    }
    return orders.filter(
      (order) =>
        order.type === activeTab && !PENDING_STATUSES.includes(order.status)
    );
  }, [orders, activeTab, isSecretary]);

  const pendingCount = useMemo(() => {
    return orders.filter((order) => PENDING_STATUSES.includes(order.status))
      .length;
  }, [orders]);

  // Filter out the approval tab for secretary role
  const availableOrderTypes = useMemo(() => {
    if (isSecretary) {
      const { approval, ...rest } = orderTypes;
      return rest;
    }
    return orderTypes;
  }, [isSecretary]);

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        Loading...
      </div>
    );
  }

  console.log(filteredOrders);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Semua Permintaan</h1>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          {Object.entries(availableOrderTypes).map(([key, { label }]) => (
            <TabsTrigger key={key} value={key} className="relative">
              {label}
              {!isSecretary && key === "approval" && (
                <Badge
                  variant="destructive"
                  className={`ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center ${
                    pendingCount === 0 ? "hidden" : ""
                  }`}
                >
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="flex h-[200px] items-center justify-center rounded-2xl text-gray-500">
              <h2 className="text-2xl font-bold">Tidak ada permintaan</h2>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const OrderIcon = orderTypes[order.type]?.icon;
                return (
                  <Card
                    key={order.id}
                    className="flex w-full flex-col rounded-2xl"
                  >
                    <CardContent className="flex-grow p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {OrderIcon && (
                            <OrderIcon
                              className={`h-5 w-5 ${
                                orderTypes[order.type].color
                              }`}
                            />
                          )}
                          <h2 className="text-xl font-semibold">
                            {order.judulPekerjaan}
                          </h2>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Requester:</span>{" "}
                          {order.pic.name}
                        </p>
                        <p>
                          <span className="font-medium">Sub Bidang:</span>{" "}
                          {order.supervisor.subBidang}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {format(
                            new Date(order.requestDate),
                            "dd MMM yyyy HH:mm"
                          )}
                        </p>
                      </div>
                    </CardContent>
                    <OrderApprovalFooter
                      isSecretary={isSecretary}
                      order={order}
                      session={session}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
