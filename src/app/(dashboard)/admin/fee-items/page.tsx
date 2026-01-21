import { listFeeItems, listAccounts } from "@/core/accounting/repo";
import { FeeItemsTable } from "./fee-items-table";

export default async function FeeItemsPage() {
  const [feeItems, accounts] = await Promise.all([
    listFeeItems(),
    listAccounts(),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fee Items</h1>
        <FeeItemsTable.NewFeeItemButton accounts={accounts} />
      </div>
      <FeeItemsTable feeItems={feeItems} accounts={accounts} />
    </div>
  );
}
