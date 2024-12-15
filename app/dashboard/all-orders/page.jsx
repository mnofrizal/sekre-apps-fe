"use client";

import { useState, useEffect } from "react";
import { DesktopOrders } from "@/components/orders/desktop-orders";
import { MobileOrders } from "@/components/orders/mobile-orders";

export default function AllOrdersPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if (isMobile) {
    return <MobileOrders />;
  }

  return (
    <div className="p-6">
      <DesktopOrders />
    </div>
  );
}
