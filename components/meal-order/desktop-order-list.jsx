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
  Copy,
  LucideLink,
  Eye,
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
import { deleteOrder, exportOrder, getAllOrders } from "@/lib/api/order";
import { format } from "date-fns";
import {
  FRONTEND_BASE_URL,
  getMealCategory,
  getStatusColor,
  getStatusName,
} from "@/lib/constant";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";

export function DesktopOrderList() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
  const handleDelete = async (order) => {
    try {
      await deleteOrder(order.id);
      // Refresh the orders after deletion
      fetchOrders();
      toast({
        title: "Success",
        description: `Order telah berhasil dihapus!`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: `Error menghapus order, error: ${error}`,
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportOrder();
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `meal_orders_${new Date()
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Orders have been successfully exported!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error exporting orders:", error);
      toast({
        title: "Error",
        description: `Error exporting orders, error: ${error}`,
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = (order) => {
    const findLink = (status, type) =>
      order.status === status
        ? order.approvalLinks.find((link) => link.type === type && !link.isUsed)
        : null;

    const getApprovalToken = () => {
      if (session.user.role === "ADMIN") {
        return order.approvalLinks.find((link) => !link.isUsed)?.token;
      } else {
        switch (session.user.role) {
          case "SUPERVISOR":
            return findLink("PENDING_SUPERVISOR", "SUPERVISOR")?.token;
          case "KITCHEN":
            return findLink("PENDING_KITCHEN", "KITCHEN")?.token;
          default:
            return null;
        }
      }
    };

    const approvalToken = getApprovalToken();

    if (approvalToken) {
      navigator.clipboard.writeText(
        `${FRONTEND_BASE_URL}/approval/${approvalToken}`
      );
    }

    toast({
      title: "Success",
      description: `Link telah berhasil disalin!`,
      variant: "success",
    });
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

  const getEntityQuantities = (employeeOrders) => {
    const entityTotals = {};
    if (!employeeOrders) return entityTotals;

    employeeOrders.forEach((employee) => {
      if (!employee || !employee.entity || !employee.orderItems) return;

      if (!entityTotals[employee.entity]) {
        entityTotals[employee.entity] = 0;
      }

      employee.orderItems.forEach((item) => {
        if (item && typeof item.quantity === "number") {
          entityTotals[employee.entity] += item.quantity;
        }
      });
    });
    return entityTotals;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meal Order List</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Link href="/dashboard/meal-order/list/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Buat Pesanan
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

      <div className="rounded-lg border shadow-sm">
        <Table className="">
          <TableHeader className="rounded-2xl">
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
            {currentItems.map((order, index) => (
              <TableRow
                key={order.id}
                className={index % 2 === 0 ? "bg-white" : "bg-[#fbfdff]"}
              >
                <TableCell className="p-7">
                  <button
                    onClick={() => handleOrderClick(order)}
                    className="font-semibold text-gray-800 hover:underline"
                  >
                    #IH{order.id.toString().slice(-4).toUpperCase()}
                  </button>
                </TableCell>
                <TableCell className="text-gray-800">
                  {order.supervisor.subBidang}
                </TableCell>
                <TableCell className="text-gray-800">
                  <button
                    onClick={() => handleOrderClick(order)}
                    className="text-primary hover:underline"
                  >
                    {(() => {
                      console.log("employeeOrders:", order.employeeOrders);
                      const entityTotals = getEntityQuantities(
                        order.employeeOrders
                      );
                      console.log("entityTotals:", entityTotals);
                      const totalPorsi = Object.values(entityTotals).reduce(
                        (sum, qty) => sum + qty,
                        0
                      );
                      console.log("totalPorsi:", totalPorsi);
                      const entityBreakdown = Object.entries(entityTotals)
                        .map(([entity, qty]) => `${entity}: ${qty}`)
                        .join(", ");
                      return totalPorsi > 0
                        ? `${totalPorsi} Porsi`
                        : order.employeeOrders.length + " Porsi";
                    })()}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="justify-left flex items-center rounded-lg text-gray-800">
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
                      <div className="font-medium text-gray-800">
                        {order.pic.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.pic.nomorHp}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="rounded-lg border px-1 py-1 text-center font-medium text-gray-800">
                    {getMealCategory(order.requiredDate)}
                  </div>
                </TableCell>
                <TableCell className="text-gray-800">
                  {format(new Date(order.requestDate), "dd MMM yyyy")}
                  {/* <div className="text-xs text-muted-foreground">
                    {format(new Date(order.requestDate), "HH:mm")}
                  </div> */}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(
                      order.status
                    )} rounded-lg px-2 py-1`}
                  >
                    {getStatusName(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleOrderClick(order)}
                      >
                        View details
                      </DropdownMenuItem>
                      {session?.user?.role !== "KITCHEN" && (
                        <>
                          <DropdownMenuItem className="cursor-pointer">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(order)}
                            className="cursor-pointer text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                      {session?.user?.role === "ADMIN" &&
                        ["PENDING_SUPERVISOR", "PENDING_GA"].includes(
                          order.status
                        ) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleCopyLink(order)}
                              className="cursor-pointer"
                            >
                              <LucideLink className="mr-1 h-4 w-4" />
                              Approval Link
                            </DropdownMenuItem>
                          </>
                        )}
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
            <SelectTrigger className="w-full">
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
