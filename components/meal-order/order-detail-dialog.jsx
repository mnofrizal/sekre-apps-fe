import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const timeline = [
  { id: 1, name: "Order Placed", status: "complete" },
  { id: 2, name: "Order Confirmed", status: "complete" },
  { id: 3, name: "Preparing", status: "complete" },
  { id: 4, name: "Ready for Pickup", status: "complete" },
  { id: 5, name: "Out for Delivery", status: "pending" },
  { id: 6, name: "Delivered", status: "pending" },
];

export function OrderDetailDialog({ open, onOpenChange, order }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Meal Order Details</DialogTitle>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-100"
            >
              {order?.status || "Processing"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-8 py-4">
          <div className="col-span-2">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Order ID
                </h3>
                <p>{order?.id || "N/A"}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  PIC
                </h3>
                <p>{order?.pic || "N/A"}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Sub Bidang
                </h3>
                <p>{order?.subBidang || "N/A"}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Jumlah
                </h3>
                <p>{order?.jumlah || "N/A"}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Drop Point
                </h3>
                <p>{order?.dropPoint || "N/A"}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Kategori
                </h3>
                <p>{order?.kategori || "N/A"}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Waktu Order
                </h3>
                <p>{order?.waktuOrder || "N/A"}</p>
              </div>
            </div>

            <Tabs defaultValue="order-details" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="order-details">Order Details</TabsTrigger>
                <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
                <TabsTrigger value="delivery-info">Delivery Info</TabsTrigger>
              </TabsList>
              <TabsContent value="order-details" className="space-y-4">
                <div className="mt-4">
                  <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                  <p>
                    This section would contain a detailed summary of the order,
                    including any special instructions or dietary requirements.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="menu-items">
                <div className="mt-4">
                  <h2 className="mb-4 text-lg font-semibold">Menu Items</h2>
                  <p>
                    This section would list all the menu items included in this
                    order, along with their quantities and any customizations.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="delivery-info">
                <div className="mt-4">
                  <h2 className="mb-4 text-lg font-semibold">
                    Delivery Information
                  </h2>
                  <p>
                    This section would provide details about the delivery,
                    including estimated delivery time and any delivery
                    instructions.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Order Timeline</h3>
            <div className="space-y-6">
              {timeline.map((item, index) => (
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
                      <Check className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
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
      </DialogContent>
    </Dialog>
  );
}
