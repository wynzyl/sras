"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { FeeItem } from "@prisma/client";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/components/button";
import { Badge } from "@/ui/components/badge";
import { formatCentsToPHP } from "@/lib/money";
import { NewFeeItemDialog } from "./new-fee-item-dialog";
import type { Account } from "@prisma/client";

/**
 * Fee items table component
 */
export function FeeItemsTable({
  feeItems,
  accounts,
}: {
  feeItems: FeeItem[];
  accounts: Account[];
}) {
  const columns: ColumnDef<FeeItem>[] = React.useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        enableSorting: true,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "defaultAmountCents",
        header: "Default Amount",
        enableSorting: true,
        cell: ({ row }) => {
          const cents = row.getValue("defaultAmountCents") as number;
          return formatCentsToPHP(cents);
        },
      },
      {
        accessorKey: "revenueAccountCode",
        header: "Revenue Account",
        enableSorting: true,
        cell: ({ row }) => {
          const code = row.getValue("revenueAccountCode") as string;
          return <code className="text-sm">{code}</code>;
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
      data={feeItems}
      searchPlaceholder="Search fee items..."
    />
  );
}

/**
 * New Fee Item button component
 */
FeeItemsTable.NewFeeItemButton = function NewFeeItemButton({
  accounts,
}: {
  accounts: Account[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Fee Item</Button>
      <NewFeeItemDialog
        open={open}
        onOpenChange={setOpen}
        accounts={accounts}
      />
    </>
  );
};
