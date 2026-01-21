import { getActiveSchoolYear, listGradeLevels, listSchoolYears } from "@/core/academic/repo";
import { NewEnrollmentForm } from "./new-enrollment-form";

export default async function NewEnrollmentPage() {
  const [activeSchoolYear, gradeLevels, schoolYears] = await Promise.all([
    getActiveSchoolYear(),
    listGradeLevels(),
    listSchoolYears(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">New Enrollment</h1>
        <p className="text-muted-foreground mt-1">
          Enroll a student for a school year and grade level.
        </p>
      </div>
      <NewEnrollmentForm
        defaultSchoolYearId={activeSchoolYear?.id}
        schoolYears={schoolYears}
        gradeLevels={gradeLevels}
      />
    </div>
  );
}
