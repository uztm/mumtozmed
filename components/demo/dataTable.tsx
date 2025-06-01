"use client";

import React from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { Patient } from "@/types/Patient"; // import enum UserRole if you have

type DataTableDemoProps = {
  data: Patient[];
};

export function DataTableDemo({ data }: DataTableDemoProps) {
  // Helper to convert role number to string (if you have enum UserRole)
  const roleToString = (role: number) => {
    switch (role) {
      case 0:
        return "Patient";
      case 1:
        return "Doctor";
      case 2:
        return "Moderator";
      case 3:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  return (
    <Table className="w-full bg-card shadow border rounded-md overflow-hidden">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>

          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No data found
            </TableCell>
          </TableRow>
        )}
        {data.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>{patient.id}</TableCell>
            <TableCell>{patient.fullName}</TableCell>
            <TableCell>{patient.email}</TableCell>

            <TableCell>{roleToString(patient.role)}</TableCell>

            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <MoreHorizontal size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => alert(`Edit patient id: ${patient.id}`)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert(`Delete patient id: ${patient.id}`)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
