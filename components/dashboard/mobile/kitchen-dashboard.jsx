"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  User,
  Phone,
  MapPin,
  Car,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  completeOrder,
  getAllOrders,
  updateOrderStatus,
} from "@/lib/api/order";
import { DashboardHeader } from "./header";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getMealCategory, getStatusColor, getStatusName } from "@/lib/constant";
import { get } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusColors = {
  PENDING_KITCHEN: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [openItems, setOpenItems] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data.filter((order) => order.type === "MEAL"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id) => {
    setOpenItems((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleApproveKitchen = async (order) => {
    try {
      setLoading(true);
      console.log(`Approving order with ID: ${order.id}`);
      const response = await completeOrder(order.id);

      // Fetch fresh data
      await fetchOrders();

      // Show toast for successful approval
      //   toast({
      //     title: "Success",
      //     description: "Order successfully completed",
      //     variant: "success",
      //   });
    } catch (error) {
      console.error(
        `Failed to complete order with ID: ${order.id}: ${error.message}`
      );
      //   toast({
      //     title: "Error",
      //     description: `Failed to complete order with ID: ${order.id}: ${error.message}`,
      //     variant: "destructive",
      //   });
    } finally {
      setLoading(false);
    }
  };

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

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") {
      return order.status === "IN_PROGRESS";
    }
    return order.status !== "IN_PROGRESS";
  });

  const pendingCount = orders.filter(
    (order) => order.status === "IN_PROGRESS"
  ).length;
  const completedCount = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  return (
    <div className="space-y-6 pb-16 pt-4">
      <DashboardHeader />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-2xl border-none bg-yellow-50 p-6 shadow-none">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-lg font-medium">Masuk</span>
          </div>
          <p className="mt-2 text-4xl font-bold">{pendingCount}</p>
        </Card>
        <Card className="rounded-2xl border-none bg-green-50 p-6 shadow-none">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-lg font-medium">Selesai</span>
          </div>
          <p className="mt-2 text-4xl font-bold">{completedCount}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "pending" ? "default" : "outline"}
          onClick={() => setActiveTab("pending")}
          className="flex-1 rounded-xl"
        >
          Pesanan Masuk
        </Button>
        <Button
          variant={activeTab === "completed" ? "default" : "outline"}
          onClick={() => setActiveTab("completed")}
          className="flex-1 rounded-xl"
        >
          Pesanan Selesai
        </Button>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="overflow-hidden rounded-2xl">
                  <Collapsible
                    open={openItems.includes(order.id)}
                    onOpenChange={() => toggleItem(order.id)}
                  >
                    <div className="p-4 pb-0">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-5 w-5 text-primary" />
                          <span className="font-medium">
                            {order.supervisor.subBidang}
                          </span>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusName(order.status)}
                        </Badge>
                      </div>

                      <div className="mt-2 flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {order.employeeOrders.length} items
                          </span>
                          <span className="text-sm text-muted-foreground">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {getMealCategory(order.requiredDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(order.requiredDate), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-end">
                      <CollapsibleTrigger className="flex w-full flex-col p-4">
                        <div className="flex w-full items-center justify-between">
                          <ChevronDown
                            className={`h-5 w-5 transition-transform duration-200  ${
                              openItems.includes(order.id) ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CollapsibleTrigger>

                      <div className="flex w-full justify-end gap-2 p-4">
                        {order.status === "IN_PROGRESS" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div className="flex cursor-pointer rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90">
                                <CheckCircle2 className="mr-2 h-5 w-5 text-white" />{" "}
                                Kirim Pesanan
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Selesaikan Pesanan?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Pastikan Anda telah menyelesaikan pesanan ini.
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleApproveKitchen(order)}
                                >
                                  Selesaikan
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>

                    <CollapsibleContent>
                      <Separator />
                      <div className="space-y-4 p-4">
                        {/* Contact Info */}
                        <div className="space-y-2">
                          <h3 className="font-medium">Contact Information</h3>
                          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{order.pic.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {order.pic.nomorHp}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{order.dropPoint}</span>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-2">
                          <h3 className="font-medium">Menu Items</h3>
                          <div className="space-y-2">
                            {order.employeeOrders.map(
                              (employeeOrder, index) => (
                                <div
                                  key={index}
                                  className="rounded-lg bg-muted/50 p-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                      {employeeOrder.employeeName}
                                    </span>
                                    <Badge variant="secondary">
                                      {employeeOrder.entity}
                                    </Badge>
                                  </div>
                                  {employeeOrder.orderItems.map(
                                    (item, itemIndex) => (
                                      <div
                                        key={itemIndex}
                                        className="mt-2 text-sm text-muted-foreground"
                                      >
                                        {item.quantity}x {item.menuItem.name}
                                        {item.notes && (
                                          <div className="mt-1 text-xs">
                                            Note: {item.notes}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="rounded-2xl p-6 text-center text-gray-500">
                <>No pending orders</>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
