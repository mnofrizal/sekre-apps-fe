"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DesktopAddOrder from "@/components/meal-order/desktop-add-order";
import MobileAddOrder from "@/components/meal-order/mobile-add-order";

export default function AddOrderPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      {isMobile ? (
        <MobileAddOrder
          onBack={handleBack}
          setActiveContent={() => {}}
          setIsFormValid={setIsFormValid}
        />
      ) : (
        <DesktopAddOrder onBack={handleBack} setIsFormValid={setIsFormValid} />
      )}
    </div>
  );
}
