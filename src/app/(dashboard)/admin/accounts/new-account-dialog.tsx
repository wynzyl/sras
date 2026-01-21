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
import { createAccountAction } from "./_actions";
import type { ActionResult } from "@/core/shared/action-result";

interface NewAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Account"}
    </Button>
  );
}

export function NewAccountDialog({ open, onOpenChange }: NewAccountDialogProps) {
  const [type, setType] = React.useState<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, formAction] = React.useActionState<
    ActionResult<{ id: string; code: string }>,
    FormData
  >(async (prevState, formData) => {
    const result = await createAccountAction({
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      isActive: formData.get("isActive") === "true",
    });
    return result;
  }, { ok: false, error: { message: "" } });

  React.useEffect(() => {
    if (state.ok) {
      onOpenChange(false);
      setType("");
      formRef.current?.reset();
    }
  }, [state.ok, onOpenChange]);

  React.useEffect(() => {
    if (!open) {
      setType("");
      formRef.current?.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            Add a new account to the chart of accounts.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              placeholder="CASH"
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
              placeholder="Cash Account"
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
            <Label htmlFor="type">Type</Label>
            <Select name="type" value={type} onValueChange={setType} required>
              <SelectTrigger
                className={
                  state.ok === false && state.error.fieldErrors?.type
                    ? "border-destructive"
                    : ""
                }
              >
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASSET">Asset</SelectItem>
                <SelectItem value="LIABILITY">Liability</SelectItem>
                <SelectItem value="EQUITY">Equity</SelectItem>
                <SelectItem value="REVENUE">Revenue</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="CONTRA_REVENUE">Contra Revenue</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="type" value={type} />
            {state.ok === false && state.error.fieldErrors?.type && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.type}
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
