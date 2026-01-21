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
import { createCurriculumVersionAction } from "./_actions";
import type { ActionResult } from "@/core/shared/action-result";

interface NewCurriculumVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Curriculum Version"}
    </Button>
  );
}

export function NewCurriculumVersionDialog({
  open,
  onOpenChange,
}: NewCurriculumVersionDialogProps) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction] = React.useActionState<
    ActionResult<{ id: string; name: string }>,
    FormData
  >(async (prevState, formData) => {
    const result = await createCurriculumVersionAction({
      name: formData.get("name") as string,
      effectiveDate: formData.get("effectiveDate") as string,
      isActive: formData.get("isActive") === "true",
    });
    return result;
  }, { ok: false, error: { message: "" } });

  React.useEffect(() => {
    if (state.ok) {
      onOpenChange(false);
      formRef.current?.reset();
    }
  }, [state.ok, onOpenChange]);

  React.useEffect(() => {
    if (!open) {
      formRef.current?.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Curriculum Version</DialogTitle>
          <DialogDescription>
            Add a new curriculum version to the system.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="K-12 Curriculum 2024"
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
            <Label htmlFor="effectiveDate">Effective Date</Label>
            <Input
              id="effectiveDate"
              name="effectiveDate"
              type="date"
              required
              className={
                state.ok === false && state.error.fieldErrors?.effectiveDate
                  ? "border-destructive"
                  : ""
              }
            />
            {state.ok === false && state.error.fieldErrors?.effectiveDate && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.effectiveDate}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Status</Label>
            <select
              id="isActive"
              name="isActive"
              defaultValue="true"
              className="flex h-10 w-full rounded-md border border-input bg-white text-black px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
