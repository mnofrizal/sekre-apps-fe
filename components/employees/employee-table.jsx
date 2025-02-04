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
import { EmployeeActions } from "./employee-actions";

export function EmployeeTable({ employees }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Sub Department</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Secretary</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.nama}</TableCell>
              <TableCell>{employee.nip}</TableCell>
              <TableCell>{employee.jabatan}</TableCell>
              <TableCell>{employee.bagian}</TableCell>
              <TableCell>{employee.subBidang}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.nomorHp}</TableCell>
              <TableCell>{employee.sekretaris}</TableCell>
              <TableCell className="text-right">
                <EmployeeActions employee={employee} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
