"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UtensilsCrossed, Car, FileBox, Building2 } from "lucide-react";
import Link from "next/link";

const statsConfig = [
  {
    title: "Meal Orders",
    icon: UtensilsCrossed,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    type: "MEAL",
  },
  {
    title: "Transport Requests",
    icon: Car,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
    type: "TRANSPORT",
  },
  {
    title: "Room",
    icon: Building2,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    type: "ROOM",
  },
  {
    title: "Stationery",
    icon: FileBox,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
    type: "STATIONARY",
  },
];

export function RecentOrders({ itemVariants, orders }) {
  // Count orders by type
  const orderCounts = orders.reduce((acc, order) => {
    acc[order.type] = (acc[order.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.div variants={itemVariants} className="">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Permintaan hari ini</h2>
        <Link href="/dashboard/" className="text-sm text-blue-600">
          View Report
        </Link>
      </div>
      <div className="space-y-4">
        {statsConfig.map((stat, i) => (
          <motion.div
            className="flex items-center justify-between rounded-xl border bg-background p-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={i}
          >
            <div>
              <p className="text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">
                {orderCounts[stat.type] || 0}
              </p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.bgColor}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
