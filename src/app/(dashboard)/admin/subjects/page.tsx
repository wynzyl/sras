import { listGradeLevels, listCurriculumVersions } from "@/core/academic/repo";
import { SubjectsTable } from "./subjects-table";

export default async function SubjectsPage() {
  const [gradeLevels, curriculumVersions] = await Promise.all([
    listGradeLevels(),
    listCurriculumVersions(),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subjects</h1>
      </div>
      <SubjectsTable
        gradeLevels={gradeLevels}
        curriculumVersions={curriculumVersions}
      />
    </div>
  );
}
