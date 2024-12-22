"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllOrders, updateOrderStatus } from "@/lib/api/order";
import { format } from "date-fns";
import {
  UtensilsCrossed,
  Car,
  FileBox,
  Building2,
  AlertCircle,
  Plus,
  User,
  Calendar,
  MapPin,
  Barcode,
  Ruler,
  Users,
  CheckCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { OrderApprovalFooter } from "./orders-approval-button";
import { respondToRequest } from "@/lib/api/requests";
import { getMealCategory, getStatusColor, getStatusName } from "@/lib/constant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { OrderDetailDialog } from "../meal-order/order-detail-dialog";
import { useToast } from "@/hooks/use-toast";
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
} from "../ui/alert-dialog";

const orderTypes = {
  approval: {
    label: "Needs Approval",
    icon: AlertCircle,
    color: "text-red-600",
  },
  all: { label: "All Orders", icon: null, color: "text-gray-600" },
  MEAL: { label: "Meal", icon: UtensilsCrossed, color: "text-green-600" },
  TRANSPORT: { label: "Transport", icon: Car, color: "text-blue-600" },
  STATIONARY: { label: "Stationary", icon: FileBox, color: "text-yellow-600" },
  ROOM: { label: "Room", icon: Building2, color: "text-purple-600" },
};

const PENDING_STATUSES = [
  "PENDING_SUPERVISOR",
  "PENDING_GA",
  "PENDING_KITCHEN",
];

export function DesktopOrders() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isSecretary = session?.user?.role === "SECRETARY";
  // Set default tab based on role
  const [activeTab, setActiveTab] = useState(isSecretary ? "all" : "approval");

  // Effect to handle initial fetch and check pending orders
  useEffect(() => {
    const initialFetch = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        setOrders(response.data);

        // If not secretary and no pending orders, switch to all tab
        if (!isSecretary) {
          const hasPendingOrders = response.data.some((order) =>
            PENDING_STATUSES.includes(order.status)
          );

          if (!hasPendingOrders && activeTab === "approval") {
            setActiveTab("all");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
  }, [isSecretary]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data);

      // Check for pending orders after each fetch
      if (!isSecretary) {
        const hasPendingOrders = response.data.some((order) =>
          PENDING_STATUSES.includes(order.status)
        );

        if (!hasPendingOrders && activeTab === "approval") {
          setActiveTab("all");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleApproveKitchen = async (order) => {
    try {
      setLoading(true);
      console.log(`Approving order with ID: ${order.id}`);
      const response = await updateOrderStatus(order.id, "COMPLETED");

      // Fetch fresh data
      await fetchOrders();

      // Show toast for successful approval
      toast({
        title: "Success",
        description: "Request successfully approved",
        variant: "success",
      });
    } catch (error) {
      console.error(
        `Failed to approve order with ID: ${order.id}: ${error.message}`
      );
      toast({
        title: "Error",
        description: `Failed to approve order with ID: ${order.id}: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (token) => {
    try {
      setLoading(true);
      const response = await respondToRequest(token, true, "Request approved");

      // Update local state first
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.token === token
            ? { ...order, status: response.data.status }
            : order
        )
      );

      // Fetch fresh data
      await fetchOrders();

      // Only handle tab switching for non-secretary roles
      if (!isSecretary) {
        // Check if there are any remaining orders in approval tab
        const remainingPendingOrders = orders.filter(
          (order) =>
            PENDING_STATUSES.includes(order.status) && order.token !== token
        );

        // If no more pending orders, switch to "all" tab
        if (remainingPendingOrders.length === 0 && activeTab === "approval") {
          setActiveTab("all");
        }
      }

      // Show toast for successful approval
      toast({
        title: "Success",
        description: "Request successfully approved",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      setError("Failed to approve request");
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (token) => {
    try {
      setLoading(true);
      const response = await respondToRequest(token, false, "Request rejected");

      // Update local state first
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.token === token
            ? { ...order, status: response.data.status }
            : order
        )
      );

      // Fetch fresh data
      await fetchOrders();

      // Only handle tab switching for non-secretary roles
      if (!isSecretary) {
        // Check if there are any remaining orders in approval tab
        const remainingPendingOrders = orders.filter(
          (order) =>
            PENDING_STATUSES.includes(order.status) && order.token !== token
        );

        // If no more pending orders, switch to "all" tab
        if (remainingPendingOrders.length === 0 && activeTab === "approval") {
          setActiveTab("all");
        }
      }

      // Show toast for successful rejection
      toast({
        title: "Success",
        description: "Request successfully rejected",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      setError("Failed to reject request");
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (isSecretary) {
      if (activeTab === "all") {
        // Show all orders except those with pending status
        return orders.filter(
          (order) => !PENDING_STATUSES.includes(order.status)
        );
      }
      // For other tabs, filter by type and exclude pending status
      return orders.filter(
        (order) =>
          order.type === activeTab && !PENDING_STATUSES.includes(order.status)
      );
    }

    // Original filtering logic for other roles
    if (activeTab === "approval") {
      return orders.filter((order) => PENDING_STATUSES.includes(order.status));
    }
    if (activeTab === "all") {
      return orders.filter((order) => !PENDING_STATUSES.includes(order.status));
    }
    return orders.filter(
      (order) =>
        order.type === activeTab && !PENDING_STATUSES.includes(order.status)
    );
  }, [orders, activeTab, isSecretary]);

  const pendingCount = useMemo(() => {
    return orders.filter((order) => PENDING_STATUSES.includes(order.status))
      .length;
  }, [orders]);

  // Filter out the approval tab for secretary role
  const availableOrderTypes = useMemo(() => {
    if (isSecretary) {
      const { approval, ...rest } = orderTypes;
      return rest;
    }
    return orderTypes;
  }, [isSecretary]);

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Semua Permintaan</h1>
        {session?.user?.role !== "KITCHEN" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Buat Pesanan
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-3">
              <Link
                href="/dashboard/meal-order/list/add"
                className="cursor-pointer rounded px-4 py-2 text-sm hover:bg-gray-100"
              >
                Meal Order
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {Object.entries(availableOrderTypes).map(([key, { label }]) => (
            <TabsTrigger key={key} value={key} className="relative">
              {label}
              {!isSecretary && key === "approval" && pendingCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="flex h-[200px] items-center justify-center rounded-2xl text-gray-500">
              <h2 className="text-2xl font-bold">Tidak ada permintaan</h2>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const OrderIcon = orderTypes[order.type]?.icon;
                return (
                  <Card
                    key={order.id}
                    className="flex w-full flex-col rounded-2xl"
                  >
                    <CardContent className="flex-grow p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {OrderIcon && (
                            <div
                              className={`rounded-full p-2 ${
                                orderTypes[order.type].bgColor
                              }`}
                            >
                              <OrderIcon
                                className={`h-6 w-6 ${
                                  orderTypes[order.type].color
                                }`}
                              />
                            </div>
                          )}
                          <div>
                            <h2 className="text-2xl font-bold">
                              {getMealCategory(order.requiredDate)}
                            </h2>
                            <p className="text-sm text-gray-500">
                              Order #{order.id}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${getStatusColor(
                            order.status
                          )} rounded-sm`}
                        >
                          {getStatusName(order.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {order.employeeOrders.length} Porsi
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {order.supervisor.subBidang}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.requestDate)
                              .toLocaleString("id-ID", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                              .replace(/\./g, ":")}{" "}
                            WIB
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {order.dropPoint}
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="mt-4 flex justify-between gap-3">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => handleOrderClick(order)}
                        >
                          <Barcode className="h-4 w-4" />
                          Detil Pesanan
                        </Button>
                        {session?.user?.role === "KITCHEN" &&
                          order.status === "IN_PROGRESS" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Selesaikan Pesanan
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Selesaikan Pesanan?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Pastikan Anda telah menyelesaikan pesanan
                                    ini. Tindakan ini tidak dapat dibatalkan.
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
                        <OrderApprovalFooter
                          isSecretary={isSecretary}
                          order={order}
                          session={session}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <OrderDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
