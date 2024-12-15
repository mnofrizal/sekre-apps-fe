"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  Car,
  FileBox,
  Building2,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const orderTypes = {
  meal: { icon: UtensilsCrossed, color: "text-green-600" },
  transport: { icon: Car, color: "text-blue-600" },
  stationary: { icon: FileBox, color: "text-yellow-600" },
  room: { icon: Building2, color: "text-purple-600" },
};

const sampleOrders = [
  {
    id: 1,
    type: "meal",
    title: "Makan Siang",
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
    title: "Kebutuhan ATK",
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
    title: "Makan Malam",
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

export function DesktopDashboardOrders() {
  const [orders, setOrders] = useState(sampleOrders);

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

  const filteredOrders = orders.filter((order) => order.needsApproval);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const OrderIcon = orderTypes[order.type].icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="mb-4 flex w-full flex-col rounded-2xl">
                  <CardContent className="flex-grow p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <OrderIcon
                          className={`h-5 w-5 ${orderTypes[order.type].color}`}
                        />
                        <h2 className="text-xl font-semibold">{order.title}</h2>
                      </div>
                      <Badge variant="default">{order.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Requester:</span>{" "}
                        {order.requester}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {order.date}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="rounded-b-2xl bg-muted p-2 px-4">
                    <div className="flex w-full justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleReject(order.id)}
                        className="rounded-xl text-red-500"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(order.id)}
                        className="rounded-xl"
                      >
                        Approve
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-4 flex w-full flex-col items-center justify-center rounded-2xl p-6 text-center">
              <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
              <h2 className="text-2xl font-semibold">No Pending Requests</h2>
              <p className="mt-2 text-muted-foreground">
                All requests have been processed.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
