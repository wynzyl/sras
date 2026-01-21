"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { Subject, GradeLevel, CurriculumVersion } from "@prisma/client";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/components/button";
import { Badge } from "@/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";
import { NewSubjectDialog } from "./new-subject-dialog";
import { listSubjectsAction } from "./_actions";

type SubjectWithRelations = Subject & {
  gradeLevel: GradeLevel;
  curriculumVersion: CurriculumVersion;
};

/**
 * Subjects table component with filters
 */
export function SubjectsTable({
  gradeLevels,
  curriculumVersions,
}: {
  gradeLevels: GradeLevel[];
  curriculumVersions: CurriculumVersion[];
}) {
  const [selectedGradeLevelId, setSelectedGradeLevelId] =
    React.useState<string>("");
  const [selectedCurriculumVersionId, setSelectedCurriculumVersionId] =
    React.useState<string>("");
  const [subjects, setSubjects] = React.useState<SubjectWithRelations[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Load subjects when filters change
  React.useEffect(() => {
    if (selectedGradeLevelId && selectedCurriculumVersionId) {
      setIsLoading(true);
      listSubjectsAction({
        gradeLevelId: selectedGradeLevelId,
        curriculumVersionId: selectedCurriculumVersionId,
      })
        .then(setSubjects)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setSubjects([]);
    }
  }, [selectedGradeLevelId, selectedCurriculumVersionId]);

  const columns: ColumnDef<SubjectWithRelations>[] = React.useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        enableSorting: true,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "units",
        header: "Units",
        enableSorting: true,
        cell: ({ row }) => {
          const units = row.getValue("units") as number | null;
          return units !== null ? units : <span className="text-muted-foreground">—</span>;
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => {
          const isActive = row.getValue("isActive") as boolean;
          return (
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
    ],
    []
  );

  const canShowTable =
    selectedGradeLevelId && selectedCurriculumVersionId;
  const canAddSubject =
    selectedGradeLevelId && selectedCurriculumVersionId;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="space-y-2 w-64">
          <label className="text-sm font-medium">Grade Level</label>
          <Select
            value={selectedGradeLevelId}
            onValueChange={setSelectedGradeLevelId}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2 w-64">
          <label className="text-sm font-medium">Curriculum Version</label>
          <Select
            value={selectedCurriculumVersionId}
            onValueChange={setSelectedCurriculumVersionId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select curriculum version" />
            </SelectTrigger>
            <SelectContent>
              {curriculumVersions.map((cv) => (
                <SelectItem key={cv.id} value={cv.id}>
                  {cv.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {canAddSubject && (
          <div className="flex-1 flex justify-end">
            <NewSubjectDialog
              gradeLevelId={selectedGradeLevelId}
              curriculumVersionId={selectedCurriculumVersionId}
              gradeLevels={gradeLevels}
              curriculumVersions={curriculumVersions}
            />
          </div>
        )}
      </div>

      {canShowTable && (
        <div>
          {isLoading ? (
            <p className="text-muted-foreground">Loading subjects...</p>
          ) : (
            <DataTable
              columns={columns}
              data={subjects}
              searchPlaceholder="Search subjects..."
            />
          )}
        </div>
      )}

      {!canShowTable && (
        <p className="text-muted-foreground">
          Please select a grade level and curriculum version to view subjects.
        </p>
      )}
    </div>
  );
}
