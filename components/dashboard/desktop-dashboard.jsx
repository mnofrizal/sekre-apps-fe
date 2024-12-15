"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Car, Building2, FileBox } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function DesktopDashboard() {
  const statisticsCards = [
    { title: "Total Meal Orders", value: "24", icon: UtensilsCrossed },
    { title: "Transport Requests", value: "12", icon: Car },
    { title: "Room Bookings", value: "8", icon: Building2 },
    { title: "Stationary Requests", value: "32", icon: FileBox },
  ];

  const manageOrderCards = [
    {
      title: "Meal Orders",
      icon: UtensilsCrossed,
      href: "/dashboard/meal-order/list",
      color: "text-green-600",
    },
    {
      title: "Transport",
      icon: Car,
      href: "/dashboard/transport/requests",
      color: "text-blue-600",
    },
    {
      title: "Room",
      icon: Building2,
      href: "/dashboard/room/booking",
      color: "text-purple-600",
    },
    {
      title: "Stationary",
      icon: FileBox,
      href: "/dashboard/stationary/request",
      color: "text-yellow-600",
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-medium tracking-tight">
            Welcome back, Admin
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's an overview of your services activities
          </p>
        </div>
        <Link href="/dashboard/all-orders">
          <Button
            size="lg"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go to All Orders
          </Button>
        </Link>
      </div>
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        {statisticsCards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Card className="flex h-[140px] flex-col justify-between rounded-2xl border-gray-300 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-thin">
                  {card.title}
                </CardTitle>
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Manage Services</h2>
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          {manageOrderCards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href={card.href} className="block h-[140px]">
                <Card className="h-full cursor-pointer rounded-2xl border-gray-300 shadow-sm transition-colors hover:bg-accent">
                  <CardContent className="flex h-full flex-col items-center justify-center p-6">
                    <card.icon className={`h-8 w-8 ${card.color} mb-2`} />
                    <h3 className="text-center text-lg font-semibold">
                      {card.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
