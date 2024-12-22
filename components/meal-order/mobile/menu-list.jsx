"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AddMenuDrawer } from "../add-menu-drawer";

export function MenuList({ menuItems, onSaveMenuItem }) {
  return (
    <div className="space-y-3">
      {menuItems.map((item) => (
        <AddMenuDrawer
          key={item.id}
          isEdit={true}
          initialData={item}
          onSave={onSaveMenuItem}
        >
          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.category === "HEAVY_MEAL"
                    ? "MAKANAN BERAT"
                    : item.category}
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
  );
}
