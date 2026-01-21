"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { FeeSchedule } from "@prisma/client";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/components/button";
import { Badge } from "@/ui/components/badge";
import { NewFeeScheduleDialog } from "./new-fee-schedule-dialog";
import type { SchoolYear, GradeLevel } from "@prisma/client";

type FeeScheduleWithRelations = FeeSchedule & {
  schoolYear: SchoolYear;
  gradeLevel: GradeLevel;
};

/**
 * Fee schedules table component
 */
export function FeeSchedulesTable({
  feeSchedules,
  schoolYears,
  gradeLevels,
}: {
  feeSchedules: FeeScheduleWithRelations[];
  schoolYears: SchoolYear[];
  gradeLevels: GradeLevel[];
}) {
  const columns: ColumnDef<FeeScheduleWithRelations>[] = React.useMemo(
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
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ row }) => {
          const schedule = row.original;
          return (
            <Link
              href={`/admin/fee-schedules/${schedule.id}`}
              className="text-primary hover:underline"
            >
              {schedule.name}
            </Link>
          );
        },
      },
      {
        accessorKey: "isDefault",
        header: "Default",
        enableSorting: true,
        cell: ({ row }) => {
          const isDefault = row.getValue("isDefault") as boolean;
          return isDefault ? (
            <Badge variant="default">Default</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
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
    <DataTable
      columns={columns}
      data={feeSchedules}
      searchPlaceholder="Search fee schedules..."
    />
  );
}

/**
 * New Fee Schedule button component
 */
export function NewFeeScheduleButton({
  schoolYears,
  gradeLevels,
}: {
  schoolYears: SchoolYear[];
  gradeLevels: GradeLevel[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Fee Schedule</Button>
      <NewFeeScheduleDialog
        open={open}
        onOpenChange={setOpen}
        schoolYears={schoolYears}
        gradeLevels={gradeLevels}
      />
    </>
  );
}

// Attach as a property for backward compatibility
FeeSchedulesTable.NewFeeScheduleButton = NewFeeScheduleButton;
