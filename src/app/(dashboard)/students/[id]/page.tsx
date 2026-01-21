import { notFound } from "next/navigation";
import { getStudent } from "@/core/students/repo";
import { StudentDetail } from "./student-detail";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    notFound();
  }

  return <StudentDetail student={student} />;
}
