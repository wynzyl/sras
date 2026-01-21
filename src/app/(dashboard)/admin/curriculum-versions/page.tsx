import { listCurriculumVersions } from "@/core/academic/repo";
import {
  CurriculumVersionsTable,
  NewCurriculumVersionButton,
} from "./curriculum-versions-table";

export default async function CurriculumVersionsPage() {
  const curriculumVersions = await listCurriculumVersions();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Curriculum Versions</h1>
        <NewCurriculumVersionButton />
      </div>
      <CurriculumVersionsTable curriculumVersions={curriculumVersions} />
    </div>
  );
}
