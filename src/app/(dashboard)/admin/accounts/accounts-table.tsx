"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { Account } from "@prisma/client";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/components/button";
import { Badge } from "@/ui/components/badge";
import { NewAccountDialog } from "./new-account-dialog";

/**
 * Accounts table component
 */
export function AccountsTable({ accounts }: { accounts: Account[] }) {
  const columns: ColumnDef<Account>[] = React.useMemo(
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
        accessorKey: "type",
        header: "Type",
        enableSorting: true,
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <Badge variant="outline" className="uppercase">
              {type.replace("_", " ")}
            </Badge>
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

  return <DataTable columns={columns} data={accounts} searchPlaceholder="Search accounts..." />;
}

/**
 * New Account button component
 */
AccountsTable.NewAccountButton = function NewAccountButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Account</Button>
      <NewAccountDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
