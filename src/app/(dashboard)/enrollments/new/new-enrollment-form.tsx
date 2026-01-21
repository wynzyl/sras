"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/card";
import { createEnrollmentAction, searchStudentsForEnrollmentAction } from "../_actions";
import type { ActionResult } from "@/core/shared/action-result";
import type { GradeLevel, SchoolYear } from "@prisma/client";
import type { Student } from "@prisma/client";

interface NewEnrollmentFormProps {
  defaultSchoolYearId?: string;
  schoolYears: SchoolYear[];
  gradeLevels: GradeLevel[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating Enrollment..." : "Create Enrollment"}
    </Button>
  );
}

export function NewEnrollmentForm({
  defaultSchoolYearId,
  schoolYears,
  gradeLevels,
}: NewEnrollmentFormProps) {
  const [studentSearchQuery, setStudentSearchQuery] = React.useState("");
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [schoolYearId, setSchoolYearId] = React.useState<string>(defaultSchoolYearId || "");
  const [gradeLevelId, setGradeLevelId] = React.useState<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);

  // Debounce student search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (studentSearchQuery.trim().length > 0) {
        setIsSearching(true);
        searchStudentsForEnrollmentAction(studentSearchQuery)
          .then((results) => {
            setStudents(results);
            setIsSearching(false);
          })
          .catch((error) => {
            console.error("Search error:", error);
            setIsSearching(false);
          });
      } else {
        setStudents([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [studentSearchQuery]);

  const [state, formAction] = React.useActionState<
    ActionResult<{ id: string }>,
    FormData
  >(async (prevState, formData) => {
    if (!selectedStudent) {
      return {
        ok: false,
        error: { message: "Please select a student", fieldErrors: { studentId: "Student is required" } },
      };
    }

    // Add studentId to formData
    formData.set("studentId", selectedStudent.id);
    const result = await createEnrollmentAction(formData);
    return result;
  }, { ok: false, error: { message: "" } });

  React.useEffect(() => {
    if (!state.ok && state.error.message) {
      // Keep form open on error
    }
  }, [state]);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setStudentSearchQuery(`${student.studentNo} - ${student.lastName}, ${student.firstName}`);
    setStudents([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Details</CardTitle>
        <CardDescription>
          Fill in the information to create a new enrollment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentSearch">Student *</Label>
            <div className="relative">
              <Input
                id="studentSearch"
                placeholder="Search by student number or name..."
                value={studentSearchQuery}
                onChange={(e) => {
                  setStudentSearchQuery(e.target.value);
                  setSelectedStudent(null);
                }}
                className={
                  state.ok === false && state.error.fieldErrors?.studentId
                    ? "border-destructive"
                    : ""
                }
              />
              {students.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => handleStudentSelect(student)}
                      className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
                    >
                      <div className="font-medium">
                        {student.studentNo} - {student.lastName}, {student.firstName}
                      </div>
                      {student.middleName && (
                        <div className="text-sm text-muted-foreground">
                          {student.middleName}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {isSearching && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg p-4 text-center text-muted-foreground">
                  Searching...
                </div>
              )}
            </div>
            {selectedStudent && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  Selected: {selectedStudent.studentNo} - {selectedStudent.lastName}, {selectedStudent.firstName}
                </p>
              </div>
            )}
            {state.ok === false && state.error.fieldErrors?.studentId && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.studentId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolYearId">School Year *</Label>
            <Select value={schoolYearId} onValueChange={setSchoolYearId} required>
              <SelectTrigger
                className={
                  state.ok === false && state.error.fieldErrors?.schoolYearId
                    ? "border-destructive"
                    : ""
                }
              >
                <SelectValue placeholder="Select school year" />
              </SelectTrigger>
              <SelectContent>
                {schoolYears.map((sy) => (
                  <SelectItem key={sy.id} value={sy.id}>
                    {sy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="schoolYearId" value={schoolYearId} />
            {state.ok === false && state.error.fieldErrors?.schoolYearId && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.schoolYearId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradeLevelId">Grade Level *</Label>
            <Select value={gradeLevelId} onValueChange={setGradeLevelId} required>
              <SelectTrigger
                className={
                  state.ok === false && state.error.fieldErrors?.gradeLevelId
                    ? "border-destructive"
                    : ""
                }
              >
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {gradeLevels.map((gl) => (
                  <SelectItem key={gl.id} value={gl.id}>
                    {gl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="gradeLevelId" value={gradeLevelId} />
            {state.ok === false && state.error.fieldErrors?.gradeLevelId && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.gradeLevelId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectionName">Section (Optional)</Label>
            <Input
              id="sectionName"
              name="sectionName"
              placeholder="Section A"
              className={
                state.ok === false && state.error.fieldErrors?.sectionName
                  ? "border-destructive"
                  : ""
              }
            />
            {state.ok === false && state.error.fieldErrors?.sectionName && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.sectionName}
              </p>
            )}
          </div>

          {state.ok === false && state.error.message && (
            <p className="text-sm text-destructive">{state.error.message}</p>
          )}

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
