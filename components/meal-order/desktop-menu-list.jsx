"use client";

import { useState } from "react";
import { FileDown, Eye, MoreHorizontal, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data - in a real app this would come from an API
const menuItems = [
  {
    id: 1,
    name: "Pecel Ayam",
    category: "Makan Berat",
    available: true,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Pecel Lele",
    category: "Makan Berat",
    available: true,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Nasi Pecel",
    category: "Makan Berat",
    available: true,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Nasi Uduk",
    category: "Makan Berat",
    available: false,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Nasi Goreng",
    category: "Makan Berat",
    available: true,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Bakso",
    category: "Snack",
    available: true,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 7,
    name: "Siomay",
    category: "Snack",
    available: false,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 8,
    name: "Batagor",
    category: "Snack",
    available: true,
    image: "/placeholder.svg?height=50&width=50",
  },
];

export function DesktopMenuList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    category: "",
    available: true,
    image: "",
  });

  const filteredItems = menuItems.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return filterCategory === "all" || item.category === filterCategory
      ? searchMatch
      : false;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSave = (data) => {
    const newMenuItems = [...menuItems];
    newMenuItems.push({
      ...data,
      id: menuItems.length + 1,
      image: "/placeholder.svg?height=50&width=50", // Replace with actual image handling
    });
    // Update menuItems state or send data to API
    console.log("New menu item:", data); // Log the new data
    setNewMenuItem({ name: "", category: "", available: true, image: "" }); // Reset form after save
    setIsDialogOpen(false);

    // Update pagination after adding new item
    setCurrentPage(Math.ceil(newMenuItems.length / itemsPerPage));
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Menu List</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Add a new menu item to the list.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(newMenuItem);
                }}
              >
                {" "}
                {/* Form to handle saving */}
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newMenuItem.name}
                      onChange={(e) =>
                        setNewMenuItem({ ...newMenuItem, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="flex items-center gap-4 pl-5">
                    {" "}
                    {/* Removed unnecessary grid classes */}
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newMenuItem.category}
                      onValueChange={(value) =>
                        setNewMenuItem({ ...newMenuItem, category: value })
                      }
                      className=""
                    >
                      {" "}
                      {/* Added className="w-full" */}
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Makan Berat">Makan Berat</SelectItem>
                        <SelectItem value="Snack">Snack</SelectItem>
                        {/* Add more categories as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="available" className="text-right">
                      Available
                    </Label>
                    <Switch
                      id="available"
                      checked={newMenuItem.available}
                      onCheckedChange={(checked) =>
                        setNewMenuItem({ ...newMenuItem, available: checked })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {" "}
                    {/* Submit button for the form */}
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full max-w-xs rounded-md border px-3 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="all">All Categories</option>
          <option value="Makan Berat">Makan Berat</option>
          <option value="Snack">Snack</option>
        </select>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table className="">
          <TableHeader>
            <TableRow className="rounded-2xl border-b bg-slate-100">
              <TableHead className="font-semibold text-primary">
                Image
              </TableHead>
              <TableHead className="font-semibold text-primary">Name</TableHead>
              <TableHead className="font-semibold text-primary">
                Category
              </TableHead>
              <TableHead className="font-semibold text-primary">
                Available
              </TableHead>
              <TableHead className="text-right font-semibold text-primary">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.available ? "default" : "secondary"}
                      className={
                        item.available
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {item.available ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-4 text-center">
                  No menu items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredItems.length > 0
            ? `${indexOfFirstItem + 1}-${Math.min(
                indexOfLastItem,
                filteredItems.length
              )} of ${filteredItems.length}`
            : "0 of 0"}{" "}
          items
        </span>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
