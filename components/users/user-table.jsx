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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { UserActions } from "./user-actions";

export function UserTable({ users, onUserUpdate }) {
  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader className="rounded-2xl">
          <TableRow className="rounded-2xl border-b bg-slate-100">
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nomor HP</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              className={index % 2 === 0 ? "bg-white" : "bg-[#ffffff]"}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.username}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || "-"}</TableCell>
              <TableCell>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "ADMIN"
                      ? "bg-red-100 text-red-800"
                      : user.role === "KITCHEN"
                      ? "bg-green-100 text-green-800"
                      : user.role === "SECRETARY"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "success" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(user.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <UserActions user={user} onSuccess={onUserUpdate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
