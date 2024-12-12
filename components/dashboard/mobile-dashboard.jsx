"use client";

import { Search, UtensilsCrossed, Car, Building2, FileBox } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    href: "/dashboard/transport",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    title: "Room",
    icon: Building2,
    href: "/dashboard/room",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Stationery",
    icon: FileBox,
    href: "/dashboard/stationary",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function MobileDashboard() {
  return (
    <motion.div
      className="space-y-6 pb-16 pt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            Hi, Admin <span className="wave">👋</span>
          </h1>
          <p className="text-muted-foreground">Welcome to General Affairs</p>
        </div>
        <Avatar>
          <AvatarImage src="/avatar.png" alt="User Avatar" />
          <AvatarFallback>GA</AvatarFallback>
        </Avatar>
      </motion.div>

      {/* Search */}
      <motion.div className="px-4" variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search menu..." className="bg-background pl-9" />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants} className="px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Link href="/dashboard/categories" className="text-sm text-blue-600">
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

      {/* Today's Stats */}
      <motion.div variants={itemVariants} className="px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Stats</h2>
          <Link href="/dashboard/reports" className="text-sm text-blue-600">
            View Report
          </Link>
        </div>
        <div className="space-y-4">
          <motion.div
            className="flex items-center justify-between rounded-xl border bg-background p-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div>
              <p className="text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <UtensilsCrossed className="h-5 w-5 text-green-600" />
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-between rounded-xl border bg-background p-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div>
              <p className="text-muted-foreground">Room Bookings</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
