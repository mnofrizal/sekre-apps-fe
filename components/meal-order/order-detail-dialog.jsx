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
  { id: 1, name: "Order Dibuat", status: "complete" },
  { id: 2, name: "Konfirmasi Asman Bidang", status: "complete" },
  { id: 3, name: "Konfirmasi Sekretariat", status: "complete" },
  { id: 4, name: "Konfirmasi Kantin", status: "complete" },
  { id: 5, name: "Pesanan Dikirim", status: "pending" },
  { id: 6, name: "Delivered", status: "pending" },
];

export function OrderDetailDialog({ open, onOpenChange, order }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-2xl p-5">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Meal Order Details {order?.id}
            </DialogTitle>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-100"
            >
              {order?.status || "Processing"}
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
              <TabsContent value="order-details" className="space-y-4 px-2">
                <div className="mt-4">
                  <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                  <div className="mb-6 grid grid-cols-2 gap-4">
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
                </div>
              </TabsContent>
              <TabsContent value="menu-items">
                <div className="mt-4">
                  <h2 className="mb-4 text-lg font-semibold">Menu Items</h2>
                  <div className="max-h-[300px] overflow-y-auto pr-4">
                    <div className="">
                      <div className="flex items-center justify-between border-b border-t p-3">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                            <span className="text-lg font-semibold">1x</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Nasi Goreng Special</h3>
                            <p className="text-sm text-muted-foreground">
                              Pedas, Telur Mata Sapi
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">IP</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-t p-3">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                            <span className="text-lg font-semibold">2x</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Ayam Goreng</h3>
                            <p className="text-sm text-muted-foreground">
                              Paha, Sambal Terasi
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">IP</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-t p-3">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                            <span className="text-lg font-semibold">3x</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Es Teh Manis</h3>
                            <p className="text-sm text-muted-foreground">
                              Regular
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">IPS</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-t p-3">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                            <span className="text-lg font-semibold">3x</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Es Teh Manis</h3>
                            <p className="text-sm text-muted-foreground">
                              Regular
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">Mitra</span>
                      </div>
                    </div>
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
                      <div className="min-w-[140px] font-medium">PIC</div>
                      <div>
                        <div>{order?.pic}</div>
                        <div className="text-sm text-muted-foreground">
                          {order?.picPhone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="min-w-[140px] font-medium">
                        Drop Point
                      </div>
                      <div>{order?.dropPoint}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="min-w-[140px] font-medium">
                        Processed By
                      </div>
                      <div>Kantin Berkah</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="min-w-[140px] font-medium">
                        Delivery Time
                      </div>
                      <div>16:00 WIB</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4 border-l border-border pl-4">
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
      </DialogContent>
    </Dialog>
  );
}
