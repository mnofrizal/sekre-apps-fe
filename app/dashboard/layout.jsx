"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import MobileNav, { bottomNavItems } from "@/components/mobile-nav";
import { BackHeader } from "@/components/back-header";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const getPageTitle = (pathname) => {
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function DashboardLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar - only visible on desktop */}
      {!isMobile && (
        <div className="hidden w-64 flex-shrink-0 border-r bg-card lg:block">
          <Sidebar />
        </div>
      )}

      {/* Main content wrapper */}
      <div className="flex w-full flex-1 flex-col">
        {/* Desktop Navbar */}
        {!isMobile && <Navbar />}

        {/* Mobile Back Header */}
        {isMobile && !bottomNavItems.some((item) => pathname === item.href) && (
          <BackHeader title={getPageTitle(pathname)} />
        )}

        {/* Main scrollable area with shadcn ScrollArea */}
        <ScrollArea className="flex-1">
          <main
            className={`container px-4 md:px-6 mx-auto  w-full pb-16 lg:pb-0 ${
              isMobile && !bottomNavItems.some((item) => pathname === item.href)
                ? "pt-14"
                : "pt-4"
            }`}
          >
            {children}
          </main>
        </ScrollArea>

        {/* Mobile Bottom Navigation */}
        {isClient &&
          isMobile &&
          bottomNavItems.some((item) => pathname === item.href) && (
            <MobileNav />
          )}
      </div>
    </div>
  );
}
