"use client";

import { useState, useEffect, useMemo } from "react";
import { FileDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/users/user-table";
import { UserSearch } from "@/components/users/user-search";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { exportUser, getUsers } from "@/lib/api/users";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

export default function ManageUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setAllUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const searchString = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchString) ||
        user.email?.toLowerCase().includes(searchString) ||
        user.username?.toLowerCase().includes(searchString) ||
        user.role?.toLowerCase().includes(searchString)
      );
    });
  }, [allUsers, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleUserUpdate = () => {
    fetchUsers(); // Refresh the user list
  };

  const handleExport = async () => {
    let url;
    try {
      const blob = await exportUser();

      // Double-check blob type
      if (!(blob instanceof Blob)) {
        throw new Error("Invalid response format");
      }

      url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "users.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting users:", error);
    } finally {
      if (url) {
        window.URL.revokeObjectURL(url);
      }
    }
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
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <AddUserDialog onSuccess={handleUserUpdate}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </AddUserDialog>
      </div>

      <div className="flex items-center justify-between">
        <UserSearch onSearch={handleSearch} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <UserTable users={paginatedUsers} onUserUpdate={handleUserUpdate} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      )}
    </div>
  );
}
