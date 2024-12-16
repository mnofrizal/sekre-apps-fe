"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Search() {
  return (
    <div className="flex-1 md:flex-initial">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="w-full rounded-xl pl-8"
        />
      </div>
    </div>
  );
}