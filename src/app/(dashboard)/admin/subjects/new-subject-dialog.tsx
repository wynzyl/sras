"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/dialog";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { createSubjectAction } from "./_actions";
import type { ActionResult } from "@/core/shared/action-result";
import type { GradeLevel, CurriculumVersion } from "@prisma/client";

interface NewSubjectDialogProps {
  gradeLevelId: string;
  curriculumVersionId: string;
  gradeLevels: GradeLevel[];
  curriculumVersions: CurriculumVersion[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Subject"}
    </Button>
  );
}

export function NewSubjectDialog({
  gradeLevelId,
  curriculumVersionId,
  gradeLevels,
  curriculumVersions,
}: NewSubjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState<
    ActionResult<{ id: string; code: string }>,
    FormData
  >(async (prevState, formData) => {
    const unitsStr = formData.get("units") as string;
    const units = unitsStr ? parseInt(unitsStr, 10) : null;

    const result = await createSubjectAction({
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      units: units,
      gradeLevelId,
      curriculumVersionId,
      schoolYearId: null,
      isActive: formData.get("isActive") === "true",
    });
    return result;
  }, { ok: false, error: { message: "" } });

  React.useEffect(() => {
    if (state.ok) {
      setOpen(false);
      formRef.current?.reset();
    }
  }, [state.ok]);

  React.useEffect(() => {
    if (!open) {
      formRef.current?.reset();
    }
  }, [open]);

  const selectedGradeLevel = gradeLevels.find((gl) => gl.id === gradeLevelId);
  const selectedCurriculumVersion = curriculumVersions.find(
    (cv) => cv.id === curriculumVersionId
  );

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Subject</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subject</DialogTitle>
            <DialogDescription>
              Add a new subject for {selectedGradeLevel?.name} -{" "}
              {selectedCurriculumVersion?.name}
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                placeholder="MATH101"
                required
                className={
                  state.ok === false && state.error.fieldErrors?.code
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.code && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.code}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Mathematics"
                required
                className={
                  state.ok === false && state.error.fieldErrors?.name
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.name && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="units">Units (Optional)</Label>
              <Input
                id="units"
                name="units"
                type="number"
                min="1"
                placeholder="3"
                className={
                  state.ok === false && state.error.fieldErrors?.units
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.units && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.units}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <select
                id="isActive"
                name="isActive"
                defaultValue="true"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {state.ok === false && state.error.message && (
              <p className="text-sm text-destructive">{state.error.message}</p>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <SubmitButton />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
