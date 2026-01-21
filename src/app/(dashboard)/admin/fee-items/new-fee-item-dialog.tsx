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
import { createFeeItemAction } from "./_actions";
import type { ActionResult } from "@/core/shared/action-result";
import type { Account } from "@prisma/client";

interface NewFeeItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Fee Item"}
    </Button>
  );
}

export function NewFeeItemDialog({
  open,
  onOpenChange,
  accounts,
}: NewFeeItemDialogProps) {
  const [code, setCode] = React.useState<string>("");
  const [revenueAccountCode, setRevenueAccountCode] = React.useState<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction] = React.useActionState<
    ActionResult<{ id: string; code: string }>,
    FormData
  >(async (prevState, formData) => {
    const result = await createFeeItemAction({
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      defaultAmountCents: formData.get("defaultAmountCents") as string,
      revenueAccountCode: formData.get("revenueAccountCode") as string,
      isActive: formData.get("isActive") === "true",
    });
    return result;
  }, { ok: false, error: { message: "" } });

  React.useEffect(() => {
    if (state.ok) {
      onOpenChange(false);
      setCode("");
      setRevenueAccountCode("");
      formRef.current?.reset();
    }
  }, [state.ok, onOpenChange]);

  React.useEffect(() => {
    if (!open) {
      setCode("");
      setRevenueAccountCode("");
      formRef.current?.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Fee Item</DialogTitle>
          <DialogDescription>
            Add a new fee item to the system.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              placeholder="TUITION_FEE"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
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
              placeholder="Tuition Fee"
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
            <Label htmlFor="defaultAmountCents">Default Amount (PHP)</Label>
            <Input
              id="defaultAmountCents"
              name="defaultAmountCents"
              type="number"
              step="0.01"
              min="0"
              placeholder="1000.00"
              required
              className={
                state.ok === false && state.error.fieldErrors?.defaultAmountCents
                  ? "border-destructive"
                  : ""
              }
            />
            {state.ok === false && state.error.fieldErrors?.defaultAmountCents && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.defaultAmountCents}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueAccountCode">Revenue Account</Label>
            <Select
              value={revenueAccountCode}
              onValueChange={setRevenueAccountCode}
              required
            >
              <SelectTrigger
                className={
                  state.ok === false && state.error.fieldErrors?.revenueAccountCode
                    ? "border-destructive"
                    : ""
                }
              >
                <SelectValue placeholder="Select revenue account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  .filter((acc) => acc.isActive)
                  .map((account) => (
                    <SelectItem key={account.id} value={account.code}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              name="revenueAccountCode"
              value={revenueAccountCode}
            />
            {state.ok === false && state.error.fieldErrors?.revenueAccountCode && (
              <p className="text-sm text-destructive">
                {state.error.fieldErrors.revenueAccountCode}
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
