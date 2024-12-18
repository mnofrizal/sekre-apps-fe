"use client";

import { useState, useEffect, useMemo } from "react";
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
import { getAllOrders } from "@/lib/api/order";
import { format } from "date-fns";

const getStatusColor = (status) => {
  switch (status) {
    case "PENDING_SUPERVISOR":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "APPROVED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const zonaWaktuOrder = [
  { name: "Sarapan", time: "06:00:00.000Z" },
  { name: "Makan Siang", time: "12:00:00.000Z" },
  { name: "Makan Sore", time: "16:00:00.000Z" },
  { name: "Makan Malam", time: "19:00:00.000Z" },
];

const getMealCategory = (date) => {
  const hours = new Date(date).getHours();

  if (hours >= 6 && hours < 12) {
    return "Sarapan";
  } else if (hours >= 12 && hours < 16) {
    return "Makan Siang";
  } else if (hours >= 16 && hours < 19) {
    return "Makan Sore";
  } else if (hours >= 19 || hours < 6) {
    return "Makan Malam";
  }
  return ""; // fallback
};

export function DesktopOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        (order.judulPekerjaan
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          order.supervisor.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.supervisor.subBidang
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        (statusFilter === "All" || order.status === statusFilter) &&
        (subBidangFilter === "All" ||
          order.supervisor.subBidang === subBidangFilter)
    );
  }, [orders, searchQuery, statusFilter, subBidangFilter]);

  const sortedOrders = useMemo(() => {
    let sortableOrders = [...filteredOrders];
    if (sortConfig.key !== null) {
      sortableOrders.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key.includes(".")) {
          const keys = sortConfig.key.split(".");
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        Loading...
      </div>
    );
  }

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
            <SelectItem value="PENDING_SUPERVISOR">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="rounded-2xl border-b bg-slate-100">
              <SortableTableHeader sortKey="id">Order ID</SortableTableHeader>
              <SortableTableHeader sortKey="supervisor.subBidang">
                Sub Bidang
              </SortableTableHeader>
              <SortableTableHeader sortKey="employeeOrders">
                Jumlah
              </SortableTableHeader>
              <SortableTableHeader sortKey="dropPoint">
                Drop Point
              </SortableTableHeader>
              <SortableTableHeader sortKey="pic.name">PIC</SortableTableHeader>
              <SortableTableHeader sortKey="type">Kategori</SortableTableHeader>
              <SortableTableHeader sortKey="requestDate">
                Request Date
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
                    {order.id.slice(0, 8)}
                  </button>
                </TableCell>
                <TableCell>{order.supervisor.subBidang}</TableCell>
                <TableCell>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xl font-medium text-primary-foreground">
                    {order.employeeOrders.length}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center rounded-lg border px-1 py-1">
                    <MapPin className="mr-1 h-4 w-4" />
                    {order.dropPoint}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {order.pic.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{order.pic.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.pic.nomorHp}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="rounded-lg border px-1 py-1 text-center">
                    {getMealCategory(order.requiredDate)}
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(order.requestDate), "dd MMM yyyy")}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(order.requestDate), "HH:mm")}
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
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(sortedOrders.length / itemsPerPage)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(sortedOrders.length / itemsPerPage)
            }
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
