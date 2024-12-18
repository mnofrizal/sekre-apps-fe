"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MobileDashboard } from "@/components/dashboard/mobile-dashboard";
import { DesktopDashboard } from "@/components/dashboard/desktop-dashboard";
import { KitchenDashboard } from "@/components/dashboard/mobile/kitchen-dashboard";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard() {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Show kitchen dashboard for kitchen role on mobile
  if (isMobile && session?.user?.role === "KITCHEN") {
    return <KitchenDashboard />;
  }

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
          <MobileDashboard />
        </motion.div>
      ) : (
        <motion.div
          key="desktop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <DesktopDashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
