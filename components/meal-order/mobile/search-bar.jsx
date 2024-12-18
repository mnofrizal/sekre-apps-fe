"use client";

import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar({ value, onChange }) {
  return (
    <div className="sticky top-14 z-10 -mx-4 bg-background px-4 py-3 pb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="h-12 pl-9"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1 items-center justify-between"
        >
          Sort & Filter
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="flex-1 items-center justify-between"
        >
          Date
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}