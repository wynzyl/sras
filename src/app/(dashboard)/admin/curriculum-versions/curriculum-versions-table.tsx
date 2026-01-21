"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { CurriculumVersion } from "@prisma/client";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/components/button";
import { Badge } from "@/ui/components/badge";
import { formatDateManila } from "@/lib/dates";
import { NewCurriculumVersionDialog } from "./new-curriculum-version-dialog";

/**
 * Curriculum versions table component
 */
export function CurriculumVersionsTable({
  curriculumVersions,
}: {
  curriculumVersions: CurriculumVersion[];
}) {
  const columns: ColumnDef<CurriculumVersion>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "effectiveDate",
        header: "Effective Date",
        enableSorting: true,
        cell: ({ row }) => {
          const date = row.getValue("effectiveDate") as Date;
          return formatDateManila(date);
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
      data={curriculumVersions}
      searchPlaceholder="Search curriculum versions..."
    />
  );
}

/**
 * New Curriculum Version button component
 */
function NewCurriculumVersionButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Curriculum Version</Button>
      <NewCurriculumVersionDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

// Attach as a property for backward compatibility
CurriculumVersionsTable.NewCurriculumVersionButton = NewCurriculumVersionButton;

// Also export separately for better compatibility
export { NewCurriculumVersionButton };
