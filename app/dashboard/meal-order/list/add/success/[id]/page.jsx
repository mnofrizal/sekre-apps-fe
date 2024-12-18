"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderById } from "@/lib/api/order";
import { format } from "date-fns";

export default function SuccessSubmitPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(params.id);
        setOrder(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const handleBackToList = () => {
    router.push("/dashboard/");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Meal Order Details",
        text: `Order #${order.id} has been submitted successfully!`,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 text-center">
            <h2 className="mb-2 text-lg font-semibold text-red-600">Error</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleBackToList} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) return null;

  const totalEmployees = order.employeeOrders.length + " Porsi";
  const waktuPemesanan = format(
    new Date(order.requestDate),
    "dd-MM-yyyy HH:mm"
  );

  const orderDetails = [
    { label: "Order ID", value: `#${order.id}` },
    { label: "Total Pesanan", value: totalEmployees },
    { label: "Drop Point", value: order.dropPoint },
    { label: "Waktu Pemesanan", value: waktuPemesanan },
    { label: "PIC", value: `${order.pic.name} (${order.pic.nomorHp})` },
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-background py-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto w-full max-w-md">
          <Card className="rounded-2xl border-gray-200 shadow-sm">
            <CardContent className="flex flex-col items-center p-6">
              <CheckCircle className="mb-4 h-16 w-16 text-green-500" />

              <h1 className="mb-2 text-center text-2xl font-bold">
                Order Submitted Successfully!
              </h1>

              <p className="mb-6 text-center text-muted-foreground">
                Your meal order has been received and is being processed.
              </p>

              <div className="mb-6 w-full space-y-2 rounded-2xl border border-gray-200 p-4">
                <ul className="divide-y divide-gray-100">
                  {orderDetails.map(({ label, value }) => (
                    <li key={label} className="flex items-center py-3">
                      <span className="w-1/3 text-sm text-gray-600">
                        {label}
                      </span>
                      <span className="w-2/3 font-medium text-gray-900">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col gap-3">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="h-12 w-full rounded-xl"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Order Details
                </Button>

                <Button
                  onClick={handleBackToList}
                  className="h-12 w-full rounded-xl"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
