"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { orders, statusStyles, formatPrice } from "@/lib/order-utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddMenuDrawer } from "./add-menu-drawer";

// Sample menu items (you would typically fetch this from an API)
const initialMenuItems = [
  { id: 1, name: "Nasi Goreng", category: "Makan Berat", isAvailable: true },
  { id: 2, name: "Soto Ayam", category: "Makan Berat", isAvailable: true },
  { id: 3, name: "Gado-gado", category: "Makan Berat", isAvailable: false },
  { id: 4, name: "Rendang", category: "Makan Berat", isAvailable: true },
  { id: 5, name: "Pisang Goreng", category: "Snack", isAvailable: true },
];

export function MobileOrderList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState([]);
  const [activeTab, setActiveTab] = useState("order");
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (id) => {
    setOpenItems((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSaveMenuItem = (menuItem) => {
    if (menuItem.id) {
      // Edit existing item
      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item.id === menuItem.id ? { ...item, ...menuItem } : item
        )
      );
    } else {
      // Add new item
      setMenuItems((currentItems) => [
        ...currentItems,
        { ...menuItem, id: Date.now() }, // Use timestamp as temporary id
      ]);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="order">Order</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>

        <TabsContent value="order" className="mt-4">
          {/* Search Box for Orders */}
          <div className="sticky top-14 z-10 -mx-4 bg-background px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Order List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-lg border bg-card"
                >
                  <Collapsible
                    open={openItems.includes(order.id)}
                    onOpenChange={() => toggleItem(order.id)}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Order #{order.id}</span>
                        <Badge className={statusStyles[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openItems.includes(order.id) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-3 border-t p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Customer:
                          </span>
                          <span>{order.customer}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Order Date:
                          </span>
                          <span>{order.orderDate}</span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-muted-foreground">
                            Items:
                          </span>
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>{formatPrice(item.price)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between border-t pt-2 font-medium">
                          <span>Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="mt-4">
          {/* Search Box for Menu */}
          <div className="sticky top-14 z-10 -mx-4 bg-background px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Menu List */}
          <div className="space-y-3">
            {filteredMenuItems.map((item) => (
              <AddMenuDrawer
                key={item.id}
                isEdit={true}
                initialData={item}
                onSave={handleSaveMenuItem}
              >
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
              </AddMenuDrawer>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Fixed Add Order/Menu Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        {activeTab === "order" ? (
          <Link href="/dashboard/meal-order/list/add">
            <Button
              className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Order
            </Button>
          </Link>
        ) : (
          <AddMenuDrawer onSave={handleSaveMenuItem} />
        )}
      </div>
    </div>
  );
}
