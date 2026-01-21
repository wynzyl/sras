"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/ui/components/button";
import { Badge } from "@/ui/components/badge";
import { Separator } from "@/ui/components/separator";
import { DataTable } from "@/ui/data-table";
import { formatCentsToPHP } from "@/lib/money";
import { AddFeeScheduleLineDialog } from "./add-fee-schedule-line-dialog";
import { listFeeItems } from "@/core/accounting/repo";
import type { FeeSchedule, FeeScheduleLine, FeeItem } from "@prisma/client";
import type { SchoolYear, GradeLevel } from "@prisma/client";

type FeeScheduleWithRelations = FeeSchedule & {
  schoolYear: SchoolYear;
  gradeLevel: GradeLevel;
  lines: (FeeScheduleLine & {
    feeItem: FeeItem;
  })[];
};

/**
 * Fee schedule detail component
 */
export function FeeScheduleDetail({
  feeSchedule,
  feeItems,
}: {
  feeSchedule: FeeScheduleWithRelations;
  feeItems: FeeItem[];
}) {
  const columns: ColumnDef<FeeScheduleLine & { feeItem: FeeItem }>[] =
    React.useMemo(
      () => [
        {
          accessorKey: "feeItem.code",
          header: "Fee Item Code",
          enableSorting: true,
          cell: ({ row }) => {
            return <code className="text-sm">{row.original.feeItem.code}</code>;
          },
        },
        {
          accessorKey: "feeItem.name",
          header: "Fee Item Name",
          enableSorting: true,
          cell: ({ row }) => {
            return row.original.feeItem.name;
          },
        },
        {
          accessorKey: "amountCents",
          header: "Amount",
          enableSorting: true,
          cell: ({ row }) => {
            const cents = row.getValue("amountCents") as number;
            return formatCentsToPHP(cents);
          },
        },
        {
          accessorKey: "isRequired",
          header: "Required",
          enableSorting: true,
          cell: ({ row }) => {
            const isRequired = row.getValue("isRequired") as boolean;
            return (
              <Badge variant={isRequired ? "default" : "secondary"}>
                {isRequired ? "Required" : "Optional"}
              </Badge>
            );
          },
        },
        {
          accessorKey: "sortOrder",
          header: "Sort Order",
          enableSorting: true,
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const line = row.original;
            return (
              <DeleteLineButton
                lineId={line.id}
                feeScheduleId={feeSchedule.id}
              />
            );
          },
        },
      ],
      [feeSchedule.id]
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/fee-schedules"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Fee Schedules
          </Link>
          <h1 className="text-3xl font-bold mt-2">{feeSchedule.name}</h1>
        </div>
        <AddFeeScheduleLineDialog
          feeScheduleId={feeSchedule.id}
          feeItems={feeItems}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">School Year</p>
          <p className="font-medium">{feeSchedule.schoolYear.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Grade Level</p>
          <p className="font-medium">{feeSchedule.gradeLevel.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Default</p>
          <p className="font-medium">
            {feeSchedule.isDefault ? (
              <Badge variant="default">Yes</Badge>
            ) : (
              "No"
            )}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-medium">
            <Badge variant={feeSchedule.isActive ? "default" : "secondary"}>
              {feeSchedule.isActive ? "Active" : "Inactive"}
            </Badge>
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Fee Schedule Lines</h2>
        </div>
        <DataTable
          columns={columns}
          data={feeSchedule.lines}
          searchPlaceholder="Search lines..."
        />
      </div>
    </div>
  );
}

/**
 * Delete line button component
 */
function DeleteLineButton({
  lineId,
  feeScheduleId,
}: {
  lineId: string;
  feeScheduleId: string;
}) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this line?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { deleteFeeScheduleLineAction } = await import("../_actions");
      await deleteFeeScheduleLineAction(lineId, feeScheduleId);
    } catch (error) {
      console.error("Failed to delete line:", error);
      alert("Failed to delete line. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Remove"}
    </Button>
  );
}
