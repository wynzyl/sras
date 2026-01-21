import { listFeeSchedules } from "@/core/accounting/repo";
import { listSchoolYears, listGradeLevels } from "@/core/academic/repo";
import {
  FeeSchedulesTable,
  NewFeeScheduleButton,
} from "./fee-schedules-table";

export default async function FeeSchedulesPage() {
  const [feeSchedules, schoolYears, gradeLevels] = await Promise.all([
    listFeeSchedules(),
    listSchoolYears(),
    listGradeLevels(),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fee Schedules</h1>
        <NewFeeScheduleButton
          schoolYears={schoolYears}
          gradeLevels={gradeLevels}
        />
      </div>
      <FeeSchedulesTable
        feeSchedules={feeSchedules}
        schoolYears={schoolYears}
        gradeLevels={gradeLevels}
      />
    </div>
  );
}
