"use client";

import { useState, useEffect } from "react";
import { DesktopMenuList } from "@/components/meal-order/desktop-menu-list";

export default function MenuPage() {
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
    return <div>Mobile menu list has not been implemented yet.</div>;
  }

  return (
    <div className="p-6">
      <DesktopMenuList />
    </div>
  );
}
