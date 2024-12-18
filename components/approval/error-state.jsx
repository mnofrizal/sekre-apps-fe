"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ErrorState({ title, message, onRetry }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4"
    >
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
          <p className="mb-6 text-sm text-gray-600">{message}</p>
          {/* {onRetry && (
            <Button onClick={onRetry} className="w-full">
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Return to Dashboard
          </Button> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
