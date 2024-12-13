"use client";

import { useState, useEffect } from "react";
import { MobileOrders } from "@/components/orders/mobile-orders";
import { DesktopOrders } from "@/components/orders/desktop-orders";

export default function OrdersPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <div>
      {isMobile && <MobileOrders />}
      {!isMobile && <DesktopOrders />}
    </div>
  );
}
