"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { Student } from "@prisma/client";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/components/button";
import { Badge } from "@/ui/components/badge";
import { Input } from "@/ui/components/input";
import { NewStudentDialog } from "./new-student-dialog";
import { searchStudentsAction } from "./_actions";

/**
 * Students table component with search
 */
export function StudentsTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Debounce search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        setIsLoading(true);
        searchStudentsAction(searchQuery)
          .then(setStudents)
          .catch(console.error)
          .finally(() => setIsLoading(false));
      } else {
        setStudents([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const columns: ColumnDef<Student>[] = React.useMemo(
    () => [
      {
        accessorKey: "studentNo",
        header: "Student No.",
        enableSorting: true,
        cell: ({ row }) => {
          const student = row.original;
          return (
            <Link
              href={`/students/${student.id}`}
              className="text-primary hover:underline font-mono"
            >
              {student.studentNo}
            </Link>
          );
        },
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        enableSorting: true,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        enableSorting: true,
      },
      {
        accessorKey: "isActive",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => {
          const isActive = row.getValue("isActive") as boolean;
          return (
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by student number, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Searching...</p>
      ) : students.length === 0 && searchQuery.trim().length > 0 ? (
        <p className="text-muted-foreground">No students found.</p>
      ) : students.length === 0 ? (
        <p className="text-muted-foreground">
          Enter a search query to find students.
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={students}
          searchPlaceholder="Search in results..."
        />
      )}
    </div>
  );
}

/**
 * New Student button component
 */
export function NewStudentButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Student</Button>
      <NewStudentDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

// Also attach to StudentsTable for backward compatibility
StudentsTable.NewStudentButton = NewStudentButton;
