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
import { addFeeScheduleLineAction } from "../_actions";
import type { ActionResult } from "@/core/shared/action-result";
import type { FeeItem } from "@prisma/client";

interface AddFeeScheduleLineDialogProps {
  feeScheduleId: string;
  feeItems: FeeItem[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Line"}
    </Button>
  );
}

export function AddFeeScheduleLineDialog({
  feeScheduleId,
  feeItems,
}: AddFeeScheduleLineDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [feeItemId, setFeeItemId] = React.useState<string>("");
  const [isRequired, setIsRequired] = React.useState<string>("true");
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction] = React.useActionState<
    ActionResult<{ id: string }>,
    FormData
  >(async (prevState, formData) => {
    const result = await addFeeScheduleLineAction({
      feeScheduleId,
      feeItemId: formData.get("feeItemId") as string,
      amountCents: formData.get("amountCents") as string,
      isRequired: formData.get("isRequired") === "true",
      sortOrder: parseInt(formData.get("sortOrder") as string, 10),
    });
    return result;
  }, { ok: false, error: { message: "" } });

  React.useEffect(() => {
    if (state.ok) {
      setOpen(false);
      setFeeItemId("");
      setIsRequired("true");
      formRef.current?.reset();
    }
  }, [state.ok]);

  React.useEffect(() => {
    if (!open) {
      setFeeItemId("");
      setIsRequired("true");
      formRef.current?.reset();
    }
  }, [open]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Line</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fee Schedule Line</DialogTitle>
            <DialogDescription>
              Add a fee item to this fee schedule.
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feeItemId">Fee Item</Label>
              <Select value={feeItemId} onValueChange={setFeeItemId} required>
                <SelectTrigger
                  className={
                    state.ok === false && state.error.fieldErrors?.feeItemId
                      ? "border-destructive"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select fee item" />
                </SelectTrigger>
                <SelectContent>
                  {feeItems
                    .filter((item) => item.isActive)
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.code} - {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="feeItemId" value={feeItemId} />
              {state.ok === false && state.error.fieldErrors?.feeItemId && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.feeItemId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountCents">Amount (PHP)</Label>
              <Input
                id="amountCents"
                name="amountCents"
                type="number"
                step="0.01"
                min="0"
                placeholder="1000.00"
                required
                className={
                  state.ok === false && state.error.fieldErrors?.amountCents
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.amountCents && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.amountCents}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isRequired">Required</Label>
              <select
                id="isRequired"
                name="isRequired"
                value={isRequired}
                onChange={(e) => setIsRequired(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-white text-black px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="true">Required</option>
                <option value="false">Optional</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                placeholder="0"
                required
                className={
                  state.ok === false && state.error.fieldErrors?.sortOrder
                    ? "border-destructive"
                    : ""
                }
              />
              {state.ok === false && state.error.fieldErrors?.sortOrder && (
                <p className="text-sm text-destructive">
                  {state.error.fieldErrors.sortOrder}
                </p>
              )}
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
