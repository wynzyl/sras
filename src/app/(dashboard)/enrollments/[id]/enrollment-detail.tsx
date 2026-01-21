"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/ui/components/badge";
import { Separator } from "@/ui/components/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/card";
import { formatDateManila } from "@/lib/dates";
import type { Enrollment, Student, SchoolYear, GradeLevel } from "@prisma/client";

type EnrollmentWithRelations = Enrollment & {
  student: Student;
  schoolYear: SchoolYear;
  gradeLevel: GradeLevel;
};

/**
 * Enrollment detail component
 */
export function EnrollmentDetail({
  enrollment,
}: {
  enrollment: EnrollmentWithRelations;
}) {
  const fullName = [
    enrollment.student.firstName,
    enrollment.student.middleName,
    enrollment.student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/enrollments/new"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to New Enrollment
        </Link>
        <h1 className="text-3xl font-bold mt-2">Enrollment Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrollment Summary</CardTitle>
          <CardDescription>Basic enrollment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="font-medium">
                <Link
                  href={`/students/${enrollment.student.id}`}
                  className="text-primary hover:underline"
                >
                  {fullName}
                </Link>
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {enrollment.student.studentNo}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">School Year</p>
              <p className="font-medium">{enrollment.schoolYear.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Grade Level</p>
              <p className="font-medium">{enrollment.gradeLevel.name}</p>
            </div>
            {enrollment.sectionName && (
              <div>
                <p className="text-sm text-muted-foreground">Section</p>
                <p className="font-medium">{enrollment.sectionName}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">
                <Badge
                  variant={
                    enrollment.status === "ENROLLED"
                      ? "default"
                      : enrollment.status === "RESERVED"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {enrollment.status}
                </Badge>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enrolled At</p>
              <p className="font-medium">
                {formatDateManila(enrollment.enrolledAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Assessment</CardTitle>
          <CardDescription>Fee assessment and breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming next</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ledger</CardTitle>
          <CardDescription>Financial transactions and balance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming next</p>
        </CardContent>
      </Card>
    </div>
  );
}
