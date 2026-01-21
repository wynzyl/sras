import { listAccounts } from "@/core/accounting/repo";
import { AccountsTable } from "./accounts-table";

export default async function AccountsPage() {
  const accounts = await listAccounts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <AccountsTable.NewAccountButton />
      </div>
      <AccountsTable accounts={accounts} />
    </div>
  );
}
