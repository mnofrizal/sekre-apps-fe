"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function UserSearch({ onSearch }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search users..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
