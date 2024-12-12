"use client";

import { useState, useEffect } from "react";
import { MobileOrders } from "@/components/orders/mobile-orders";

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
      {!isMobile && <div>Desktop version not implemented yet</div>}
    </div>
  );
}
