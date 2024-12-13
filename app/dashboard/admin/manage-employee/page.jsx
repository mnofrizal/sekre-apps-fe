"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Sample employee data (replace with actual data fetching in a real application)
const initialEmployees = [
  {
    id: 1,
    nama: "Alice Johnson",
    nip: "198501152010011001",
    jabatan: "Software Engineer",
    bagian: "IT",
    subBidang: "Development",
    email: "alice@example.com",
    nomorHp: "081234567890",
  },
  {
    id: 2,
    nama: "Bob Smith",
    nip: "198607202011011002",
    jabatan: "HR Manager",
    bagian: "Human Resources",
    subBidang: "Recruitment",
    email: "bob@example.com",
    nomorHp: "081234567891",
  },
  {
    id: 3,
    nama: "Carol Williams",
    nip: "199003032012012001",
    jabatan: "Financial Analyst",
    bagian: "Finance",
    subBidang: "Budgeting",
    email: "carol@example.com",
    nomorHp: "081234567892",
  },
];

export default function ManageEmployees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    bagian: "",
    subBidang: "",
    email: "",
    nomorHp: "",
  });

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.nip.includes(searchQuery) ||
      employee.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.bagian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.subBidang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.nomorHp.includes(searchQuery)
  );

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }]);
    setNewEmployee({
      nama: "",
      nip: "",
      jabatan: "",
      bagian: "",
      subBidang: "",
      email: "",
      nomorHp: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Employees</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEmployee}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nama" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="nama"
                    value={newEmployee.nama}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, nama: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nip" className="text-right">
                    NIP
                  </Label>
                  <Input
                    id="nip"
                    value={newEmployee.nip}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, nip: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="jabatan" className="text-right">
                    Jabatan
                  </Label>
                  <Input
                    id="jabatan"
                    value={newEmployee.jabatan}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        jabatan: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bagian" className="text-right">
                    Bagian
                  </Label>
                  <Input
                    id="bagian"
                    value={newEmployee.bagian}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, bagian: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subBidang" className="text-right">
                    Sub Bidang
                  </Label>
                  <Input
                    id="subBidang"
                    value={newEmployee.subBidang}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        subBidang: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nomorHp" className="text-right">
                    Nomor HP
                  </Label>
                  <Input
                    id="nomorHp"
                    value={newEmployee.nomorHp}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        nomorHp: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Employee</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Bagian</TableHead>
              <TableHead>Sub Bidang</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nomor HP</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.nama}</TableCell>
                <TableCell>{employee.nip}</TableCell>
                <TableCell>{employee.jabatan}</TableCell>
                <TableCell>{employee.bagian}</TableCell>
                <TableCell>{employee.subBidang}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.nomorHp}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit employee</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete employee
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
