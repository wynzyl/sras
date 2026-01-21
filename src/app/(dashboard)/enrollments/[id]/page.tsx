import { notFound } from "next/navigation";
import { getEnrollment } from "@/core/students/repo";
import { EnrollmentDetail } from "./enrollment-detail";

export default async function EnrollmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enrollment = await getEnrollment(id);

  if (!enrollment) {
    notFound();
  }

  return <EnrollmentDetail enrollment={enrollment} />;
}
