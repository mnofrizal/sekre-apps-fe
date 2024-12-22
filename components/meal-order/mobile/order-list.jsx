"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { getStatusColor, getStatusName } from "@/lib/constant";
import { get } from "react-hook-form";

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
            <Card className="rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium"> #{order.id}</span>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusName(order.status)}
                </Badge>
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
