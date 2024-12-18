"use client";

import { UtensilsCrossed, Car, Building2, FileBox } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    title: "Meal Orders",
    icon: UtensilsCrossed,
    href: "/dashboard/meal-order/list",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Transport",
    icon: Car,
    href: "/dashboard/transport/requests",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    title: "Room",
    icon: Building2,
    href: "/dashboard/room/booking",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Stationery",
    icon: FileBox,
    href: "/dashboard/stationary/request",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
];

export function CategoryCards({ itemVariants, orders }) {
  // Count orders by type

  return (
    <motion.div variants={itemVariants} className="">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Layanan</h2>
        <Link href="/dashboard/" className="text-sm text-blue-600">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.title}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href={category.href}
              className={`${category.bgColor} p-4 rounded-xl flex flex-col gap-2`}
            >
              <category.icon className={`h-6 w-6 ${category.iconColor}`} />
              <span className="font-medium">{category.title}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
