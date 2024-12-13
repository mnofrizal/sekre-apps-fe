"use client";

import { useState } from "react";
import { Search, MoreVertical, FileDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const orders = [
  {
    id: "1",
    subBidang: "IT",
    jumlah: 5,
    dropPoint: "Lobby",
    pic: "John Doe",
    kategori: "Makan Siang",
    waktuOrder: "2023-06-10 12:30",
    status: "Pending",
  },
  {
    id: "2",
    subBidang: "HR",
    jumlah: 3,
    dropPoint: "Meeting Room A",
    pic: "Jane Smith",
    kategori: "Sarapan",
    waktuOrder: "2023-06-11 08:15",
    status: "Completed",
  },
  {
    id: "3",
    subBidang: "Finance",
    jumlah: 8,
    dropPoint: "Cafeteria",
    pic: "Bob Johnson",
    kategori: "Makan Malam",
    waktuOrder: "2023-06-12 18:45",
    status: "In Progress",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export function DesktopOrderList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.subBidang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order List</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Link href="/dashboard/meal-order/list/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Order
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Sub Bidang</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Drop Point</TableHead>
              <TableHead>PIC</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Waktu Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.subBidang}</TableCell>
                <TableCell>{order.jumlah}</TableCell>
                <TableCell>{order.dropPoint}</TableCell>
                <TableCell>{order.pic}</TableCell>
                <TableCell>{order.kategori}</TableCell>
                <TableCell>{order.waktuOrder}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          A list of recent orders.
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            1
          </Button>
        </div>
      </div>
    </div>
  );
}
