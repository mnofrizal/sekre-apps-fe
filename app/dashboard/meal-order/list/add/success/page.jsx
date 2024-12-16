"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessSubmitPage() {
  const router = useRouter();

  const handleBackToList = () => {
    router.push("/dashboard/");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-background py-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 shadow-sm">
          <CardContent className="flex flex-col items-center p-6">
            <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
            <h1 className="mb-2 text-center text-2xl font-bold">
              Order Submitted Successfully!
            </h1>
            <p className="mb-6 text-center text-muted-foreground">
              Your meal order has been received and is being processed.
            </p>
            <div className="mb-6 w-full">
              <h2 className="mb-2 text-lg font-semibold">Order Summary:</h2>
              <ul className="space-y-2">
                <li>
                  <strong>Order ID:</strong> #12345
                </li>
                <li>
                  <strong>Total Employees:</strong> 5
                </li>
                <li>
                  <strong>Drop Point:</strong> Cafeteria
                </li>
                <li>
                  <strong>Estimated Delivery:</strong> 12:30 PM
                </li>
              </ul>
            </div>
            <Button
              onClick={handleBackToList}
              className="mb-3 h-12 w-full rounded-xl"
              variant="outline"
            >
              Share
            </Button>
            <Button
              onClick={handleBackToList}
              className="h-12 w-full rounded-xl"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </div>
      </motion.div>
    </div>
  );
}
