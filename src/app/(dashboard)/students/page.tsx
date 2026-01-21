import { StudentsTable, NewStudentButton } from "./students-table";

export default async function StudentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <NewStudentButton />
      </div>
      <StudentsTable />
    </div>
  );
}
