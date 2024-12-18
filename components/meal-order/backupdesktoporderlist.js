"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, FileDown, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllOrders } from "@/lib/api/order";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { OrderDetailDialog } from "./order-detail-dialog";
import { ClipboardX } from "lucide-react";

export function DesktopOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubBidang, setSelectedSubBidang] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Get unique sub bidang options from orders
  const subBidangOptions = useMemo(() => {
    const uniqueSubBidangs = new Set(
      orders.map((order) => order.supervisor.subBidang)
    );
    return ["all", ...Array.from(uniqueSubBidangs)];
  }, [orders]);

  // Filter orders based on search, sub bidang, and date
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.judulPekerjaan
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.supervisor.subBidang
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.pic.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubBidang =
        selectedSubBidang === "all" ||
        order.supervisor.subBidang === selectedSubBidang;

      const matchesDate =
        !selectedDate ||
        format(new Date(order.requestDate), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd");

      return matchesSearch && matchesSubBidang && matchesDate;
    });
  }, [orders, searchQuery, selectedSubBidang, selectedDate]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meal Order List</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Order
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sub Bidang Filter */}
        <Select value={selectedSubBidang} onValueChange={setSelectedSubBidang}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Sub Bidang" />
          </SelectTrigger>
          <SelectContent>
            {subBidangOptions.map((subBidang) => (
              <SelectItem key={subBidang} value={subBidang}>
                {subBidang === "all" ? "All Sub Bidang" : subBidang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {(selectedSubBidang !== "all" || selectedDate) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedSubBidang("all");
              setSelectedDate(null);
            }}
            className="h-8 px-2 text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border bg-background p-8 text-center">
          <ClipboardX className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No Orders Found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || selectedSubBidang !== "all" || selectedDate
              ? "No orders match your search criteria. Try adjusting your filters."
              : "There are no orders in the system yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium">Order ID</th>
                <th className="p-4 text-left font-medium">Sub Bidang</th>
                <th className="p-4 text-left font-medium">Total Orders</th>
                <th className="p-4 text-left font-medium">Drop Point</th>
                <th className="p-4 text-left font-medium">PIC</th>
                <th className="p-4 text-left font-medium">Category</th>
                <th className="p-4 text-left font-medium">Request Date</th>
                <th className="p-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                  onClick={() => handleOrderClick(order)}
                >
                  <td className="p-4">{order.id.slice(0, 8)}</td>
                  <td className="p-4">{order.supervisor.subBidang}</td>
                  <td className="p-4">
                    <Badge variant="secondary" className="rounded-full">
                      {order.employeeOrders.length}
                    </Badge>
                  </td>
                  <td className="p-4">{order.dropPoint}</td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{order.pic.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.pic.nomorHp}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {format(new Date(order.requiredDate), "HH:mm")}
                  </td>
                  <td className="p-4">
                    {format(new Date(order.requestDate), "dd MMM yyyy HH:mm")}
                  </td>
                  <td className="p-4">
                    <Badge
                      className={cn({
                        "bg-yellow-100 text-yellow-800":
                          order.status === "PENDING_SUPERVISOR",
                        "bg-green-100 text-green-800":
                          order.status === "APPROVED",
                        "bg-red-100 text-red-800": order.status === "REJECTED",
                        "bg-blue-100 text-blue-800":
                          order.status === "IN_PROGRESS",
                      })}
                    >
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OrderDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
