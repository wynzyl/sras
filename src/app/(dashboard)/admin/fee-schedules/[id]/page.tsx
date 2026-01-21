import { notFound } from "next/navigation";
import { getFeeScheduleWithLines, listFeeItems } from "@/core/accounting/repo";
import { FeeScheduleDetail } from "./fee-schedule-detail";

export default async function FeeScheduleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [feeSchedule, feeItems] = await Promise.all([
    getFeeScheduleWithLines(id),
    listFeeItems(),
  ]);

  if (!feeSchedule) {
    notFound();
  }

  return <FeeScheduleDetail feeSchedule={feeSchedule} feeItems={feeItems} />;
}
