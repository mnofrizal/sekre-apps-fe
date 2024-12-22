"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  verifyApprovalToken,
  respondToRequest,
  ERROR_CODES,
} from "@/lib/api/requests";
import { LoadingState } from "@/components/approval/loading-state";
import { ErrorState } from "@/components/approval/error-state";
import { getStatusColor, getStatusName } from "@/lib/constant";

const getErrorDetails = (error) => {
  switch (error.code) {
    case ERROR_CODES.TOKEN_EXPIRED:
      return {
        title: "Link Expired",
        message: "This approval link has expired. Please request a new one.",
        canRetry: false,
      };
    case ERROR_CODES.TOKEN_INVALID:
      return {
        title: "Invalid Link",
        message: "This approval link is invalid or has already been used.",
        canRetry: false,
      };
    case ERROR_CODES.UNAUTHORIZED:
      return {
        title: "Unauthorized",
        message: "You don't have permission to access this request.",
        canRetry: false,
      };
    case ERROR_CODES.NETWORK_ERROR:
      return {
        title: "Connection Error",
        message:
          "Unable to connect to the server. Please check your internet connection.",
        canRetry: true,
      };
    case ERROR_CODES.SERVER_ERROR:
      return {
        title: "Link Invalid or Expired",
        message: "This approval link is invalid or has already been used.",
        canRetry: true,
      };
    default:
      return {
        title: "Error",
        message: error.message || "An unexpected error occurred.",
        canRetry: true,
      };
  }
};

const MagicLinkApproval = () => {
  const { token } = useParams();
  const { toast } = useToast();
  const [status, setStatus] = useState("pending");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [menuItemsByEntity, setMenuItemsByEntity] = useState({});

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await verifyApprovalToken(token);
      setRequestData(response.data);

      // Process menu items after data is loaded
      if (response.data?.request?.employeeOrders) {
        const groupedItems = response.data.request.employeeOrders.reduce(
          (acc, order) => {
            order.orderItems.forEach((item) => {
              const key = `${item.menuItem.name}-${order.entity}`;
              if (!acc[key]) {
                acc[key] = {
                  name: item.menuItem.name,
                  entity: order.entity,
                  quantity: 0,
                  notes: new Set(),
                };
              }
              acc[key].quantity += item.quantity;
              if (item.notes) acc[key].notes.add(item.notes);
            });
            return acc;
          },
          {}
        );
        setMenuItemsByEntity(groupedItems);
      }
    } catch (err) {
      const errorDetails = getErrorDetails(err);
      setError(errorDetails);

      toast({
        title: errorDetails.title,
        description: errorDetails.message,
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, toast]);

  const handleResponse = async (approved) => {
    try {
      setLoading(true);
      await respondToRequest(
        token,
        approved,
        approved ? "Request approved" : "Request rejected"
      );

      setStatus(approved ? "approved" : "rejected");

      toast({
        title: approved ? "Request Approved" : "Request Rejected",
        description: `The request has been successfully ${
          approved ? "approved" : "rejected"
        }.`,
        variant: approved ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process request",
        variant: "destructive",
      });

      setError({
        title: "Action Failed",
        message: "Failed to process your response. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        title={error.title}
        message={error.message}
        onRetry={error.message.includes("try again") ? fetchData : undefined}
      />
    );
  }

  if (!requestData?.request) {
    return null;
  }

  const { request } = requestData;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <AnimatePresence mode="wait">
        {status === "pending" ? (
          <Card className="w-full max-w-sm rounded-2xl shadow-lg" key="pending">
            <CardHeader className="space-y-2 pb-4 text-center">
              <CardTitle className="mb-3 text-3xl font-semibold text-gray-800">
                Meal Order Approval
              </CardTitle>
              <div className="rounded-lg text-center">
                <p className="mb-3 text-blue-800">{request.judulPekerjaan}</p>
                <Badge variant="outline">{request.type}</Badge>
              </div>
            </CardHeader>
            <motion.div
              className="cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <CardContent className="space-y-4">
                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium">
                      {request.employeeOrders.length} Porsi
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Drop Point</span>
                    <span className="font-medium">{request.dropPoint}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Required Date</span>
                    <span className="font-medium">
                      {format(new Date(request.requiredDate), "dd MMM HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge
                      variant="outline"
                      className={getStatusColor(request.status)}
                    >
                      {" "}
                      {getStatusName(request.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center text-muted-foreground">
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                    <span className="ml-2 text-sm">
                      {isOpen ? "Hide Details" : "Show Details"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </motion.div>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                >
                  <CardContent className="pt-0">
                    <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-700">
                          Menu Items:
                        </h3>
                        <div className="space-y-2">
                          {Object.values(menuItemsByEntity).map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg bg-white p-2 text-sm"
                              >
                                <div>
                                  <div className="font-medium">
                                    {item.quantity}x {item.name}
                                  </div>
                                  {item.notes.size > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      Notes: {Array.from(item.notes).join(", ")}
                                    </div>
                                  )}
                                </div>
                                <Badge variant="secondary">{item.entity}</Badge>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      {/* <div className="space-y-2">
                          <h3 className="font-semibold text-gray-700">
                            Contact Info:
                          </h3>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                PIC:{" "}
                              </span>
                              {request.pic.name} ({request.pic.nomorHp})
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Supervisor:{" "}
                              </span>
                              {request.supervisor.name} (
                              {request.supervisor.nomorHp})
                            </div>
                          </div>
                        </div> */}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
            <CardFooter className="flex flex-col gap-3">
              <Button
                onClick={() => handleResponse(true)}
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 bg-green-600 text-base hover:bg-green-700"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
                {loading ? "Processing..." : "Approve Request"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleResponse(false)}
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 border-red-200 text-base text-red-700 hover:bg-red-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <X className="h-5 w-5" />
                )}
                {loading ? "Processing..." : "Reject Request"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <Card className="w-full max-w-sm rounded-2xl shadow-lg">
              <CardHeader className="space-y-2 pb-4 text-center">
                <CardTitle className="mb-3 text-3xl font-semibold text-gray-800">
                  Thank You
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-gray-600">
                  Your confirmation has been received.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Status: {status === "approved" ? "Approved" : "Rejected"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagicLinkApproval;
