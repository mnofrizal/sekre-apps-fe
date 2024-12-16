"use client";

import { useState, useEffect } from "react";
import { Plus, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuTable } from "./menu-table";
import { UserSearch } from "@/components/users/user-search";
import { AddMenuDialog } from "./add-menu-dialog";
import { getMenuItems } from "@/lib/api/menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function DesktopMenuList() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await getMenuItems();
      setAllItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Filter menu items based on search term
  const filteredItems = allItems.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchString) ||
      item.category?.toLowerCase().includes(searchString)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

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
        <h1 className="text-3xl font-bold">Menu List</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <AddMenuDialog onSuccess={fetchMenuItems}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Menu Item
            </Button>
          </AddMenuDialog>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <UserSearch onSearch={handleSearch} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          Loading...
        </div>
      ) : (
        <>
          <MenuTable items={paginatedItems} />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing {filteredItems.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(endIndex, filteredItems.length)} of{" "}
                {filteredItems.length} items
              </p>
            </div>
            <div>
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
