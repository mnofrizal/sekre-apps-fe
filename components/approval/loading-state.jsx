"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4"
    >
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
          <h2 className="text-lg font-medium">Verifying Request</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we verify your approval request...
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
