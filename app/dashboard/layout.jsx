"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { BackHeader } from "@/components/back-header";
import { usePathname } from "next/navigation";

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

  const isDashboardPage = pathname === "/dashboard";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - only visible on desktop */}
      {!isMobile && (
        <div className="hidden w-64 flex-shrink-0 border-r bg-card lg:block">
          <Sidebar />
        </div>
      )}
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        {/* Desktop Navbar */}
        {!isMobile && <Navbar />}

        {/* Mobile Back Header - only visible on mobile and not on dashboard page */}
        {isMobile && !isDashboardPage && (
          <BackHeader title={getPageTitle(pathname)} />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto bg-background pb-16 lg:pb-0 ${
            isMobile && !isDashboardPage ? "pt-14" : ""
          }`}
        >
          <div className="container mx-auto px-1 py-1 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation - only visible on dashboard page */}
        {isClient && isMobile && isDashboardPage && <MobileNav />}
      </div>
    </div>
  );
}
