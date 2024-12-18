"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrderTabs({ activeTab, onTabChange }) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid h-12 w-full grid-cols-2">
        <TabsTrigger className="h-9" value="order">
          Order
        </TabsTrigger>
        <TabsTrigger className="h-9" value="menu">
          Menu
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}