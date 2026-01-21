"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/ui/components/badge";
import { Separator } from "@/ui/components/separator";
import { DataTable } from "@/ui/data-table";
import { formatDateManila } from "@/lib/dates";
import type { Student, Enrollment, SchoolYear, GradeLevel } from "@prisma/client";

type StudentWithEnrollments = Student & {
  enrollments: (Enrollment & {
    schoolYear: SchoolYear;
    gradeLevel: GradeLevel;
  })[];
};

/**
 * Student detail component
 */
export function StudentDetail({ student }: { student: StudentWithEnrollments }) {
  const columns: ColumnDef<Enrollment & { schoolYear: SchoolYear; gradeLevel: GradeLevel }>[] =
    React.useMemo(
      () => [
        {
          accessorKey: "schoolYear.name",
          header: "School Year",
          enableSorting: true,
          cell: ({ row }) => {
            return row.original.schoolYear.name;
          },
        },
        {
          accessorKey: "gradeLevel.name",
          header: "Grade Level",
          enableSorting: true,
          cell: ({ row }) => {
            return row.original.gradeLevel.name;
          },
        },
        {
          accessorKey: "sectionName",
          header: "Section",
          enableSorting: true,
          cell: ({ row }) => {
            const section = row.getValue("sectionName") as string | null;
            return section || <span className="text-muted-foreground">—</span>;
          },
        },
        {
          accessorKey: "status",
          header: "Status",
          enableSorting: true,
          cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const variant =
              status === "ENROLLED"
                ? "default"
                : status === "RESERVED"
                  ? "secondary"
                  : "outline";
            return <Badge variant={variant}>{status}</Badge>;
          },
        },
        {
          accessorKey: "enrolledAt",
          header: "Enrolled At",
          enableSorting: true,
          cell: ({ row }) => {
            const date = row.getValue("enrolledAt") as Date;
            return formatDateManila(date);
          },
        },
      ],
      []
    );

  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/students"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Students
        </Link>
        <h1 className="text-3xl font-bold mt-2">{fullName}</h1>
        <p className="text-muted-foreground font-mono mt-1">
          {student.studentNo}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Last Name</p>
          <p className="font-medium">{student.lastName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">First Name</p>
          <p className="font-medium">{student.firstName}</p>
        </div>
        {student.middleName && (
          <div>
            <p className="text-sm text-muted-foreground">Middle Name</p>
            <p className="font-medium">{student.middleName}</p>
          </div>
        )}
        {student.sex && (
          <div>
            <p className="text-sm text-muted-foreground">Sex</p>
            <p className="font-medium">{student.sex}</p>
          </div>
        )}
        {student.birthDate && (
          <div>
            <p className="text-sm text-muted-foreground">Birth Date</p>
            <p className="font-medium">{formatDateManila(student.birthDate)}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-medium">
            <Badge variant={student.isActive ? "default" : "secondary"}>
              {student.isActive ? "Active" : "Inactive"}
            </Badge>
          </p>
        </div>
      </div>

      {student.address && (
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="font-medium">{student.address}</p>
        </div>
      )}

      {(student.guardianName || student.guardianPhone) && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Guardian Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {student.guardianName && (
              <div>
                <p className="text-sm text-muted-foreground">Guardian Name</p>
                <p className="font-medium">{student.guardianName}</p>
              </div>
            )}
            {student.guardianPhone && (
              <div>
                <p className="text-sm text-muted-foreground">Guardian Phone</p>
                <p className="font-medium">{student.guardianPhone}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Enrollments</h2>
        </div>
        {student.enrollments.length === 0 ? (
          <p className="text-muted-foreground">
            No enrollments found for this student.
          </p>
        ) : (
          <DataTable
            columns={columns}
            data={student.enrollments}
            searchPlaceholder="Search enrollments..."
          />
        )}
      </div>
    </div>
  );
}
