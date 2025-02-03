"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  UtensilsCrossed,
  Car,
  FileBox,
  Building2,
  CheckCircle,
  ClipboardX,
  Barcode,
  Users,
  User,
  Calendar,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllOrders } from "@/lib/api/order";
import { format } from "date-fns";
import Link from "next/link";
import { getMealCategory, getStatusColor, getStatusName } from "@/lib/constant";
import { OrderDetailDialog } from "../meal-order/order-detail-dialog";
import { OrderApprovalFooter } from "../orders/orders-approval-button";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { respondToRequest } from "@/lib/api/requests";

const orderTypes = {
  MEAL: { icon: UtensilsCrossed, color: "text-green-600" },
  TRANSPORT: { icon: Car, color: "text-blue-600" },
  STATIONARY: { icon: FileBox, color: "text-yellow-600" },
  ROOM: { icon: Building2, color: "text-purple-600" },
};

export function DesktopDashboardOrders() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders that need approval
  const filteredOrders = orders.filter(
    (order) =>
      order.status === "PENDING_GA" || order.status === "PENDING_SUPERVISOR"
  );

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
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

  if (loading) {
    return (
      <Card className="mb-4 flex w-full flex-col rounded-2xl">
        <CardContent className="flex-grow p-6">
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 flex w-full flex-col rounded-2xl">
        <CardContent className="flex-grow p-6">
          <div className="flex h-32 flex-col items-center justify-center text-red-500">
            <span className="text-lg font-semibold">Error loading orders</span>
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <Card className="mb-4 flex w-full flex-col rounded-2xl">
        <CardContent className="flex-grow p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <ClipboardX className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">No Pending Approvals</h3>
              <p className="text-sm text-muted-foreground">
                All orders have been processed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="mr-2 text-xl font-semibold">Kelola Persetujuan</h2>
          <Badge variant="default">{filteredOrders.length}</Badge>
        </div>
        <Link
          href="/dashboard/all-orders"
          className="ml-auto text-sm text-blue-500 hover:text-blue-700"
        >
          See All
        </Link>
      </div>
      <AnimatePresence mode="wait">
        {currentOrders.map((order) => {
          const OrderIcon = orderTypes[order.type]?.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-4 flex w-full flex-col rounded-2xl">
                <CardContent className="flex-grow p-4 px-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {OrderIcon && (
                        <OrderIcon
                          className={`h-7 w-7 ${orderTypes[order.type].color}`}
                        />
                      )}
                      <div>
                        <h2 className="text-xl font-semibold">
                          {getMealCategory(order.requiredDate)}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Order #{order.id}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
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
                </CardContent>
                <CardFooter className="rounded-b-2xl bg-muted p-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl"
                    onClick={() => handleOrderClick(order)}
                  >
                    <Barcode className="h-4 w-4" />
                    Detil Pesanan
                  </Button>
                  <OrderApprovalFooter
                    isSecretary={false}
                    order={order}
                    session={session}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((old) => Math.max(1, old - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((old) => Math.min(totalPages, old + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <OrderDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
