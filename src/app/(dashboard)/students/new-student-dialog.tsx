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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";
import { createStudentAction } from "./_actions";
import type { ActionResult } from "@/core/shared/action-result";

interface NewStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Student"}
    </Button>
  );
}

export function NewStudentDialog({
  open,
  onOpenChange,
}: NewStudentDialogProps) {
  const [sex, setSex] = React.useState<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState<
    ActionResult<{ id: string; studentNo: string }>,
    FormData
  >(async (prevState, formData) => {
    const birthDateStr = formData.get("birthDate") as string;
    const birthDate = birthDateStr ? new Date(birthDateStr) : null;

    const result = await createStudentAction({
      studentNo: formData.get("studentNo") as string,
      lastName: formData.get("lastName") as string,
      firstName: formData.get("firstName") as string,
      middleName: (formData.get("middleName") as string) || null,
      sex: (formData.get("sex") as "MALE" | "FEMALE" | null) || null,
      birthDate: birthDate,
      address: (formData.get("address") as string) || null,
      guardianName: (formData.get("guardianName") as string) || null,
      guardianPhone: (formData.get("guardianPhone") as string) || null,
      isActive: formData.get("isActive") === "true",
    });
    return result;
  }, { ok: false, error: { message: "" } });

  React.useEffect(() => {
    if (state.ok) {
      onOpenChange(false);
      setSex("");
      formRef.current?.reset();
    }
  }, [state.ok, onOpenChange]);

  React.useEffect(() => {
    if (!open) {
      setSex("");
      formRef.current?.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
          <DialogDescription>
            Add a new student to the system.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentNo">Student Number *</Label>
              <Input
                id="studentNo"
                name="studentNo"
                placeholder="2024-001"
                required
                className={
                  state.ok === false && state.error.fieldErrors?.studentNo
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.studentNo && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.studentNo}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select value={sex} onValueChange={setSex}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="sex" value={sex} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                className={
                  state.ok === false && state.error.fieldErrors?.lastName
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.lastName && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.lastName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
                className={
                  state.ok === false && state.error.fieldErrors?.firstName
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.firstName && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                placeholder="Smith"
                className={
                  state.ok === false && state.error.fieldErrors?.middleName
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.middleName && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.middleName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                className={
                  state.ok === false && state.error.fieldErrors?.birthDate
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.birthDate && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.birthDate}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main St, City"
              className={
                state.ok === false && state.error.fieldErrors?.address
                  ? "border-destructive"
                  : ""
              }
            />
            {state.ok === false && state.error.fieldErrors?.address && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianName">Guardian Name</Label>
              <Input
                id="guardianName"
                name="guardianName"
                placeholder="Jane Doe"
                className={
                  state.ok === false && state.error.fieldErrors?.guardianName
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.guardianName && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.guardianName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Guardian Phone</Label>
              <Input
                id="guardianPhone"
                name="guardianPhone"
                placeholder="+63 912 345 6789"
                className={
                  state.ok === false && state.error.fieldErrors?.guardianPhone
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.guardianPhone && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.guardianPhone}
                </p>
              )}
            </div>
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
