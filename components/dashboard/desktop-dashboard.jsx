"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Car, Building2, FileBox } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { DesktopDashboardOrders } from "./desktop-dashboard-order-list";
import { Badge } from "../ui/badge";

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

const data = [
  { project: "Meal", count: 36 },
  { project: "Transport", count: 0 },
  { project: "Room", count: 0 },
  { project: "ATK", count: 0 },
];

export function DesktopDashboard() {
  const maxCount = Math.max(...data.map((item) => item.count));
  const statisticsCards = [
    { title: "Total Meal Orders", value: "24", icon: UtensilsCrossed },
    { title: "Transport Requests", value: "0", icon: Car },
    { title: "Room Bookings", value: "0", icon: Building2 },
    { title: "Stationary Requests", value: "0", icon: FileBox },
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
  const spaces = [
    { category: "meal_order", subBidang: "Operasi 5-7", icon: UtensilsCrossed },
    { category: "transport", subBidang: "Fasilitas dan Sarana", icon: Car },
    { category: "atk", subBidang: "Pemeliharaan Turbin", icon: FileBox },
  ];

  return (
    <motion.div
      className="grid grid-cols-4 gap-6"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <div className="col-span-3 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-medium tracking-tight">
              Selamat siang, Admin
            </h1>
            <p className="text-lg text-muted-foreground">
              Berikut ringkasan aktivitas layanan Anda
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
          className="grid gap-7 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          {statisticsCards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="flex h-[140px] flex-col justify-between rounded-2xl border-gray-200 shadow-sm">
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
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Kelola Layanan</h2>
          <motion.div
            className="grid gap-7 md:grid-cols-2 lg:grid-cols-4"
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
                  <Card className="h-full cursor-pointer rounded-2xl border-gray-200 shadow-sm transition-colors hover:bg-accent">
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="mr-2 text-xl font-semibold">Kelola Persutujuan</h2>
              <Badge variant="default">4</Badge>
            </div>
            <Link
              href="/dashboard/all-orders"
              className="ml-auto text-sm text-blue-500 hover:text-blue-700"
            >
              See All
            </Link>
          </div>
          <DesktopDashboardOrders></DesktopDashboardOrders>
        </div>
      </div>
      <div className="ml-2 space-y-8 border-l border-border pl-8">
        <Card className="rounded-2xl border-gray-300 shadow-sm">
          <CardHeader>
            <span className="text-lg font-semibold">Permintaan Hari ini</span>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-sm text-muted-foreground">
                    {item.project}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.count}
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-sm bg-muted">
                  <motion.div
                    className="h-full rounded-sm bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>0</span>
              <span>{Math.floor(maxCount / 2)}</span>
              <span>{maxCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-gray-300 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-lg font-semibold">Permintaan Baru</div>
            <Link
              href="/dashboard/all-orders"
              className="ml-auto text-sm text-blue-500 hover:text-blue-700"
            >
              See All
            </Link>
          </div>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              {spaces.map((space, i) => (
                <div
                  key={i}
                  className="flex cursor-pointer rounded-lg border p-4 hover:bg-accent"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                      space.category === "meal_order"
                        ? "bg-red-400"
                        : space.category === "transport"
                        ? "bg-blue-400"
                        : "bg-green-400"
                    }`}
                  >
                    <space.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {space.category === "meal_order"
                          ? "Meal Order"
                          : space.category === "transport"
                          ? "Transport"
                          : "ATK"}
                      </span>
                      <span className="text-xs text-gray-400">08.09 WIB</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {space.subBidang}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
