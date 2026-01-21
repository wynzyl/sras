"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";
import { createFeeScheduleAction } from "./_actions";
import type { ActionResult } from "@/core/shared/action-result";
import type { SchoolYear, GradeLevel } from "@prisma/client";

interface NewFeeScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolYears: SchoolYear[];
  gradeLevels: GradeLevel[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Fee Schedule"}
    </Button>
  );
}

export function NewFeeScheduleDialog({
  open,
  onOpenChange,
  schoolYears,
  gradeLevels,
}: NewFeeScheduleDialogProps) {
  const [schoolYearId, setSchoolYearId] = React.useState<string>("");
  const [gradeLevelId, setGradeLevelId] = React.useState<string>("");
  const [isDefault, setIsDefault] = React.useState<string>("false");
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction] = React.useActionState<
    ActionResult<{ id: string; name: string }>,
    FormData
  >(async (prevState, formData) => {
    const result = await createFeeScheduleAction({
      schoolYearId: formData.get("schoolYearId") as string,
      gradeLevelId: formData.get("gradeLevelId") as string,
      name: formData.get("name") as string,
      isDefault: formData.get("isDefault") === "true",
      isActive: true,
    });
    return result;
  }, { ok: false, error: { message: "" } });

  React.useEffect(() => {
    if (state.ok) {
      onOpenChange(false);
      setSchoolYearId("");
      setGradeLevelId("");
      setIsDefault("false");
      formRef.current?.reset();
    }
  }, [state.ok, onOpenChange]);

  React.useEffect(() => {
    if (!open) {
      setSchoolYearId("");
      setGradeLevelId("");
      setIsDefault("false");
      formRef.current?.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Fee Schedule</DialogTitle>
          <DialogDescription>
            Add a new fee schedule for a school year and grade level.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schoolYearId">School Year</Label>
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
            <Label htmlFor="gradeLevelId">Grade Level</Label>
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Standard Fee Schedule"
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
            <Label htmlFor="isDefault">Default</Label>
            <select
              id="isDefault"
              name="isDefault"
              value={isDefault}
              onChange={(e) => setIsDefault(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-white text-black px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {state.ok === false && state.error.message && (
            <p className="text-sm text-destructive">{state.error.message}</p>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
