"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { getAllOrders } from "@/lib/api/order";
import { DashboardHeader } from "./mobile/header";
import { CategoryCards } from "./mobile/category-cards";
import { RecentOrders } from "./mobile/recent-orders";

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.judulPekerjaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supervisor.subBidang
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="space-y-6 pb-16 pt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <DashboardHeader />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="h-12 rounded-xl bg-background pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CategoryCards orders={filteredOrders} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <RecentOrders orders={filteredOrders} />
      </motion.div>
    </motion.div>
  );
}
