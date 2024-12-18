"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  Car,
  FileBox,
  Building2,
  CheckCircle,
  ClipboardX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllOrders } from "@/lib/api/order";
import { format } from "date-fns";
import Link from "next/link";

const orderTypes = {
  MEAL: { icon: UtensilsCrossed, color: "text-green-600" },
  TRANSPORT: { icon: Car, color: "text-blue-600" },
  STATIONARY: { icon: FileBox, color: "text-yellow-600" },
  ROOM: { icon: Building2, color: "text-purple-600" },
};

const getStatusColor = (status) => {
  switch (status) {
    case "PENDING_SUPERVISOR":
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

export function DesktopDashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchOrders();
  }, []);

  // Filter orders that need approval (PENDING_SUPERVISOR status)
  const filteredOrders = orders.filter(
    (order) => order.status === "PENDING_SUPERVISOR"
  );

  if (loading) {
    return (
      <Card className="mb-4 flex w-full flex-col rounded-2xl">
        <CardContent className="flex-grow p-6">
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 flex w-full flex-col rounded-2xl">
        <CardContent className="flex-grow p-6">
          <div className="flex h-32 flex-col items-center justify-center text-red-500">
            <span className="text-lg font-semibold">Error loading orders</span>
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <Card className="mb-4 flex w-full flex-col rounded-2xl">
        <CardContent className="flex-grow p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <ClipboardX className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">No Pending Approvals</h3>
              <p className="text-sm text-muted-foreground">
                All orders have been processed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="mr-2 text-xl font-semibold">Kelola Persutujuan</h2>
          <Badge variant="default">{filteredOrders.length}</Badge>
        </div>
        <Link
          href="/dashboard/all-orders"
          className="ml-auto text-sm text-blue-500 hover:text-blue-700"
        >
          See All
        </Link>
      </div>
      <AnimatePresence>
        {filteredOrders.map((order) => {
          const OrderIcon = orderTypes[order.type]?.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-4 flex w-full flex-col rounded-2xl">
                <CardContent className="flex-grow p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {OrderIcon && (
                        <OrderIcon
                          className={`h-5 w-5 ${orderTypes[order.type].color}`}
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
                      {format(new Date(order.requestDate), "dd MMM yyyy HH:mm")}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="rounded-b-2xl bg-muted p-4">
                  <div className="flex w-full justify-end space-x-2">
                    <Button
                      variant="outline"
                      className="rounded-xl text-red-500"
                    >
                      Reject
                    </Button>
                    <Button className="rounded-xl">Approve</Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
