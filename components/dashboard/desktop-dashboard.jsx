"use client";

import { useState, useEffect, useMemo } from "react";
import { useMealOrderStore } from "@/lib/store/meal-order-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Car, Building2, FileBox } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DesktopDashboardOrders } from "./desktop-dashboard-order-list";
import { useSession } from "next-auth/react";
import { getAllOrders } from "@/lib/api/order";

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
  const { data: session } = useSession();

  const { orders, ordersLoading: loading, fetchOrders } = useMealOrderStore();

  const serviceRequests = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      acc[order.type] = (acc[order.type] || 0) + 1;
      return acc;
    }, {});

    return [
      { type: "MEAL", count: counts.MEAL || 0 },
      { type: "TRANSPORT", count: counts.TRANSPORT || 0 },
      { type: "ROOM", count: counts.ROOM || 0 },
      { type: "STATIONARY", count: counts.STATIONARY || 0 },
    ];
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const maxCount = Math.max(...serviceRequests.map((item) => item.count));

  const statisticsCards = serviceRequests.map((request) => {
    const icons = {
      MEAL: UtensilsCrossed,
      TRANSPORT: Car,
      ROOM: Building2,
      STATIONARY: FileBox,
    };

    const titles = {
      MEAL: "Total Meal Orders",
      TRANSPORT: "Transport Requests",
      ROOM: "Room Bookings",
      STATIONARY: "Stationary Requests",
    };

    return {
      title: titles[request.type],
      value: request.count.toString(),
      icon: icons[request.type],
    };
  });

  // Keep existing manageOrderCards array

  // Keep existing newOrders array
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
  const newOrders = [
    { category: "meal_order", subBidang: "Operasi 5-7", icon: UtensilsCrossed },
    { category: "transport", subBidang: "Fasilitas dan Sarana", icon: Car },
    { category: "atk", subBidang: "Pemeliharaan Turbin", icon: FileBox },
  ];

  if (!session?.user) return null;

  return (
    <motion.div
      className="grid grid-cols-4 gap-6"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <div
        className={`col-span-${
          session.user.role === "ADMIN" ? "3" : "4"
        } space-y-10`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-medium tracking-tight">
              Selamat siang, {session.user.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              Berikut ringkasan aktivitas layanan Anda
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Quick Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/dashboard/all-orders">
                <DropdownMenuItem className="cursor-pointer">
                  All Orders
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/dashboard/meal-order/list/add">
                <DropdownMenuItem className="cursor-pointer">
                  Make Meal Order
                </DropdownMenuItem>
              </Link>
              <Link href="#">
                <DropdownMenuItem className="cursor-pointer">
                  Transport Order
                </DropdownMenuItem>
              </Link>
              <Link href="#">
                <DropdownMenuItem className="cursor-pointer">
                  Room Order
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
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
        {session.user.role === "ADMIN" && (
          <div className="space-y-6">
            <DesktopDashboardOrders></DesktopDashboardOrders>
          </div>
        )}
      </div>
      {session.user.role === "ADMIN" && (
        <div className="ml-2 space-y-8 border-l border-border pl-8">
          <Card className="rounded-2xl border-gray-300 shadow-sm">
            <CardHeader>
              <span className="text-lg font-semibold">Permintaan Hari ini</span>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceRequests.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-sm text-muted-foreground">
                      {item.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-sm bg-muted">
                    <motion.div
                      className="h-full rounded-sm bg-primary"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          maxCount > 0 ? (item.count / maxCount) * 100 : 0
                        }%`,
                      }}
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
                {newOrders.map((order, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer rounded-lg border p-4 hover:bg-accent"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        order.category === "meal_order"
                          ? "bg-red-400"
                          : order.category === "transport"
                          ? "bg-blue-400"
                          : "bg-green-400"
                      }`}
                    >
                      <order.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {order.category === "meal_order"
                            ? "Meal Order"
                            : order.category === "transport"
                            ? "Transport"
                            : "ATK"}
                        </span>
                        <span className="text-xs text-gray-400">08.09 WIB</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.subBidang}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
