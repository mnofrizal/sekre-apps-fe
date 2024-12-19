"use client";

import { DesktopMenuList } from "@/components/meal-order/desktop-menu-list";
import { useState, useEffect } from "react";

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
