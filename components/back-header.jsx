"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackHeader({ title }) {
  const router = useRouter();

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-[#0f172a] text-white">
      <div className="flex h-14 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white/90"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-8 w-8" />
        </Button>
        <h1 className="mr-12 flex-1 text-center text-lg font-semibold">
          {title}
        </h1>
      </div>
    </div>
  );
}
