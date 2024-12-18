"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

const statusStyles = {
  PENDING_SUPERVISOR: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
};

export function OrderList({ orders }) {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Order #{order.id}</span>
                  <Badge className={statusStyles[order.status]}>
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">
                  {order.judulPekerjaan}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.supervisor.subBidang}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.requestDate), "dd MMM yyyy HH:mm")}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}