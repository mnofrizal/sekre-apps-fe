"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeSearch } from "@/components/employees/employee-search";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { getEmployees } from "@/lib/api/employees";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ManageEmployees() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      setAllEmployees(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter((employee) => {
      const searchString = searchTerm.toLowerCase();
      return (
        employee.nama?.toLowerCase().includes(searchString) ||
        employee.nip?.toLowerCase().includes(searchString) ||
        employee.jabatan?.toLowerCase().includes(searchString) ||
        employee.bagian?.toLowerCase().includes(searchString) ||
        employee.subBidang?.toLowerCase().includes(searchString) ||
        employee.email?.toLowerCase().includes(searchString) ||
        employee.nomorHp?.includes(searchString)
      );
    });
  }, [allEmployees, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
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
        <h1 className="text-3xl font-bold">Manage Employees</h1>
        <AddEmployeeDialog onSuccess={fetchEmployees}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </AddEmployeeDialog>
      </div>

      <div className="flex items-center justify-between">
        <EmployeeSearch onSearch={handleSearch} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
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
          <EmployeeTable employees={paginatedEmployees} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of{" "}
              {filteredEmployees.length} employees
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
