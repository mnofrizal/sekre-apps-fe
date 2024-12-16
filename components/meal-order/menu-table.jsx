"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MenuActions } from "./menu-actions";

export function MenuTable({ items }) {
  const formatCategory = (category) => {
    switch (category) {
      case "HEAVY_MEAL":
        return "Makanan Berat";
      case "SNACK":
        return "Snack";
      default:
        return category
          .split("_")
          .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
          .join(" ");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{formatCategory(item.category)}</TableCell>
              <TableCell>
                <Badge
                  variant={item.isAvailable ? "success" : "secondary"}
                  className={
                    item.isAvailable ? "bg-green-100 text-green-800" : ""
                  }
                >
                  {item.isAvailable ? "Available" : "Not Available"}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(item.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <MenuActions item={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
