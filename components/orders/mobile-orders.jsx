"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UtensilsCrossed,
  Car,
  FileBox,
  Building2,
  Loader2,
  Users,
  User,
  MapPin,
} from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/lib/api/order";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { getMealCategory, getStatusColor, getStatusName } from "@/lib/constant";
import { Separator } from "../ui/separator";

const orderIcons = {
  MEAL: UtensilsCrossed,
  TRANSPORT: Car,
  STATIONARY: FileBox,
  ROOM: Building2,
};

const orderColors = {
  MEAL: "bg-green-500",
  TRANSPORT: "bg-blue-500",
  STATIONARY: "bg-yellow-500",
  ROOM: "bg-purple-500",
};

const PENDING_STATUSES = [
  "PENDING_SUPERVISOR",
  "PENDING_GA",
  "PENDING_KITCHEN",
];

export function MobileOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("needApproval");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  // Filter orders based on user role and active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "needApproval") {
      switch (session?.user?.role) {
        case "ADMIN":
          return PENDING_STATUSES.includes(order.status);
        case "SECRETARY":
          return false; // Secretary can't approve orders
        case "KITCHEN":
          return order.status === "PENDING_KITCHEN" && order.type === "MEAL";
        default:
          return false;
      }
    } else {
      // For "otherOrders" tab
      switch (session?.user?.role) {
        case "ADMIN":
          return !PENDING_STATUSES.includes(order.status);
        case "SECRETARY":
          return true; // Secretary can see all orders
        case "KITCHEN":
          return order.type === "MEAL"; // Kitchen can only see meal orders
        default:
          return false;
      }
    }
  });

  const canApprove = (order) => {
    if (!session?.user?.role) return false;

    switch (session.user.role) {
      case "ADMIN":
        return PENDING_STATUSES.includes(order.status);
      case "KITCHEN":
        return order.status === "PENDING_KITCHEN" && order.type === "MEAL";
      default:
        return false;
    }
  };

  const handleApproveKitchen = (id) => {
    // Handle approval logic here
    console.log(`Approving order with ID: ${id}`);
    updateOrderStatus(id, "COMPLETED")
      .then(() => {
        console.log(
          `Order with ID: ${id} has been approved and marked as COMPLETED.`
        );
      })
      .catch((error) => {
        console.error(
          `Failed to approve order with ID: ${id}: ${error.message}`
        );
      });
  };

  const handleApprove = (id) => {
    // Handle approval logic here
    console.log(`Approving order with ID: ${id}`);
  };

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
        {filteredOrders.map((order) => {
          const OrderIcon = orderIcons[order.type];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="mb-4 rounded-2xl">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center">
                      <div
                        className={`mr-2 rounded-full p-2.5 ${
                          orderColors[order.type]
                        }`}
                      >
                        {OrderIcon && (
                          <OrderIcon className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {getMealCategory(order.requiredDate)}
                        </h2>
                        <p className="text-xs text-gray-500">#{order.id}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)}`}>
                      {getStatusName(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    {order.employeeOrders.length} Porsi
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    {order.supervisor.subBidang}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {order.dropPoint}
                  </div>
                  {canApprove(order) && (
                    <>
                      <Separator className="my-3" />
                      <div className="mt-4 flex items-end justify-between space-x-2">
                        <p className="text-sm text-gray-500">
                          {format(new Date(order.requestDate), "HH:mm")} WIB
                        </p>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              session.user.role === "KITCHEN"
                                ? handleApproveKitchen(order.id)
                                : handleApprove(order.id)
                            }
                          >
                            {session.user.role === "ADMIN" &&
                            order.status === "PENDING_SUPERVISOR"
                              ? "Approve as ASMAN"
                              : session.user.role === "ADMIN" &&
                                order.status === "PENDING_KITCHEN"
                              ? "Approve as Kitchen"
                              : session.user.role === "ADMIN" &&
                                order.status === "PENDING_GA"
                              ? "Approve"
                              : "Approve"}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
