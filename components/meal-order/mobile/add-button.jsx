"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddMenuDrawer } from "../add-menu-drawer";

export function AddButton({ activeTab, onSaveMenuItem }) {
  if (activeTab === "order") {
    return (
      <Link href="/dashboard/meal-order/list/add">
        <Button
          className="h-12 w-full rounded-xl bg-[#0f172a] text-white hover:bg-[#1e293b]"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Order
        </Button>
      </Link>
    );
  }

  return <AddMenuDrawer onSave={onSaveMenuItem} />;
}