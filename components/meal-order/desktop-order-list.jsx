"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MoreVertical,
  FileDown,
  Plus,
  MapPin,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { OrderDetailDialog } from "./order-detail-dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";

const orders = [
  {
    id: "#HF4FY4",
    subBidang: "Pemehliharaan 5-7",
    jumlah: 5,
    dropPoint: "Lobby",
    pic: "John Doe",
    picPhone: "123-456-7890",
    kategori: "Makan Siang",
    dateOrder: "2023-06-11",
    timeOrder: " 08:15",
    status: "Pending",
  },
  {
    id: "#HHF8Y4",
    subBidang: "Fasilitas dan Sarana",
    jumlah: 3,
    dropPoint: "Room A",
    pic: "Jane Smith",
    picPhone: "123-456-7890",
    kategori: "Sarapan",
    dateOrder: "2023-06-11",
    timeOrder: " 08:15",
    status: "Completed",
  },
  {
    id: "#IL4FY3",
    subBidang: "Pengadaan Barang dan Jasa 2",
    jumlah: 8,
    dropPoint: "Cafeteria",
    pic: "Bob Johnson",
    picPhone: "123-456-7890",
    kategori: "Makan Malam",
    dateOrder: "2023-06-11",
    timeOrder: " 08:15",
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("All");
  const [subBidangFilter, setSubBidangFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        (order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.subBidang.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === "All" || order.status === statusFilter) &&
        (subBidangFilter === "All" || order.subBidang === subBidangFilter)
    );
  }, [searchQuery, statusFilter, subBidangFilter]);

  const sortedOrders = useMemo(() => {
    let sortableOrders = [...filteredOrders];
    if (sortConfig.key !== null) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [filteredOrders, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const SortableTableHeader = ({ children, sortKey }) => {
    return (
      <TableHead>
        <button
          className="flex items-center space-x-1"
          onClick={() => requestSort(sortKey)}
        >
          <span>{children}</span>
          {sortConfig.key === sortKey &&
            (sortConfig.direction === "ascending" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            ))}
        </button>
      </TableHead>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meal Order List</h1>
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

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <Select value={subBidangFilter} onValueChange={setSubBidangFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Sub Bidang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sub Bidang</SelectItem>
            <SelectItem value="Pemehliharaan 5-7">Pemehliharaan 5-7</SelectItem>
            <SelectItem value="Fasilitas dan Sarana">
              Fasilitas dan Sarana
            </SelectItem>
            <SelectItem value="Pengadaan Barang dan Jasa 2">
              Pengadaan Barang dan Jasa 2
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="rounded-2xl border-b bg-slate-100">
              <SortableTableHeader sortKey="id">Order ID</SortableTableHeader>
              <SortableTableHeader sortKey="subBidang">
                Sub Bidang
              </SortableTableHeader>
              <SortableTableHeader sortKey="jumlah">Jumlah</SortableTableHeader>
              <SortableTableHeader sortKey="dropPoint">
                Drop Point
              </SortableTableHeader>
              <SortableTableHeader sortKey="pic">PIC</SortableTableHeader>
              <SortableTableHeader sortKey="kategori">
                Kategori
              </SortableTableHeader>
              <SortableTableHeader sortKey="dateOrder">
                Waktu Order
              </SortableTableHeader>
              <SortableTableHeader sortKey="status">Status</SortableTableHeader>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="p-7">
                  <button
                    onClick={() => handleOrderClick(order)}
                    className="text-primary hover:underline"
                  >
                    {order.id}
                  </button>
                </TableCell>
                <TableCell>{order.subBidang}</TableCell>
                <TableCell>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xl font-medium text-primary-foreground">
                    {order.jumlah}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="px-3 py-1">
                    <MapPin className="mr-1 h-4 w-4" />
                    {order.dropPoint}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{order.pic.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{order.pic}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.picPhone}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{order.kategori}</TableCell>
                <TableCell>
                  {order.dateOrder}{" "}
                  <div className="text-xs text-muted-foreground">
                    {order.timeOrder}
                  </div>
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleOrderClick(order)}>
                        View details
                      </DropdownMenuItem>
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
        <span className="text-sm text-muted-foreground">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, sortedOrders.length)} of{" "}
          {sortedOrders.length} entries
        </span>
        <div className="flex items-center space-x-2">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="30">30 per page</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <OrderDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
