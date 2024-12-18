"use client";

import { DesktopProfile } from "@/components/profile/desktop-profile";
import { MobileProfile } from "@/components/profile/mobile-profile";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile ? <MobileProfile /> : <DesktopProfile />;
}
