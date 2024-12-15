"use client";

import { useState, useEffect } from "react";
import { MobileOrderList } from "@/components/meal-order/mobile-order-list";
import { DesktopOrderList } from "@/components/meal-order/desktop-order-list";
import { AnimatePresence, motion } from "framer-motion";

export default function MealOrderListPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isMobile ? (
        <motion.div
          key="mobile"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MobileOrderList />
        </motion.div>
      ) : (
        <motion.div
          key="desktop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-2"
        >
          <DesktopOrderList />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
