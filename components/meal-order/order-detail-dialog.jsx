"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Circle, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getMealCategory, getStatusColor, getStatusName } from "@/lib/constant";
import { Button } from "../ui/button";

const timeline = [
  { id: 1, name: "Inisiasi Pesanan", status: "complete" },
  { id: 2, name: "Approval ASMAN", status: "pending" },
  { id: 3, name: "Approval SEKRETARIAT", status: "pending" },
  { id: 4, name: "Pesanan Diproses", status: "pending" },
  { id: 5, name: "Pesanan Terkirim", status: "pending" },
];

export function OrderDetailDialog({ open, onOpenChange, order }) {
  if (!order) return null;

  const getTimelineStatus = () => {
    const statusMap = {
      PENDING_SUPERVISOR: 1,
      PENDING_GA: 2,
      // PENDING_KITCHEN: 4,
      IN_PROGRESS: 4,
      COMPLETED: 5,
    };

    const currentStep = statusMap[order.status] || 1;

    return timeline.map((item) => ({
      ...item,
      status: item.id <= currentStep ? "complete" : "pending",
    }));
  };

  // Aggregate menu items
  const aggregatedMenuItems = useMemo(() => {
    const itemsMap = new Map();

    order.employeeOrders.forEach((employeeOrder) => {
      employeeOrder.orderItems.forEach((item) => {
        const key = `${item.menuItem.id}-${item.menuItem.name}-${employeeOrder.entity}`;
        if (!itemsMap.has(key)) {
          itemsMap.set(key, {
            id: item.menuItem.id,
            name: item.menuItem.name,
            quantity: 0,
            entity: employeeOrder.entity,
            notes: new Set(),
          });
        }
        const existing = itemsMap.get(key);
        existing.quantity += item.quantity;
        if (item.notes) {
          existing.notes.add(item.notes);
        }
      });
    });

    return Array.from(itemsMap.values());
  }, [order.employeeOrders]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-2xl p-5">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Order Details {order.id.slice(0, 8)}
            </DialogTitle>
            <Badge
              className={`${getStatusColor(
                order.status
              )} rounded-lg p-2 px-3 text-sm `}
            >
              {getStatusName(order.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <Tabs defaultValue="order-details" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="order-details">Order Details</TabsTrigger>
                <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
                <TabsTrigger value="delivery-info">Delivery Info</TabsTrigger>
              </TabsList>
              <TabsContent value="order-details" className="space-y-4">
                <div className="mt-4">
                  <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        Judul Pekerjaan
                      </h3>
                      <p>{order.judulPekerjaan}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        Sub Bidang
                      </h3>
                      <p>{order.supervisor.subBidang}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        Total Orders
                      </h3>
                      <p>{order.employeeOrders.length} Porsi</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        Drop Point
                      </h3>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <p>{order.dropPoint}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        Category
                      </h3>
                      <p>{getMealCategory(order.requiredDate)}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        Request Date
                      </h3>
                      <p>
                        {format(
                          new Date(order.requestDate),
                          "dd MMM yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="menu-items">
                <div className="mt-4">
                  <h2 className="mb-4 text-lg font-semibold">Menu Items</h2>
                  <div className="space-y-2">
                    {aggregatedMenuItems.map((item) => (
                      <div
                        key={`${item.id}-${item.entity}`}
                        className="flex items-center justify-between rounded-lg border bg-card p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl font-semibold">
                            {item.quantity}x
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {item.notes.size > 0 && (
                              <p className="text-sm text-muted-foreground">
                                Notes: {Array.from(item.notes).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-medium">{item.entity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="delivery-info">
                <div className="mt-4 space-y-4">
                  <h2 className="text-lg font-semibold">
                    Delivery Information
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-[140px] font-medium">ASMAN</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {order.supervisor.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {order.supervisor.nomorHp}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="min-w-[140px] font-medium">PIC</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {order.pic.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {order.pic.nomorHp}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="min-w-[140px] font-medium">
                        Drop Point
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {order.dropPoint}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="min-w-[140px] font-medium">
                        Required Time
                      </div>
                      <div>
                        {format(
                          new Date(order.requiredDate),
                          "dd MMM yyyy HH:mm"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4 border-l border-border pl-4">
            <h3 className="text-lg font-medium">Order Timeline</h3>
            <div className="space-y-6">
              {getTimelineStatus().map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2",
                      item.status === "complete"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    )}
                  >
                    {item.status === "complete" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)} className="">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
