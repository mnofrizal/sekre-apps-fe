"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

function DesktopRoomBooking() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Room Booking</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">
              Desktop room booking has not been implemented yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MobileRoomBooking() {
  return (
    <div className="space-y-4">
      <h1 className="mb-4 text-xl font-semibold">Room Booking</h1>
      <Card>
        <CardContent className="p-4">
          <div className="flex h-32 flex-col items-center justify-center">
            <Building2 className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-center text-sm text-muted-foreground">
              Mobile room booking has not been implemented yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RoomBookingPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile ? <MobileRoomBooking /> : <DesktopRoomBooking />;
}
