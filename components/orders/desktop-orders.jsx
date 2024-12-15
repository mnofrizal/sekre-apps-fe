import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UtensilsCrossed,
  Car,
  FileBox,
  Building2,
  AlertCircle,
} from "lucide-react";

const orderTypes = {
  approval: {
    label: "Needs Approval",
    icon: AlertCircle,
    color: "text-red-600",
  },
  all: { label: "All Orders", icon: null, color: "text-gray-600" },
  meal: { label: "Meal", icon: UtensilsCrossed, color: "text-green-600" },
  transport: { label: "Transport", icon: Car, color: "text-blue-600" },
  stationary: { label: "Stationary", icon: FileBox, color: "text-yellow-600" },
  room: { label: "Room", icon: Building2, color: "text-purple-600" },
};

const sampleOrders = [
  {
    id: 1,
    type: "meal",
    title: "Lunch Order",
    requester: "John Doe",
    date: "2023-06-10",
    status: "Pending",
    needsApproval: true,
  },
  {
    id: 2,
    type: "transport",
    title: "Airport Pickup",
    requester: "Jane Smith",
    date: "2023-06-11",
    status: "Approved",
    needsApproval: false,
  },
  {
    id: 3,
    type: "stationary",
    title: "Office Supplies",
    requester: "Mike Johnson",
    date: "2023-06-12",
    status: "Pending",
    needsApproval: true,
  },
  {
    id: 4,
    type: "room",
    title: "Meeting Room Booking",
    requester: "Sarah Brown",
    date: "2023-06-13",
    status: "Rejected",
    needsApproval: false,
  },
  {
    id: 5,
    type: "meal",
    title: "Dinner Order",
    requester: "Emily Davis",
    date: "2023-06-14",
    status: "Pending",
    needsApproval: true,
  },
  {
    id: 6,
    type: "transport",
    title: "Client Visit",
    requester: "Tom Wilson",
    date: "2023-06-15",
    status: "Approved",
    needsApproval: false,
  },
];

export function DesktopOrders() {
  const [orders, setOrders] = useState(sampleOrders);
  const [activeTab, setActiveTab] = useState("all");

  const handleApprove = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status: "Approved", needsApproval: false }
          : order
      )
    );
  };

  const handleReject = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status: "Rejected", needsApproval: false }
          : order
      )
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "approval") return order.needsApproval;
    if (activeTab === "all") return !order.needsApproval;
    return order.type === activeTab && !order.needsApproval;
  });

  const countOrdersNeedingApproval = (orders) => {
    return orders.filter((order) => order.needsApproval).length;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Orders</h1>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          {Object.entries(orderTypes).map(([key, { label }]) => (
            <TabsTrigger key={key} value={key} className="relative">
              {label}
              {key === "approval" && (
                <Badge
                  variant="destructive"
                  className={`ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center ${
                    countOrdersNeedingApproval(orders) === 0 ? "hidden" : ""
                  }`}
                >
                  {countOrdersNeedingApproval(orders)}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6 space-y-4">
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const OrderIcon = orderTypes[order.type].icon;
              return (
                <Card key={order.id} className="flex w-full flex-col">
                  <CardContent className="flex-grow p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {OrderIcon && (
                          <OrderIcon
                            className={`h-5 w-5 ${
                              orderTypes[order.type].color
                            }`}
                          />
                        )}
                        <h2 className="text-xl font-semibold">{order.title}</h2>
                      </div>
                      <Badge
                        variant={
                          order.status === "Approved"
                            ? "success"
                            : order.status === "Rejected"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Requester:</span>{" "}
                        {order.requester}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {order.date}
                      </p>
                    </div>
                  </CardContent>
                  {order.needsApproval && (
                    <CardFooter className="bg-muted p-4">
                      <div className="flex w-full justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleReject(order.id)}
                        >
                          Reject
                        </Button>
                        <Button onClick={() => handleApprove(order.id)}>
                          Approve
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
